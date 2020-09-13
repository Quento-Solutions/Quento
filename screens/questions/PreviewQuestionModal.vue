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
          <b>Question</b>
        </h4>
      </div>
    </template>

    <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden">
      <QuestionCard v-if="previewQuestion" :question="previewQuestion" :disabled="true"></QuestionCard>
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 md:px-12 px-2">
        <vs-button class="md:w-1/2 w-full" success @click="PostNote()">
          <div class="text-xl p-2 font-bold lg:text-2xl" style>Post Question</div>
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'

import {suggestionsStore, windowStore, authStore, questionStore} from '~/store'
import {
  NestedSubjectList,
  SubjectGroup_O,
  Subject_O,
  SubjectIconList,
  Grade_O,
  GradeList
} from '~/types/subjects'
import {Note} from '~/types/notes'

import QuestionCard from '~/components/QuestionCard.vue'

@Component<PreviewNotesModal>({
  components: {
    QuestionCard
  }
})
export default class PreviewNotesModal extends Vue {
  get previewQuestion() {
    return questionStore.PreviewQuestion
  }

  get active() {
    return questionStore.PreviewModalOpen
  }
  set active(value: boolean) {
    questionStore.SET_PREVIEW_QUESTION(null)
  }

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  async PostNote() {
    if (!this.previewQuestion) return

    const loading = this.$vs.loading()

    try {
      await questionStore.CreateQuestion(this.previewQuestion)

      this.$vs.notification({
        color: 'success',
        title: 'Question Posted'
      })
      await questionStore.ResetPosts()
    } catch (error) {
      this.$qto.error(error)
    }
    this.active = false
    loading.close()
  }
}
</script>

<style lang="scss">
.vs-select__options {
  z-index: 1000000000;
}
</style>
