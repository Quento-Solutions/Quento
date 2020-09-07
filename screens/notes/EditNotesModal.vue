<template>
  <vs-dialog
    v-model="active"
    id="editNotesModal"
    class="content-popup"
    style="z-index: 1000000000;"
    scroll
    :full-screen="!isLargeScreen"
    prevent-close
    overflow-hidden
    v-if="ActiveNote"
  >
    <template #header>
      <div class="pt-10">
        <h4 class="not-margin text-title text-4xl">
          <b>Posted</b> Notes
        </h4>
      </div>
    </template>
    <vs-alert v-if="contents.length > characterLimit" danger>Your note cannot exceed 5000 characters</vs-alert>
    <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden">
      <vs-input
        v-model="ActiveNote.title"
        placeholder="Title"
        class="block mb-3 w-6 mt-3"
        width="w-6"
      >
        <template #icon>
          <i class="bx bx-highlight" primary></i>
        </template>
      </vs-input>

      <vs-select
        filter
        class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
        placeholder="Subject"
        v-model="ActiveNote.subject"
      >
        <vs-option-group v-for="(subjectGroup, index) in SubjectGroupList" :key="index">
          <div slot="title" class="w-full vx-row">
            <i class="bx text-xl mr-2" :class="subjectGroup.iconClass" />
            <div class="font-bold truncate">{{ subjectGroup.name }}</div>
          </div>
          <vs-option
            v-for="(subject, subIndex) in subjectGroup.items"
            :key="subIndex"
            :label="subject.name"
            :value="subject.name"
          >
            <i class="bx text-3xl mr-2" :class="subject.iconClass" />
            <div class="font-bold truncate">{{ subject.name }}</div>
          </vs-option>
        </vs-option-group>
      </vs-select>
      <vs-select
        filter
        class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
        placeholder="Grade"
        v-model="ActiveNote.grade"
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
      <vs-select
        filter
        class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
        placeholder="School"
        v-model="activeSchool"
      >
        <vs-option
          v-for="(school, subIndex) in SchoolList"
          :key="subIndex"
          :label="school"
          :value="school"
        >
          <div class="font-bold truncate">{{ school }}</div>
        </vs-option>
      </vs-select>
      <VsTextarea
        v-model="ActiveNote.contents"
        placeholder="Enter your content here"
        class="block rounded-lg pl-1"
        ref="textarea"
        expand="true"
        markdownOptions="true"
        @paste="onPaste"
      />
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 md:px-12 px-2">
        <vs-button
          class="md:w-1/2 w-full"
          warn
          :disabled="formErrors || contents.length > characterLimit"
          @click="PreviewNote()"
        >
          <div class="text-xl p-2 font-bold lg:text-2xl" style>PREVIEW NOTE</div>
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, mixins, Watch } from 'nuxt-property-decorator'

import { suggestionsStore, notesStore, windowStore } from '~/store'
import {
  NestedSubjectList,
  SubjectGroup_O,
  Subject_O,
  SubjectIconList,
  Grade_O,
  GradeList
} from '~/types/subjects'

import ValidateImage from '~/mixins/ValidateImageMixin'
import PasteImage from '~/mixins/PasteImagesMixin'
import { Note } from '~/types/notes'
import { authStore } from '~/store'
import { SchoolList, School_O } from '~/types/schools'
@Component<EditNotesModal>({})
export default class EditNotesModal extends mixins(PasteImage) {
  ActiveNote: Note | null = null
  characterLimit = 5000
  readonly SchoolList = ['All Schools', ...SchoolList] as const

  get contents() {
    return this.ActiveNote?.contents || ''
  }
  set contents(value) {
    this.ActiveNote ? (this.ActiveNote.contents = value) : ''
  }
  
  activeSchool : "All Schools" | School_O = "All Schools";
  @Watch('StoreEditNotes')
  onStoreEditNoteChanged(value: Note | null, oldVal: Note | null) {
    this.ActiveNote = Object.assign({}, value)
    this.images = value?.storedImages ? [...value.storedImages] : []
    this.activeSchool = value?.school || "All Schools";
    // console.log(value, this.ActiveNote);
  }

  get StoreEditNotes() {
    return notesStore.EditingNote
  }

  readonly GradeList = GradeList.filter((v) => v !== 'ALL')

  // make this a mixin
  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
  readonly SubjectGroupList = NestedSubjectList

  get active() {
    return notesStore.EditModalOpen
  }

  set active(value: boolean) {
    if (!value) notesStore.SetEditNote(null)
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
    this.ActiveNote!.school = this.activeSchool == "All Schools" ? undefined : this.activeSchool;
    this.ActiveNote!.storedImages = [...this.images]
    notesStore.SetPreviewNote(Object.assign({}, this.ActiveNote))
    notesStore.TogglePreviewModal(true)
  }

  get formErrors() {
    return (
      !this.ActiveNote ||
      !this.ActiveNote.title ||
      !this.ActiveNote.subject ||
      !this.ActiveNote.grade ||
      !this.ActiveNote.contents
    )
  }
}
</script>


