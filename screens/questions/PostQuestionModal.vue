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
        <h4 class="not-margin text-title text-4xl">Post A Question</h4>
      </div>
    </template>
    <vs-alert v-if="contents.length > characterLimit" danger>Your note cannot exceed 5000 characters</vs-alert>

    <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden">
      <div class="w-full p-6" style>
        <vs-input v-model="title" placeholder="Title" class="block" width="w-6">
          <template #icon>
            <i class="bx bx-highlight" primary></i>
          </template>
        </vs-input>
      </div>
      <div class="px-6 w-full">
        <vs-select
          filter
          class="block my-3 mb-6 w-full"
          placeholder="Group"
          :loading="groupsLoading"
          v-model="groupSelect"
        >
          <vs-option value="false" label="No Group">None</vs-option>
          <vs-option
            v-for="(school, subIndex) in userGroups"
            :key="subIndex"
            :label="school.title"
            :value="school.id"
          >
            <div class="font-bold truncate">{{ school.title }}</div>
          </vs-option>
        </vs-select>
        <vs-select
          filter
          class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
          placeholder="School"
          :disabled="group"
          v-model="schoolSelect"
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
      </div>

      <div class="p-6 w-full lg:w-1/2">
        <vs-select
          filter
          class="block w-full"
          placeholder="Subject"
          v-model="subjectSelect"
          :disabled="group"
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
      </div>
      <div class="p-6 w-full lg:w-1/2">
        <vs-select
          filter
          class="block w-full"
          placeholder="Grade"
          v-model="gradeSelect"
          :disabled="group"
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
          placeholder="Enter your content here"
          class="block rounded-lg pl-1"
          ref="textarea"
          expand="true"
          markdownOptions="true"
          @paste="onPaste"
        ></VsTextarea>
      </div>
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 md:px-12 px-2">
        <vs-button
          class="md:w-1/2 w-full"
          warn
          :disabled="formErrors || contents.length > characterLimit"
          @click="PreviewQuestion()"
        >
          <div class="text-xl p-2 font-bold lg:text-2xl" style>Preview Question</div>
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import {Component, Vue, Prop, mixins, Watch} from 'nuxt-property-decorator'

import {notesStore, windowStore, questionStore, groupsStore} from '~/store'
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

import {Note} from '~/types/notes'
import PasteImage from '~/mixins/PasteImagesMixin'

import {Question} from '~/types/questions'
import {SchoolList, School_O} from '~/types/schools'
import {Group} from '~/types/groups'

interface imageSrc {
  error: boolean
  orientation: 'w' | 'l'
  percent: number | string | null
  remove: boolean | null
  src: string | null
}

@Component<PostQuestionModal>({
  components: {},
  async mounted() {
    if (!this.userGroups.length && !groupsStore.userGroupFetched) {
      this.groupsLoading = true
      await groupsStore.GetUserGroups()
      this.groupsLoading = false
    }
  }
})
export default class PostQuestionModal extends mixins(PasteImage, UserMixin) {
  characterLimit = 5000
  readonly SchoolList = ['All Schools', ...SchoolList]
  schoolSelect: School_O | 'All Schools' = 'All Schools'

  groupSelect = ''
  groupsLoading = false

  group: Group | null = null

  @Watch('groupSelect')
  watchGroup(val: string, oldVal: string) {
    const group = this.userGroups.find((v) => v.id === val)
    if (!group) {
      this.unsetGroup()
    } else {
      this.setGroup(group)
    }
  }

  unsetGroup() {
    console.log('UNSET GROUP')
    this.group = null
  }

  setGroup(group: Group) {
    this.schoolSelect = group.school || 'All Schools'

    this.gradeSelect = group.grade || 'ALL'
    this.subjectSelect = group.subject || ''
    this.group = group
  }
  get userGroups() {
    return groupsStore.userGroups.filter(group => group.approved)
  }
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
      userDisplayName: this.UserData?.displayName!,
      userPhotoUrl: this.UserData?.photoURL!,
      createdAt: new Date(),
      upVotes: 0,
      views: 0,
      responses: 0,
      school:
        this.schoolSelect != 'All Schools' ? this.schoolSelect : undefined,
      keywords: this.keywords,
      contents: this.contents,
      subject: this.subjectSelect as Subject_O,
      grade: this.gradeSelect as Grade_O,
      storedImages: this.images
    })
    if(this.group)
    {
      previewQuestion.groupId = this.group.id;
      previewQuestion.groupName = this.group.title
    }
    questionStore.SET_PREVIEW_QUESTION(Object.assign({}, previewQuestion))
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
