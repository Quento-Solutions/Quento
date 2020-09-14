<template>
  <div class="vx-navbar-wrapper navbar-default" id="navbar-wrapper">
    <div class="navbar-fader"></div>
    <vs-navbar class="rounded-md shadow-md" id="topnav" fixed :class="!windowSmall ? 'shrink' : ''">
      <template #left v-if="!searchActive">
        <vs-avatar class="menuIcon icon" v-if="windowSmall" @click.stop="toggleSidenav()">
          <i class="bx bx-menu" :style="`font-size: 1.5rem;`" />
        </vs-avatar>
      </template>
      <div class="w-full" v-if="searchActive" v-click-outside="searchOff">
        <NotesSearchBar @close="searchOff()"></NotesSearchBar>
      </div>
      <template #right v-if="!searchActive">
        <div class="vx-row items-center justify-end" style="flex-wrap: nowrap;">
          <vs-avatar class="icon" @click.stop="toggleSearch()">
            <i class="bx bx-search" :style="`font-size: 1.5rem;`" />
          </vs-avatar>
          <vs-navbar-group id="notifications" tabindex="0" v-click-outside="notificationsOff">
            <vs-avatar
              class="icon"
              badge
              badge-position="top-right"
              @click="notificationsVisible = !notificationsVisible"
            >
              <i class="bx bx-bell" :style="`font-size: 1.5rem;`" />
              <template #badge>{{notifications.length}}</template>
            </vs-avatar>
            <div
              class="vs-navbar__group__items"
              style="z-index: 100"
              :class="notificationsVisible ? 'visible' : 'hidden'"
            >
              <div class="rounded-md dropdown-container">
                <div class="vs-dropdown-menu--after"></div>
                <div class="notification-top text-center p-5 bg-primary text-white rounded-md">
                  <h3 class="text-white">{{ notifications.length }} New</h3>
                  <p class="opacity-75">App Notifications</p>
                </div>
                <vs-navbar-item
                  v-for="(ntf, index) in notifications"
                  :key="index"
                  @click="readNotification(ntf.id)"
                  :to="ntf.redirectUrl"
                >
                  <div class="flex items-center flex-no-wrap py-1 justify-between">
                    <div>
                      <i
                        class="bx text-2xl m-2 block"
                        :class="`${getIcon(ntf.dataType)}`"
                        :style="`color : rgb(var(--vs-${getColor(ntf.action)}))`"
                      ></i>
                    </div>
                    <div class="mr-2">
                      <small
                        class="block pt-2"
                        :style="`color : rgb(var(--vs-${getColor(ntf.action)}))`"
                      >New {{ntf.dataType.toLowerCase()}}</small>
                      <div class="w-full p-2" style>{{ ntf.title }}</div>
                    </div>
                    <div>
                      <vs-avatar class="profileIcon icon">
                        <img v-if="ntf.avatarPhotoUrl" :src="ntf.avatarPhotoUrl" />
                      </vs-avatar>
                    </div>
                  </div>
                  <small
                    class="m-1 whitespace-no-wrap block"
                    :style="`color : rgb(var(--vs-${getColor(ntf.action)}))`"
                  >{{ elapsedTime(ntf.createdAt) }}</small>
                </vs-navbar-item>
              </div>
            </div>
          </vs-navbar-group>
          <h3 class="text-title truncate hidden sm:block" style="font-weight: 500">{{ userName }}</h3>

          <vs-navbar-group id="profile">
            <vs-avatar class="profileIcon icon" badge badge-color="success">
              <img v-if="photoURL" :src="photoURL" />
              <i v-else class="bx bx-user-circle" :style="`font-size: 1.5rem;`" />
            </vs-avatar>
            <template #items>
              <vs-navbar-item to="/user/profile">Profile</vs-navbar-item>

              <vs-navbar-item to="/user/edit">Settings</vs-navbar-item>
              <vs-navbar-item
                warning
                @click="SignOut()"
                class="bg-danger rounded-md text-white"
                style="color: white;"
              >Sign Out</vs-navbar-item>
            </template>
          </vs-navbar-group>
        </div>
      </template>
    </vs-navbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { windowStore, authStore, notificationStore } from '~/store'
import UserMixin from '~/mixins/UserMixin'
import { User } from '~/types/user'
import NotesSearchBar from '~/components/NotesSearchBar.vue'

import {
  NotificationData_O,
  NotificationAction_O,
  Notification
} from '~/types/notifications'
import firestore from '~/plugins/firestore'
@Component<TopNav>({
  components: {
    NotesSearchBar
  },
  mounted() {
    this.getNotifications()
  }
})
export default class TopNav extends mixins(UserMixin) {
  @Watch('AuthUser')
  userLoggedIn(newVal: User, oldVal: User) {
    if (newVal) {
      this.getNotifications()
    }
  }

  getPageLink(ntf: Notification<NotificationData_O>) {
    switch (ntf.dataType) {
      case 'QUESTION':
        return `/questions/${ntf.docId}`
      case 'NEWSLETTER':
        return `/newsletters/${ntf.docId}`
      case 'NOTE':
        return `/notes/${ntf.docId}`
      case 'RESPONSE':
        return `/questions/${
          (ntf as Notification<'RESPONSE'>).docData.questionId
        }`
    }
  }
  getIcon(dataType: NotificationData_O) {
    switch (dataType) {
      case 'QUESTION':
        return 'bx-question-mark'
      case 'RESPONSE':
        return 'bx-comment-detail'
      case 'NEWSLETTER':
        return 'bx-news'
      case 'NOTE':
        return 'bx-note'
      default:
        return 'bx-notification'
    }
  }

