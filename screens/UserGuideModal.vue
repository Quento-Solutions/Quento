<template>
  <vs-dialog width="550px" not-center v-model="userGuideStoreOpen" v-if="AuthUser && UserData">
    <template #header>
      <h4 class="not-margin">Welcome to <b>Quento</b></h4>
    </template>
    <div class="con-content">
      <p>
        Quento is a growing community of students creating a better platform for
        online learning. Check out our
        <nuxt-link @click="userGuideStoreOpen = false" to="/notes">Posted Notes</nuxt-link> feature where you can
        use the resources provided by other students. If you have any
        <i class="bx bx-bulb text-xl" /> ideas, please add a new
        <nuxt-link @click="userGuideStoreOpen = false" to="/suggestions">Suggestion</nuxt-link> to make our platform
        even better. To keep up with the latest developments, join our
        <i class="bx bxl-discord text-xl" />
        <a href="https://discord.gg/pfyFWus" target="_blank">Discord Channel</a>
        where new updates are being announced every day.
      </p>
    </div>
    <template #footer>
      <div class="con-footer vx-row justify-between">
        <vs-checkbox v-model="dontShowAgain">
          Don't Show Again
        </vs-checkbox>
        <vs-button @click="userGuideStoreOpen = false" transparent>
          AIGHT FIRE &nbsp;<i class="bx bxs-flame text-xl " style="color : red"/>
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import { userGuideStore, authStore } from '~/store'
import UserMixin from '~/mixins/UserMixin';
@Component<UserGuideModal>({ components: {} })
export default class UserGuideModal extends mixins(UserMixin) {
  thingOpen = false
  dontShowAgain = false
  get userGuideStoreOpen() {
    return userGuideStore.showUserGuide
  }

  set userGuideStoreOpen(value: boolean) {
    if (!value && this.dontShowAgain) {
      userGuideStore.SetUserGuideClosed(true)
    }
    userGuideStore.SET_GUIDE_CLOSED(!value)
  }
}
</script>
