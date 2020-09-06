<template>
  <div style="width : 500px">
    <div>
<<<<<<< HEAD
      <vs-alert>How the group works?</vs-alert>
      <vs-input border v-model="link" placeholder="Enter an invite" class="block"/>
=======
      <vs-alert>Enter an invite below to join an existing server.</vs-alert>
      <div class = "p-6"></div>
      <vs-input class = "block" border v-model="link" label="Enter an invite" placeholder = "Quento.ca/groups/join?exampletoken=QTxgBw1uvD5sAAtP2UI6" />
>>>>>>> 4a3b0afb9f9edeece6277863285cf9ba06f7af05
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
<<<<<<< HEAD
        :disabled="formErrors"
        @click="joinGroup()"
      >
        <div class="text-xl p-1 font-bold lg:text-xl" style>Join</div>
=======
        :disabled="link.length == 0"
        @click="giveGroupInfo()"
      >
        <div class="text-xl p-1 font-bold lg:text-xl" style>JOIN</div>
>>>>>>> 4a3b0afb9f9edeece6277863285cf9ba06f7af05
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

  link = ''

  get active() {
    return groupsStore.openGroupsModal
  }
  set active(value: boolean) {
    groupsStore.ToggleGroupsModule(value)
  }


  async joinGroup()
  {
    if(!this.link || this.link === '') return;
    const searchString = "/groups/join?token=";
    const linkIndex = this.link.indexOf(searchString);
    if(linkIndex == -1) 
    {
      this.active = false;
      return this.$vs.notification({
        title : 'Invalid Link',
        color : 'danger'
      })
    }
    const token = this.link.substring(linkIndex + searchString.length);
    this.active = false;
    this.$router.push(`/groups/join?token=${token}`);
  }

  get isLargeScreen() {
    return windowStore.isLargeScreen
  }

  get formErrors() {
    return  !this.link
  }
}
</script>