  searchActive = false
  searchOff() {
    this.searchActive = false
    windowStore.SET_OVERLAY_VISIBLE(this.searchActive)
  }
  toggleSearch() {
    this.searchActive = !this.searchActive
    windowStore.SET_OVERLAY_VISIBLE(this.searchActive)
  }

  getColor(actionType: NotificationAction_O) {
    switch (actionType) {
      case 'POST':
        return 'primary'
      case 'RESPONSE':
        return 'warning'
      case 'POPULAR':
        return 'danger'
    }
  }

  notificationsOff() {
    this.notificationsVisible = false
  }
  notificationsVisible = false
  elapsedTime(startTime: Date) {
    let x = new Date(startTime)
    let now = new Date()
    var timeDiff = now.valueOf() - x.valueOf()
    timeDiff /= 1000

    var seconds = Math.round(timeDiff)
    timeDiff = Math.floor(timeDiff / 60)

    var minutes = Math.round(timeDiff % 60)
    timeDiff = Math.floor(timeDiff / 60)

    var hours = Math.round(timeDiff % 24)
    timeDiff = Math.floor(timeDiff / 24)

    var days = Math.round(timeDiff % 365)
    timeDiff = Math.floor(timeDiff / 365)

    var years = timeDiff

    if (years > 0) {
      return years + (years > 1 ? ' Years ' : ' Year ') + 'ago'
    } else if (days > 0) {
      return days + (days > 1 ? ' Days ' : ' Day ') + 'ago'
    } else if (hours > 0) {
      return hours + (hours > 1 ? ' Hrs ' : ' Hour ') + 'ago'
    } else if (minutes > 0) {
      return minutes + (minutes > 1 ? ' Mins ' : ' Min ') + 'ago'
    } else if (seconds > 0) {
      return seconds + (seconds > 1 ? ' sec ago' : 'just now')
    }

    return 'Just Now'
  }
  async getNotifications() {
    try {
      
      await notificationStore.getNotifications()
    } catch (error) {
      this.$qto.error(error);
    }
  }

  async readNotification(id: string) {
    try {
      await firestore
        .collection('users')
        .doc(this.AuthUser?.uid)
        .collection('notifications')
        .doc(id)
        .update({
          read: true
        })
      await notificationStore.getNotifications()
    } catch (error) {
      this.$qto.error(error);
    }
    this.notificationsVisible = false
  }

  get notifications() {
    return notificationStore.notifications.filter((ntf) => !ntf.read)
  }

  get windowSmall() {
    return windowStore.isSmallScreen
  }
  toggleSidenav() {
    windowStore.SetSidenavState(true)
  }
  get userName() {
    return authStore.userData?.displayName
  }
  get photoURL() {
    return authStore.userData?.photoURL
  }

  async SignOut() {
    try {
      await authStore.signOut()
    } catch (error) {}
  }
}
</script>

<style lang="scss">
#navbar-wrapper {
  z-index: 41001;
  #topnav {
    z-index: 100;
    top: 20px;
    border-radius: 1rem;
    width: calc(100vw - 30px);
    left: 15px;
    .navbar-custom {
      top: 3vh;
      border-radius: 1rem !important;
      width: 93%;
    }
    .icon {
      width: 2.5rem;
      height: 2.5rem;
      cursor: pointer;
    }

    .vs-navbar__center {
      max-width: 100%;
      width: 100% !important;
    }
    #profile {
      .vs-navbar__group__items {
        min-width: 0 !important;
        // max-width : 100%;
        width: 150%;
        transform: translate(-25%, 90%);
      }
    }
    #notifications {
      .vs-navbar__group__items {
        opacity: 0 !important;
        visibility: hidden !important;
        min-width: 0 !important;
        border-radius: 20px;
        // overflow: hidden;
        padding: 0;
        // max-width : 100%;
        position: fixed;
        transform: none;
        top: 80px;
        width: 90vw;
        left: 5vw;
        bottom: auto;
        @media only screen and (min-width: 400px) {
          transform: translate(-75%, 90%);
          width: 350px;
          position: absolute;
          bottom: 0;
          left: auto;
          top: auto;
        }
      }

      .vs-navbar__group__items.visible {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    }
    .vs-dropdown-menu--after {
      position: absolute;
      width: 10px;
      height: 10px;
      display: block;
      background-color: rgba(var(--vs-primary));

      -webkit-transform: rotate(45deg) translate(-7px);
      transform: rotate(45deg) translate(-7px);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      border-top-color: rgba(0, 0, 0, 0.1);
      border-top-style: solid;
      border-top-width: 1px;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      border-left-color: rgba(0, 0, 0, 0.1);
      border-left-style: solid;
      border-left-width: 1px;
      z-index: 10;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      @media only screen and (min-width: 400px) {
        right: 60px;
      }
      right: 30vw;
    }
  }
  .navbar-fader {
    background: linear-gradient(
      to bottom,
      rgba(248, 248, 248, 0.95) 44%,
      rgba(248, 248, 248, 0.46) 73%,
      rgba(255, 255, 255, 0) 100%
    );
    position: fixed;
    z-index: 0;
    width: 100%;
    height: 103px;
    left: 0;
    transition-duration: 0.5s;
    top: 0;
    .show-overlay & {
      opacity: 0;
    }
    .show-lower-overlay & {
      opacity: 0;
    }
  }
  .shrink {
    width: calc(100vw - 110px) !important;
    left: 70px !important;
  }
}
</style>
