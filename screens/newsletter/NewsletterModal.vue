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
      >
      </VsTextarea>
      <VsUpload
        :show-upload-button="false"
        multiple
        text="Upload Image(s)"
        accept="image/*"
        ref="postImageUpload"
      />
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
import { Newsletter } from '~/types/newsletters'
import VsTextarea from '~/components/VsTextarea.vue'
import VsUpload from '~/components/VsUpload.vue'

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

  @Watch('IsReset')
  onResetChanged(value : boolean, oldVal : boolean)
  {
    if(value)
    {
      this.ClearFields();
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
    return newslettersStore.postNewsletterModalOpen
  }
  set active(value: boolean) {
    newslettersStore.SET_POST_MODAL_OPEN(value)
  }
  title = ''
  contents = ''
  ClearFields()
  {
    this.title=  this.contents = this.subjectSelect = this.gradeSelect = '';
    this.srcs?.forEach(src => src.remove = true);
  }
  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  get imageRefs() {
    return (this.$refs.postImageUpload as Vue & {
      filesx: File[]
      srcs: imageSrc[]
      itemRemove: any[]
    }|undefined)?.filesx;
  }
  get srcs()
  {
    return (this.$refs.postImageUpload as Vue & {
      filesx: File[]
      srcs: imageSrc[]
      itemRemove: any[]
    } | undefined)?.srcs;
  }
  async PreviewNote() {
    const refs = this.$refs.postImageUpload as Vue & {
      filesx: File[]
      srcs: imageSrc[]
      itemRemove: any[]
    } | undefined
    const itemRemove = refs?.itemRemove
    const srcs = refs?.srcs.filter((src) => !src.remove).map((src) => src.src!)
    const postImageUpload = refs?.filesx
    
    if (this.formErrors) {
      this.$vs.notification({
        color: 'danger',
        title: 'Fill Out All Fields!'
      })
      return
    }

    const previewNote = new Newsletter({
      title: this.title,
      createdAt: new Date(),
      views: 0,
      contents: this.contents,
      backgroundImageUrl : "https://media.discordapp.net/attachments/738198413987938464/744677326499086347/wp5910896.jpg?width=1211&height=681",
      authorDisplayName : "Quento Team",
      authorPhotoUrl : "https://cdn.discordapp.com/attachments/737856336133357669/744956933114691634/quag_but_purple.png"
    });

    await this.$fire.firestore.collection("newsletters").doc("welcome-newsletter").set(Newsletter.toFirebase(previewNote));
  }

  set state(value: boolean) {
    this.title = this.contents = ''
    this.active = false
  }
  get state() {
    return this.active
  }

  get formErrors() {
    return (
      !this.title ||
      this.subjectSelect == '' ||
      this.gradeSelect == '' ||
      !this.contents ||

      (this.imageRefs && this.imageRefs.filter(image => this.validateImageType(image)).length < this.imageRefs.length)
    )
  }
}
</script>


