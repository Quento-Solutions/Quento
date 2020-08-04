<template>
  <vs-dialog
    v-model="active"
    id="suggestionsPopup"
    class="content-popup"
    style="z-index: 1000000001;"
    scroll
    :full-screen="!isLargeScreen"
    prevent-close
  >
    <template #header>
      <div class="pt-10">
        <h4 class="not-margin text-title text-4xl">Preview <b>Posted</b> Note</h4>
      </div>
    </template>

    <div
      class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden"
    >
      <NotesCard v-if="previewNote" :note="previewNote"/> 
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 px-12">
        <vs-button
          class="md:w-1/2 p-8 w-full"
          style="padding: 8;"
          size="xl"
          warn
          :disabled="false && formErrors"
          @click="PostNote()"
        >
          PREVIEW NOTE
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import { suggestionsStore, notesStore, windowStore, authStore } from '~/store'
import {
  NestedSubjectList,
  SubjectGroup_O,
  Subject_O,
  SubjectIconList,
  Grade_O,
  GradeList
} from '~/types/subjects';
import {
  Note
} from '~/types/notes'

import NotesCard from '~/components/NotesCard.vue';

@Component<PreviewNotesModal>({
  components: {
    NotesCard
  }
})
export default class PreviewNotesModal extends Vue {
  get previewNote()
  {
    return notesStore.PreviewNote;
  }

  get active() {
    return notesStore.PreviewModalOpen
  }
  set active(value: boolean) {
    notesStore.TogglePreviewModal(value)
  }

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  async PostNote() {

    const loading = this.$vs.loading();

    try {

      this.state = false
      loading.close()
    } catch (error) {
      this.$vs.notification({
        color: 'danger',
        title: 'An Error Occurred While Posting Your Suggestion'
      })

      this.state = false
      loading.close()
    }
  }

  set state(value: boolean) {
    this.active = false
  }

  get state() {
    return this.active
  }

}
</script>

<style lang="scss">
.vs-select__options {
  z-index: 1000000000;
}
.content-popup {
  .vs-dialog--scroll .vs-dialog__content
  {
    max-height: calc(100vh - 200px);
  }

  .vs-dialog {
    min-width: 40vw !important;
    min-height: 60vh !important;
  }
}
</style>
