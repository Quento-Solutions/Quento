<template>
  <vs-dialog
    v-model="active"
    style="z-index: 1000000000;"
    :full-screen="!isLargeScreen"
    overflow-hidden
  >
    <template #header>
      <div class="pt-10">
        <h4 class="not-margin text-title text-4xl">
          <b>Create or Join a Group!</b>
        </h4>
      </div>
    </template>

    <div class="vx-row w-full" style>
      <div class="vx-col w-full lg:w-1/2 p-4 ">
        <div class="flex flex-col justify-center w-full items-center border-2 p-4 rounded">
          <div class = "text-center  w-4/5">
            <b>Create</b> a New Group and Add Your Friends
          </div>
          <i class="bx bx-group" style="font-size: 8rem"></i>
          <vs-button>
            <div class="text-xl p-2 font-bold lg:text-2xl" style>Create a group</div>
          </vs-button>
        </div>
      </div>
     <div class="vx-col w-full lg:w-1/2 p-4 ">
        <div class="flex flex-col justify-center w-full items-center border-2 p-4 rounded">
          <div class = "text-center w-4/5">
            <b>Join</b> a group with an invite code or link
          </div>
          <i class="bx bx-group" style="font-size: 8rem"></i>
          <vs-button class="rounded">
            <div class="text-xl p-2 font-bold lg:text-2xl" style>Join a group</div>
          </vs-button>
        </div>
      </div>
    </div>
  </vs-dialog>
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
  readonly SchoolList = ['All Schools', ...SchoolList]
  schoolSelect: School_O | 'All Schools' = 'All Schools'
  characterLimit = 5000

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
  //   this.title = this.contents = this.subjectSelect = this.gradeSelect = ''
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
      members: 10,
      backgroundImageUrl: this.backgroundImageUrl,
      approved: false,
      memberList: [authStore.user.uid]
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
    return !this.title || !this.contents
  }
}
</script>