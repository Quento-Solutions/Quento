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
        <h4 class="not-margin text-title text-4xl">Questions</h4>
      </div>
    </template>

    <div
      class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden"
    >
      <div class="w-full p-6" style="">
        <vs-input
          v-model="title"
          placeholder="Question Title"
          label="Title"
          class="block"
          width="w-6"
        >
          <template #icon>
            <i class="bx bx-highlight" primary></i>
          </template>
        </vs-input>
      </div>

      <div class="p-6 w-full lg:w-1/2">
        <vs-select
          label="Subject"
          filter
          class="block w-full"
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
      </div>
      <div class="p-6 w-full lg:w-1/2">
        <vs-select
          label="Grade"
          filter
          class="block w-full"
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
      </div>
      <div class="w-full p-6 px-10 pt-0">
        <VsTextarea
          v-model="contents"
          placeholder="What do you want to ask?"
          class="block"
          height="30rem"
          label="Question Body"
          @paste="onPaste"
        ></VsTextarea>
      </div>
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 md:px-12 px-2">
        <vs-button
          class="md:w-1/2 w-full"
          warn
          :disabled="formErrors"
          @click="PreviewQuestion()"
        >
          <div class="text-xl p-2 font-bold lg:text-2xl" style="">
            Preview Question
          </div>
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, mixins, Watch } from 'nuxt-property-decorator'

import { notesStore, windowStore, questionStore } from '~/store'
import UserMixin from '~/mixins/UserMixin'

import {
  NestedSubjectList,
  SubjectGroup_O,
  Subject_O,
  SubjectIconList,
  Grade_O,
  GradeList,
  Keyword_O
} from '~/types/subjects'

import { Note } from '~/types/notes'
import PasteImage from '~/mixins/PasteImagesMixin'

import { Question } from '~/types/questions'

interface imageSrc {
  error: boolean
  orientation: 'w' | 'l'
  percent: number | string | null
  remove: boolean | null
  src: string | null
}

@Component<PostQuestionModal>({
  components: {
  }
})
export default class PostQuestionModal extends mixins(
  PasteImage,
  UserMixin
) {
  
  get active() {
    return questionStore.PostQuestionModalOpen
  }
  set active(value: boolean) {
    questionStore.SET_POST_MODAL_OPEN(value)
  }



  subjectSelect: Subject_O | '' = ''
  gradeSelect: Grade_O | '' = ''

  @Watch('IsReset')
  onResetChanged(value: boolean, oldVal: boolean) {
    if (value) {
      this.ClearFields()
      questionStore.SET_RESET(false)
    }
  }

  get IsReset() {
    return questionStore.IsReset
  }

  readonly GradeList = GradeList
  Cancel() {}
  // make this a mixin
  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
  readonly SubjectGroupList = NestedSubjectList

  title = ''
  contents = ''
  ClearFields() {
    this.title = this.contents = this.subjectSelect = this.gradeSelect = ''
  }

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  async PreviewQuestion() {
    if (this.formErrors) {
      this.$vs.notification({
        color: 'danger',
        title: 'Fill Out All Fields!'
      })
      return
    }

    const previewQuestion = new Question({
      title: this.title,
      userId: this.AuthUser?.uid!,
      userDisplayName: this.AuthUser?.displayName!,
      userPhotoUrl: this.AuthUser?.photoURL!,
      createdAt: new Date(),
      upVotes: 0,
      views: 0,
      responses: 0,
      keywords: this.keywords,
      contents: this.contents,
      subject : this.subjectSelect as Subject_O,
      grade : this.gradeSelect as Grade_O,
      storedImages : this.images
    })

    questionStore.SET_PREVIEW_QUESTION(Object.assign({}, previewQuestion));
  }

  get keywords() {
    return [this.subjectSelect, this.gradeSelect].filter(
      (v) => v != ''
    ) as Keyword_O[]
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
