<template>
  <vs-dialog
    not-center
    prevent-close
    not-close
    id="userInfoPopup"
    class="content-popup no-footer"
    style="z-index: 1000000000;"
    scroll
    overflow-hidden
    :full-screen="!isLargeScreen"
    v-model="userInfoPromptOpen"
    v-if="AuthUser && UserData"
  >
    <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row justify-evenly overflow-x-hidden">
      <div class="vx-row items-center w-full p-4 flex-no-wrap" style="flex-wrap: nowrap;">
        <div class="vx-col" style>
          <vs-avatar size="70" badge badge-color="success">
            <img v-if="UserData.photoURL" :src="UserData.photoURL" />
            <i v-else class="bx bx-user-circle" :style="`font-size: 2rem;`" />
          </vs-avatar>
        </div>
        <div class="text-body text-xl p-2" style="line-height : 1.25">
          Hi
          <b>{{ UserData.displayName }}!</b> Tell us a bit about yourself!
        </div>
      </div>

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
        <h2 class="text-title mb-8">What Subjects Are You Interested In? (Optional)</h2>
        <SubjectsDropdown :value.sync="SubjectDict" :list.sync="ActiveSubjectList"></SubjectsDropdown>
      </div>

      <!-- Description  -->
      <div class="vx-col w-full mt-6" style>
        <VsTextarea
          v-model="contents"
          placeholder="Hi! Welcome to Quento"
          class="block"
          height="20rem"
          label="Bio (Optional)"
        ></VsTextarea>
      </div>
    </div>
    <div class="vx-col w-full px-16">
      <vs-button
        @click="submitUserInfo()"
        class="float-right text-ginger-b"
        size="xl"
        :disabled="false && formErrors"
      >
        NEXT &nbsp;
        <i class="bx bxs-rocket text-xl" />
      </vs-button>
    </div>
  </vs-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import { userGuideStore, authStore, windowStore } from '~/store'
import { SchoolList, School_O } from '~/types/schools'
import UserMixin from '~/mixins/UserMixin'

import SubjectsDropdown from '~/components/SubjectsDropdown.vue'

import { GradeList, Grade_O, SubjectOptions, Subject_O } from '~/types/subjects'

@Component<UserGuideModal>({ components: { SubjectsDropdown } })
export default class UserGuideModal extends mixins(UserMixin) {
  readonly GradeList = GradeList.filter((val) => val != 'ALL')
  readonly SchoolList = SchoolList

  get formErrors() {
    return this.gradeSelect == '' || this.schoolSelect == ''
  }
  dontShowAgain = false

  gradeSelect: Grade_O | '' = ''
  schoolSelect: School_O | '' = ''

  title = ''
  contents = ''

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  get userInfoPromptOpen() {
    return userGuideStore.userInfoPromptOpen
  }

  set userInfoPromptOpen(value: boolean) {
    if (!value && this.dontShowAgain) {
      userGuideStore.SetUserGuideClosed(true)
    }
    userGuideStore.SET_GUIDE_CLOSED(!value)
  }

  async submitUserInfo() {
    // return;
    if (this.gradeSelect == '' || this.schoolSelect == '') return
    const loading = this.$vs.loading()
    try {
      await userGuideStore.SetUserInformation({
        interestedSubjects: this.ActiveSubjectList,
        currentGrade: this.gradeSelect,
        school: this.schoolSelect,
        bio: this.contents
      })
      loading.close()
    } catch (error) {
      // this.$vs
      console.error({ error })
      loading.close()
    }
  }

  SubjectDict = Object.assign({}, SubjectOptions)
  ActiveSubjectList: Subject_O[] = []
}
</script>
