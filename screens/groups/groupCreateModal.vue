<template>
  <div>
    <vs-alert
      v-if="description.length > characterLimit"
      danger
    >Your note cannot exceed 5000 characters</vs-alert>
    <vs-alert>How the group works?</vs-alert>
    <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden">
      <vs-input v-model="title" placeholder="Title" class="block mb-3 w-6 mt-3" width="w-6">
        <template #icon>
          <i class="bx bx-highlight" primary></i>
        </template>
      </vs-input>
      <VsTextarea
        v-model="description"
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
        :disabled="formErrors || description.length > characterLimit"
        @click="giveGroupInfo()"
      >
        <div class="text-xl p-2 font-bold lg:text-2xl" style>CREATE GROUP</div>
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