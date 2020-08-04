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
          <div class="font-bold truncate">
            Grade {{ grade }}
          </div>
        </vs-option>
      </vs-select>
      <VsTextarea
        v-model="contents"
        placeholder="Sourced from Switzerland, shipped and packaged in Columbia, distributed and sold in the U.S."
        class="block"
        height="20rem"
        label="Feature Suggestion"
      >
      </VsTextarea>
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 px-12">
        <vs-button
          class="md:w-1/2 p-8 w-full"
          style="padding: 8;"
          size="xl"
          success
          :disabled="formErrors"
          @click="PostSuggestion()"
        >
          Post
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
import VsTextarea from '~/components/VsTextarea.vue'

@Component<SuggestionModal>({
  components: {
    VsTextarea
  }
})
export default class SuggestionModal extends Vue {
  subjectSelect: Subject_O | '' = ''
  gradeSelect : Grade_O | '' = '';

  readonly GradeList = GradeList
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

  async PostSuggestion() {
    if (this.formErrors) {
      this.$vs.notification({
        color: 'danger',
        title: 'Fill Out All Fields!'
      })
      return
    }

    const loading = this.$vs.loading()
    const payload = { title: this.title, contents: this.contents }
    try {
      await suggestionsStore.PostSuggestion(payload)
      this.$vs.notification({
        color: 'success',
        title: 'Suggestion Posted!',
        text:
          'Thank you for your insights, we will notify you once it is implemented!'
      })
      await suggestionsStore.GetSuggestions()
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
    this.title = this.contents = ''
    this.active = false
  }
  get state() {
    return this.active
  }

  get formErrors() {
    return !this.contents || !this.title
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
