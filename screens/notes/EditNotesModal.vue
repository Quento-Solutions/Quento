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
        <h4 class="not-margin text-title text-4xl"><b>Posted</b> Notes</h4>
      </div>
    </template>

    <div
      class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden"
    >
      <vs-input
        v-model="ActiveNote.title"
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
        v-model="ActiveNote.subject"
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
      <VsTextarea
        v-model="ActiveNote.contents"
        placeholder="Sourced from Switzerland, shipped and packaged in Columbia, distributed and sold in the U.S."
        class="block"
        height="20rem"
        label="NOTABLE Content"
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
@Component<EditNotesModal>({

})
export default class EditNotesModal extends mixins(PasteImage) {

  ActiveNote : Note | null = null;
  get contents()
  {
    return this.ActiveNote?.contents || ''
  }
  set contents(value)
  {
    this.ActiveNote? this.ActiveNote.contents = value : '';
  }
  @Watch('StoreEditNotes')
  onStoreEditNoteChanged(value : Note | null, oldVal : Note | null)
  {
    this.ActiveNote = Object.assign({}, value);
    this.images = value?.storedImages ? [...value.storedImages] : [];
    // console.log(value, this.ActiveNote);
  }

  get StoreEditNotes()
  {
    return notesStore.EditingNote;
  }

  readonly GradeList = GradeList.filter(v=>v!=='ALL');
  
  // make this a mixin
  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
  readonly SubjectGroupList = NestedSubjectList

  get active() {
    return notesStore.EditModalOpen
  }

  set active(value: boolean) {
    if(!value) notesStore.SetEditNote(null);
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
    this.ActiveNote!.storedImages = [...this.images];
    notesStore.SetPreviewNote(Object.assign({}, this.ActiveNote));
    notesStore.TogglePreviewModal(true)
  }

  get formErrors() {
    return (
      !this.ActiveNote ||
      !(this.ActiveNote.title) ||
      !this.ActiveNote.subject||
      !this.ActiveNote.grade ||
      !this.ActiveNote.contents
    )
  }
}
</script>


