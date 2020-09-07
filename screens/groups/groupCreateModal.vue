<template>
  <div>
    <vs-alert
      v-if="description.length > characterLimit"
      danger
    >Your note cannot exceed 5000 characters</vs-alert>
    <vs-alert>Create a class to keep all your work in one place.</vs-alert>
    <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden">
      <vs-input v-model="title" placeholder="Group Name" class="block mb-3 w-6" width="w-6">
        <template #icon>
          <i class="bx bx-highlight" primary></i>
        </template>
      </vs-input>
      <vs-select
        filter
        class="block mb-3 w-6 mt-3 w-full lg:w-1/2"
        placeholder="Subject"
        v-model="subjectSelect"
      >
        <vs-option value="Any" label="Select Subject">
          <div class="font-bold truncate">Any</div>
        </vs-option>
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
      >
        <vs-option value="Any" label="Select Grade">
          <div class="font-bold truncate">Any</div>
        </vs-option>
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
      >
        <vs-option value="Any" label="Select School">
          <div class="font-bold truncate">Any</div>
        </vs-option>
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
        v-model="description"
        placeholder="Description"
        class="block rounded-lg pl-1"
        ref="textarea"
        @paste="onPaste"
      ></VsTextarea>

      <VsUpload
        :show-upload-button="false"
        text="Upload Cover Image"
        accept="image/*"
        :limit="1"
        ref="postImageUpload"
      />
      <!-- <div class="w-full flex flex-row justify-end mt-6 items-center" style>
        <div class="text-ginger-b" style>Group Visibility: &nbsp;</div>
        <vs-switch v-model="groupPublic">
          <template #off>Private</template>
          <template #on>Public</template>
        </vs-switch>
      </div>-->
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

  get imageRefs() {
    return (this.$refs.postImageUpload as
      | (Vue & {
          filesx: File[]
          srcs: imageSrc[]
          itemRemove: any[]
        })
      | undefined)?.filesx
  }
  characterLimit = 5000
  groupPublic = true
  description = ''
  backgroundImageUrl =
    'https://firebasestorage.googleapis.com/v0/b/supplant-44e15.appspot.com/o/static%2FpostedNote%40defaultBackground.png?alt=media'
  title = ''

  get active() {
    return groupsStore.openGroupsModal
  }
  set active(value: boolean) {
    groupsStore.ToggleGroupsModule(value)
  }

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  async giveGroupInfo() {
    if (!authStore.user?.uid) return
    const loading = this.$vs.loading({
      type: 'scale'
    })
    if (this.formErrors) {
      this.$vs.notification({
        color: 'danger',
        title: 'Fill Out All Fields!'
      })
      return
    }

    const addGroup = new Group({
      title: this.title,
      userId: authStore.user?.uid!,
      createdAt: new Date(),
      description: this.description,
      members: 1,
      private: !this.groupPublic,
      approved: true,
      memberList: [authStore.user?.uid],
      backgroundImageUrl: this.backgroundImageUrl
    })

    if (this.schoolSelect !== 'Any') {
      addGroup.school = this.schoolSelect
    }
    if (this.gradeSelect !== 'Any') {
      addGroup.grade = this.gradeSelect
    }
    if (this.subjectSelect !== 'Any') {
      addGroup.subject = this.subjectSelect
    }
    try {
      const refs = this.$refs.postImageUpload as
        | (Vue & {
            filesx: File[]
            srcs: imageSrc[]
            itemRemove: any[]
          })
        | undefined
      const uploadFile = refs?.filesx[0]
      if (uploadFile && this.validateImageType(uploadFile)) {
        const imageRef = await this.uploadImage(uploadFile)
        addGroup.backgroundImageUrl = imageRef.imageURL
        addGroup.fileUpload = imageRef
      }
      const groupId = await groupsStore.createGroup(addGroup)

      this.$router.push(`/groups/g/${groupId}`)
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
    groupsStore.GetUserGroups();
    groupsStore.GetMoreGroups(true);
  }
  async GetGroups() {
    const loading = this.$vs.loading()
    try {
      await groupsStore.GetMoreGroups(true)
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