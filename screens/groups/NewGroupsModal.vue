<template>
  <vs-dialog v-model="active" style="z-index: 1000000000;" overflow-hidden>
    <template #header>
      <div class="pt-10">
        <h4 class="not-margin text-title text-4xl">
          <b>Create or Join a Group!</b>
        </h4>
      </div>
    </template>
    <transition name="fade" mode="out-in">
      <component :is="currentScreen" @next="nextScreen"></component>
    </transition>
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

import GroupSelectModal from './groupModal.vue'
import GroupCreateModal from './groupCreateModal.vue'
import GroupJoinModal from './groupJoinModal.vue'

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
    VsUpload,
    GroupSelectModal,
    GroupJoinModal,
    GroupCreateModal
  },
  mounted() {}
})
export default class GroupsModal extends mixins(ValidateImage, PasteImage) {
  readonly SchoolList = ['All Schools', ...SchoolList]
  nextScreen(args: number) {
    // console.log({args});
    this.screen = args
    this.active = true
  }
  get currentScreen() {
    return this.screens[this.screen]
  }
  screens = [GroupSelectModal, GroupCreateModal, GroupJoinModal]
  screen = 0

  schoolSelect: School_O | 'All Schools' = 'All Schools'
  characterLimit = 5000
  description = ''
  backgroundImageUrl =
    'https://media.2oceansvibe.com/wp-content/uploads/2014/04/castingcouch.jpg'
  title = ''

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

  get isSmallScreen() {
    return windowStore.isSmallScreen
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>