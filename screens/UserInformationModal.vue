<template>
  <vs-dialog
    not-center
    prevent-close
    not-close
    id="userInfoPopup"
    class="content-popup"
    style="z-index: 1000000000;"
    scroll
    :full-screen="!isLargeScreen"
    v-model="userInfoPromptOpen"
  >
    <template #header>
      <h4 class="not-margin">
        Hi <b>{{ activeUser.displayName }}!</b> Tell Us About Yourself
      </h4>
    </template>
    <div
      class="con-form md:p-4 lg:p-8 p-2 flex vx-row justify-evenly overflow-x-hidden"
    >
      <div class="mb-6 p-4 w-full lg:w-1/2">
        <vs-select
          label="Grade"
          filter
          class="block sort-option"
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
      <!-- School Select -->
      <div class="mb-6 p-4 w-full lg:w-1/2">
        <vs-select
          label="School"
          filter
          class="block sort-option"
          placeholder="School"
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

      <!-- Interested Subjects -->

      <div class="filter-options vx-col w-full">
        <h2 class="text-title mb-8">
          What Subjects Are You Interested In? (Optional)
        </h2>
        <vs-sidebar-group
          color="#9331e1"
          v-for="(subjectGroup, groupIndex) in subjectGroups"
          :key="groupIndex + 4"
        >
          <template #header>
            <vs-sidebar-item arrow>
              <div class="vx-row w-full">
                <!-- <vs-button /> -->
                <i class="bx text-3xl" :class="subjectGroup.iconClass" />
                <div class="font-bold truncate ml-4">
                  {{ subjectGroup.name }}
                </div>
              </div>
            </vs-sidebar-item>
          </template>

          <vs-sidebar-item
            v-for="(subject, index) in subjectGroup.items"
            :key="index"
          >
            <vs-checkbox
              color="#4D7C8A"
              v-model="SubjectDict[subject.name]"
              @click="subjectClicked(subject.name)"
            >
              <i class="bx text-3xl mr-2" :class="subject.iconClass" />
              <div class="font-bold truncate">
                {{ subject.name }}
              </div>
            </vs-checkbox>
          </vs-sidebar-item>
        </vs-sidebar-group>
      </div>

      <!-- Description  -->
      <div class="vx-col w-full mt-6" style="">
        <VsTextarea
          v-model="contents"
          placeholder="Hi! Welcome to Quento"
          class="block"
          height="20rem"
          label="Short Bio (Optional)"
        >
        </VsTextarea>
      </div>
    </div>
    <div class="vx-col w-full px-16">
      <vs-button
        @click="submitUserInfo()"
        class="float-right text-ginger-b"
        size="xl"
        :disabled="formErrors"
      >
        NEXT &nbsp;<i class="bx bxs-rocket text-xl" />
      </vs-button>
    </div>
  </vs-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { userGuideStore, authStore, windowStore } from '~/store'
import { SchoolList, School_O } from '~/types/schools'

import {
  GradeList,
  Grade_O,
  SubjectGroup_O,
  SubjectList,
  SubjectIconList,
  Subject_O,
  NestedSubjectList
} from '~/types/subjects'

let s: {
  [index in Subject_O]?: boolean
} = {}
SubjectList.forEach((subject) => (s[subject] = false))
const g: {
  [index in SubjectGroup_O]: boolean
} = {
  Sciences: false,
  Arts: false,
  Languages: false,
  'Social Sciences': false,
  Technology: false
}

@Component<UserGuideModal>({ components: {} })
export default class UserGuideModal extends Vue {
  readonly GradeList = GradeList.filter((val) => val != 'ALL')
  readonly SchoolList = SchoolList

  get formErrors() {
    return this.gradeSelect == '' || this.schoolSelect == ''
  }

  gradeSelect: Grade_O | '' = ''
  schoolSelect: School_O | '' = ''

  title = ''
  contents = ''
  thingOpen = false

  get activeUser() {
    return authStore.user
  }
  get userData() {
    return authStore.userData
  }
  get isLargeScreen() {
    return windowStore.isLargeScreen
  }
  dontShowAgain = false
  get userInfoPromptOpen() {
    return userGuideStore.userInfoPromptOpen
  }

  set userInfoPromptOpen(value: boolean) {
    if (!value && this.dontShowAgain) {
      userGuideStore.SetUserGuideClosed(true)
    }
    userGuideStore.SET_GUIDE_CLOSED(!value)
  }

  subjectClicked(
    name: Subject_O,
    clicked = true,
    value = !this.SubjectDict[name]
  ) {
    if (value === true && !this.ActiveSubjectList.includes(name)) {
      this.ActiveSubjectList.unshift(name)
      if (this.ActiveSubjectList.length > 10) {
        const removedSubject = this.ActiveSubjectList.pop()!
        this.SubjectDict[removedSubject] = false
      }
    } else {
      this.ActiveSubjectList = this.ActiveSubjectList.filter(
        (val) => val !== name
      )
    }
    if (!clicked) this.SubjectDict[name] = value
  }

  async submitUserInfo() {
    if (this.gradeSelect == '' || this.schoolSelect == '') return
    const loading = this.$vs.loading()
    try {
      await userGuideStore.SetUserInformation({
        interestedSubjects: this.ActiveSubjectList,
        currentGrade: this.gradeSelect,
        school: this.schoolSelect,
        bio: this.contents
      });
      loading.close();
    } catch (error) {
      // this.$vs
      console.error({error});
      loading.close();
    }
  }

  SubjectDict = s
  ActiveSubjectList: Subject_O[] = []
  subjectGroups = NestedSubjectList
}
</script>
