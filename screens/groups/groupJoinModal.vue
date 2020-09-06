<template>
  <div>
    <div>
      <vs-alert>How the group works?</vs-alert>
      <vs-input border v-model="link" placeholder="Enter an invite" />
      <div class="w-full flex flex-row justify-end mt-6 items-center" style></div>
    </div>
    <div class="flex flex-row justify-between items-center">
      <vs-button class transparent @click="$emit('next', 0)">
        <div class="vx-row text-xl items-center p-1">
          <i class="bx bx-arrow-back text-3xl"></i>&nbsp;Back
        </div>
      </vs-button>
      <vs-button
        success
        :disabled="formErrors || description.length > characterLimit"
        @click="giveGroupInfo()"
      >
        <div class="text-xl p-1 font-bold lg:text-xl" style>CREATE</div>
      </vs-button>
    </div>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Prop, mixins, Watch} from 'nuxt-property-decorator'

import {
  suggestionsStore,
  groupsStore,
  windowStore,
  newslettersStore
} from '~/store'

import ValidateImage from '~/mixins/ValidateImageMixin'
import PasteImage from '~/mixins/PasteImagesMixin'
import {Group, Group_t} from '~/types/groups'
import VsUpload from '~/components/VsUpload.vue'
import storage from '~/plugins/firebaseStorage'
import functions from '~/plugins/firebaseFunctions'

import {v4} from 'uuid'

import {authStore} from '~/store'
import {School_O, SchoolList} from '~/types/schools'
import {
  GradeList,
  Grade_O,
  NestedSubjectList,
  Subject_O
} from '~/types/subjects'

interface imageSrc {
  error: boolean
  orientation: 'w' | 'l'
  percent: number | string | null
  remove: boolean | null
  src: string | null
}

@Component<GroupsModal>({
  components: {
    VsUpload
  },
  mounted() {}
})
export default class GroupsModal extends mixins(ValidateImage, PasteImage) {
  subjectSelect: Subject_O | 'Any' = 'Any'
  gradeSelect: Grade_O | 'Any' = 'Any'
  readonly SchoolList = [...SchoolList]
  schoolSelect: School_O | 'Any' = 'Any'
  readonly GradeList = [...GradeList.filter((v) => v !== 'ALL')]
  readonly SubjectGroupList = NestedSubjectList

  characterLimit = 5000
  groupPublic = true
  description = ''
  backgroundImageUrl =
    'https://media.2oceansvibe.com/wp-content/uploads/2014/04/castingcouch.jpg'
  title = ''
  @Watch('IsReset')
  // onResetChanged(value: boolean, oldVal: boolean) {
  //   if (value) {
  //     this.ClearFields()
  //     groupsStore.SET_RESET(false)
  //   }
  // }

  // get IsReset() {
  //   return groupsStore.IsReset
  // }

  // readonly GradeList = GradeList.filter((v) => v !== 'ALL')
  // Cancel() {}
  // // make this a mixin
  // getIcon(subject: SubjectGroup_O | Subject_O) {
  //   return SubjectIconList[subject]
  // }
  // readonly SubjectGroupList = NestedSubjectList
  get active() {
    return groupsStore.openGroupsModal
  }
  set active(value: boolean) {
    groupsStore.ToggleGroupsModule(value)
  }

  // ClearFields() {
  //   this.title = this.description = this.subjectSelect = this.gradeSelect = ''
  //   this.schoolSelect = "All Schools";
  // }

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  async giveGroupInfo() {
    if (!authStore.user?.uid) return
    const loading = this.$vs.loading()
    if (this.formErrors) {
      this.$vs.notification({
        color: 'danger',
        title: 'Fill Out All Fields!'
      })
      return
    }
    const addGroup = new Group({
      title: this.title,
      uid: authStore.user?.uid!,
      createdAt: new Date(),
      description: this.description,
      members: 0,
      private: !this.groupPublic,
      approved: false,
      memberList: [authStore.user?.uid],
      backgroundImageUrl: this.backgroundImageUrl
    })
    try {
      await groupsStore.createGroup(addGroup)
      this.$vs.notification({
        color: 'success',
        title: 'Group Created'
      })
    } catch (error) {
      console.log({error})
      this.$vs.notification({
        color: 'danger',
        title: 'An Error Occurred While Creating Your Group'
      })
    }
    this.active = false
    loading.close()
    // notesStore.TogglePreviewModal(true)
    this.GetGroups()
  }
  async GetGroups() {
    const loading = this.$vs.loading()
    try {
      await groupsStore.GetMoreGroups()
    } catch (error) {
      console.log({error})
    }
    loading.close()

    return
  }
  get formErrors() {
    return !this.title || !this.description
  }
}
</script>