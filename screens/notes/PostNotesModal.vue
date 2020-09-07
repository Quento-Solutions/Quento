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
        <h4 class="not-margin text-title text-4xl">
          <b>Posted</b> Notes
        </h4>
      </div>
    </template>
    <vs-alert v-if="contents.length > characterLimit" danger>Your note cannot exceed 5000 characters</vs-alert>
    <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden">
      <vs-input v-model="title" placeholder="Title" class="block mb-3 w-6 mt-3" width="w-6">
        <template #icon>
          <i class="bx bx-highlight" primary></i>
        </template>
      </vs-input>

      <vs-select
        filter
        class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
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
      <vs-select
        filter
        class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
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
      <vs-select
        filter
        class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
        placeholder="School"
        v-model="schoolSelect"
        :disabled="group"
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
        v-model="contents"
        placeholder="Enter your content here"
        class="block rounded-lg pl-1"
        ref="textarea"
        expand="true"
        markdownOptions="true"
        @paste="onPaste"
      ></VsTextarea>
    </div>
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
  </vs-dialog>
</template>

<script lang="ts">
import {Component, Vue, Prop, mixins, Watch} from 'nuxt-property-decorator'

import {
  suggestionsStore,
  notesStore,
  windowStore,
  groupsStore,
  newslettersStore
} from '~/store'
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
import {Note} from '~/types/notes'
import VsUpload from '~/components/VsUpload.vue'
import storage from '~/plugins/firebaseStorage'
import functions from '~/plugins/firebaseFunctions'

import {v4} from 'uuid'

import {authStore} from '~/store'
import {School_O, SchoolList} from '~/types/schools'
import {Group} from '~/types/groups'

interface imageSrc {
  error: boolean
  orientation: 'w' | 'l'
  percent: number | string | null
  remove: boolean | null
  src: string | null
}

@Component<PostNotesModal>({
  components: {
    VsUpload
  },
  async mounted() {

    if (!this.userGroups.length && !groupsStore.userGroupFetched) {
      this.groupsLoading = true
      await groupsStore.GetUserGroups()
      this.groupsLoading = false
    }
    if(this.presetGroup) this.groupSelect = this.presetGroup.id || '';
    
  }
})
export default class PostNotesModal extends mixins(ValidateImage, PasteImage) {
  @Prop({required: false}) presetGroup ?: Group;

  subjectSelect: Subject_O | '' = ''
  gradeSelect: Grade_O | '' = ''
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
  characterLimit = 5000

  contents = ''

  @Watch('IsReset')
  onResetChanged(value: boolean, oldVal: boolean) {
    if (value) {
      this.ClearFields()
      notesStore.SET_RESET(false)
    }
  }

  get IsReset() {
    return notesStore.IsReset
  }

  readonly GradeList = GradeList.filter((v) => v !== 'ALL')
  Cancel() {}
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

  ClearFields() {
    this.title = this.contents = this.subjectSelect = this.gradeSelect = ''
    this.schoolSelect = 'All Schools'
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

    const previewNote = new Note({
      title: this.title,
      uid: authStore.user?.uid!,
      userDisplayName: authStore.userData?.displayName!,
      userPhotoUrl: authStore.userData?.photoURL!,
      createdAt: new Date(),
      upVotes: 0,
      views: 0,
      subject: this.subjectSelect as Subject_O,
      grade: this.gradeSelect as Grade_O,
      contents: this.contents,
      storedImages: [...this.images]
    })
    if (this.schoolSelect != 'All Schools')
      previewNote.school = this.schoolSelect

    if (this.group) {
      previewNote.groupId = this.group.id
      previewNote.groupName = this.group.title
    }
    notesStore.SetPreviewNote(previewNote)
    notesStore.TogglePreviewModal(true)
  }

  get formErrors() {
    return (
      !this.title ||
      this.subjectSelect === '' ||
      this.gradeSelect === '' ||
      !this.contents
    )
  }
}
</script>