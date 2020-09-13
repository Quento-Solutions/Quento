<template>
  <vs-dialog
    v-model="active"
    id="suggestionsPopup"
    class="content-popup"
    style="z-index: 1000000001;"
    scroll
    :full-screen="!isLargeScreen"
    prevent-close
    overflow-hidden
  >
    <template #header>
      <div class="pt-10">
        <h4 class="not-margin text-title text-4xl">
          Preview
          <b>Posted</b> Note
        </h4>
      </div>
    </template>

    <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden">
      <NotesCard v-if="previewNote" :note="previewNote" :disabled="true"></NotesCard>
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 md:px-12 px-2">
        <vs-button class="md:w-1/2 w-full" success @click="PostNote()">
          <div class="text-xl p-2 font-bold lg:text-2xl" style>POSTED NOTE</div>
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'

import {suggestionsStore, notesStore, windowStore, authStore} from '~/store'
import {
  NestedSubjectList,
  SubjectGroup_O,
  Subject_O,
  SubjectIconList,
  Grade_O,
  GradeList
} from '~/types/subjects'
import {Note} from '~/types/notes'

import NotesCard from '~/components/NotesCard.vue'

@Component<PreviewNotesModal>({
  components: {
    NotesCard
  }
})
export default class PreviewNotesModal extends Vue {
  get previewNote() {
    return notesStore.PreviewNote
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
    if (!notesStore.PreviewNote) return

    const loading = this.$vs.loading()

    try {
      await notesStore.PostNote({
        note: notesStore.PreviewNote
      })

      this.$vs.notification({
        color: 'success',
        title: 'Worked'
      })
      await notesStore.ResetPosts()
    } catch (error) {
      this.$qto.error(error)
    }
    this.state = false
    loading.close()
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
</style>
