<template>
  <vs-dialog
    v-model="active"
    id="suggestionsPopup"
    class="content-popup"
    style="z-index: 1000000000;"
    scroll
    :full-screen="!isLargeScreen"
    prevent-close
    overflow-hidden
  >
    <template #header>
      <div class="pt-10">
        <h4 class="not-margin text-title text-4xl"><b>Posted</b> Notes</h4>
      </div>
    </template>

    <div
      class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden"
    >
      <vs-input
        v-model="title"
        placeholder="You should sell chocolate"
        label="Title"
        class="block mb-6 w-6 mt-6"
        width="w-6"
      >
        <template #icon>
          <i class="bx bx-highlight" primary></i>
        </template>
      </vs-input>

      <vs-select
        label="Subject"
        filter
        class="block mb-6 w-6 mt-6 w-full lg:w-1/2"
        placeholder="Subject"
        v-model="subjectSelect"
      >
        <vs-option-group
          v-for="(subjectGroup, index) in SubjectGroupList"
          :key="index"
        >
          <div slot="title" class="w-full vx-row">
            <i class="bx text-xl mr-2" :class="subjectGroup.iconClass" />
            <div class="font-bold truncate">
              {{ subjectGroup.name }}
            </div>
          </div>
          <vs-option
            v-for="(subject, subIndex) in subjectGroup.items"
            :key="subIndex"
            :label="subject.name"
            :value="subject.name"
          >
            <i class="bx text-3xl mr-2" :class="subject.iconClass" />
            <div class="font-bold truncate">
              {{ subject.name }}
            </div>
          </vs-option>
        </vs-option-group>
      </vs-select>
      <vs-select
        label="Grade"
        filter
        class="block mb-6 w-6 mt-6 w-full lg:w-1/2"
        placeholder="Grade"
        v-model="gradeSelect"
      >
        <vs-option
          v-for="(grade, subIndex) in GradeList"
          :key="subIndex"
          :label="`Grade ${grade}`"
          :value="grade"
        >
          <div class="font-bold truncate">Grade {{ grade }}</div>
        </vs-option>
      </vs-select>
      <VsTextarea
        v-model="contents"
        placeholder="Sourced from Switzerland, shipped and packaged in Columbia, distributed and sold in the U.S."
        class="block"
        height="20rem"
        label="NOTABLE Content"
        ref="textarea"
        @paste="onPaste"
      >
      </VsTextarea>
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 md:px-12 px-2">
        <vs-button
          class="md:w-1/2 w-full"
          warn
          :disabled="formErrors"
          @click="PreviewNote()"
        >
          <div class="text-xl p-2 font-bold lg:text-2xl" style="">
            PREVIEW NOTE
          </div>
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, mixins, Watch } from 'nuxt-property-decorator'

import { suggestionsStore, notesStore, windowStore, newslettersStore } from '~/store'
import {
  NestedSubjectList,
  SubjectGroup_O,
  Subject_O,
  SubjectIconList,
  Grade_O,
  GradeList
} from '~/types/subjects'

import ValidateImage from '~/mixins/ValidateImageMixin'
import { Note } from '~/types/notes'
import VsTextarea from '~/components/VsTextarea.vue'
import VsUpload from '~/components/VsUpload.vue'
import storage from '~/plugins/firebaseStorage';
import { v4 } from 'uuid'

import { authStore } from '~/store'

interface imageSrc {
  error: boolean
  orientation: 'w' | 'l'
  percent: number | string | null
  remove: boolean | null
  src: string | null
}

@Component<PostNotesModal>({
  components: {
    VsTextarea,
    VsUpload
  }
})
export default class PostNotesModal extends mixins(ValidateImage) {
  subjectSelect: Subject_O | '' = ''
  gradeSelect: Grade_O | '' = ''

  async onPaste(evt : any)
  {
    if(evt.clipboardData.files.length)
    {
      const loading = this.$vs.loading();
      const files = [...evt.clipboardData.files] as File[];
      console.log({files}, files.map);
      const uploadRefs = files.map(async (image : File) => {
        const uid = v4()
        const fileName = image.name.toLowerCase()
        const extMatches = fileName.match(/\.([^\.]+)$/)
        var ext = extMatches ? extMatches[0] : ''
        const imageName = `${uid}${ext}`
        const imageRef = storage.ref(imageName)
        const imageReuploadName = `postedNote@${imageName}`
        const snapshot = await imageRef.put(image)
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          snapshot.ref.bucket
        }/o/${encodeURIComponent(imageReuploadName)}?alt=media`
        // return await snapshot.ref.;
        this.insertAtCursor(evt.target, `\n![image](${imageUrl})\n`);
        this.images.push(imageUrl);
        return imageUrl
        // https://firebasestorage.googleapis.com/v0/b/supplant-44e15.appspot.com/o/thumb%40256_e9320c0e-a80e-485d-864d-0fa97d665cff.jpg?alt=media&token=2315a102-391e-48f4-a05b-37ed2fd96fb3
      })
      await Promise.all(uploadRefs)
      loading.close();
    }
    if(evt.clipboardData.files.length)
    {
      console.log("files", evt.clipboardData.files)
      this.insertAtCursor(evt.target, "\n![image](https://user-images.githubusercontent.com/46302202/90639577-d92f8600-e1fc-11ea-89a2-78bd7be184f9.png)\n");
    }
  }

  images : string[] = [];

  get textareaRef()
  {
    return this.$refs.textarea as HTMLInputElement
  }
  insertAtCursor(myField : HTMLInputElement, myValue : string) {
      //IE support

      //MOZILLA and others
      if (myField.selectionStart || myField.selectionStart == 0) {
          var startPos = myField.selectionStart;
          var endPos = myField.selectionEnd || myField.selectionStart;
          this.contents = myField.value.substring(0, startPos)
              + myValue
              + myField.value.substring(endPos!, myField.value.length);
      } else {
          this.contents+= myValue;
      }
  }
  @Watch('IsReset')
  onResetChanged(value : boolean, oldVal : boolean)
  {
    if(value)
    {
      this.ClearFields();
      notesStore.SET_RESET(false);
    }
  }

  get IsReset()
  {
    return notesStore.IsReset;
  }

  readonly GradeList = GradeList.filter(v=>v!=='ALL');
  Cancel() {}
  // make this a mixin
  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
  readonly SubjectGroupList = NestedSubjectList
  get active() {
    return notesStore.NotesModuleOpen
  }
  set active(value: boolean) {
    notesStore.ToggleNotesModule(value)
  }
  title = ''
  contents = ''
  ClearFields()
  {
    this.title = this.contents = this.subjectSelect = this.gradeSelect = '';
  }

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  async PreviewNote() {
    
    if (this.formErrors) {
      this.$vs.notification({
        color: 'danger',
        title: 'Fill Out All Fields!'
      })
      return
    }

    const previewNote = new Note({
      title: this.title,
      uid: authStore.user?.uid!,
      userDisplayName: authStore.user?.displayName!,
      userPhotoUrl: authStore.user?.photoURL!,
      createdAt: new Date(),
      upVotes: 0,
      views: 0,
      subject: this.subjectSelect as Subject_O,
      grade: this.gradeSelect as Grade_O,
      contents: this.contents,
      images : [...this.images]
    })

    notesStore.SetPreviewNote(previewNote)
    notesStore.TogglePreviewModal(true)
  }

  get formErrors() {
    return (
      !this.title ||
      this.subjectSelect === '' ||
      this.gradeSelect === '' ||
      !this.contents
    )
  }
}
</script>


