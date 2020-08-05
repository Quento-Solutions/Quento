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
        ref="imageUpload"
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
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import { suggestionsStore, notesStore, windowStore } from '~/store'
import {
  NestedSubjectList,
  SubjectGroup_O,
  Subject_O,
  SubjectIconList,
  Grade_O,
  GradeList
} from '~/types/subjects'
import { Note } from '~/types/notes'
import VsTextarea from '~/components/VsTextarea.vue'
import VsUpload from '~/components/VsUpload.vue'

import { authStore } from '~/store'
import { auth } from 'firebase'
@Component<PostNotesModal>({
  components: {
    VsTextarea,
    VsUpload
  }
})
export default class PostNotesModal extends Vue {
  subjectSelect: Subject_O | '' = ''
  gradeSelect: Grade_O | '' = ''

  readonly GradeList = GradeList
  Cancel()
  {

  }
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

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  async PreviewNote() {
    interface imageSrc {
      error: boolean
      orientation: 'w' | 'l'
      percent: number | string | null
      remove: boolean | null
      src: string | null
    }
    const refs = this.$refs.imageUpload as Vue & {
      filesx: HTMLInputElement[]
      srcs: imageSrc[],
      itemRemove : any[]
    }
    const itemRemove = refs.itemRemove;
    const srcs = refs.srcs.filter((src) => !src.remove).map((src) => src.src!)
    const imageUpload = refs.filesx
    // window.refs= refs;
    // const
    // Figure out how to retrieve the image file + url, render it as a preview note card, and then handle backend shit
    console.log({ imageUpload, refs })

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
      images: srcs
    })

    notesStore.SetPreviewNote(previewNote)
    notesStore.TogglePreviewModal(true)
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
      !this.contents
    )
  }
}
</script>

<style lang="scss">
.vs-select__options {
  z-index: 1000000000;
}
.content-popup {
  .vs-dialog--scroll .vs-dialog__content {
    max-height: calc(100vh - 200px);
  }

  .vs-dialog {
    min-width: 40vw !important;
    min-height: 60vh !important;
  }
}
</style>
