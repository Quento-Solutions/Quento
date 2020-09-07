<template>
  <vs-sidebar
    fixed
    :hover-expand="hover"
    :reduce="reduce"
    v-model="active"
    :open.sync="open"
    style="z-index: 100000;"
    color="#9f7aea"
    id="sidebar"
  >
    <template #logo>
      <vs-sidebar-item>
        <template #icon>
          <img
            :src="require(`~/assets/images/QuentoLogoMain.png`)"
            style="width: 2.7rem; height: 3rem;"
          />
        </template>
        <div style>QUENTO</div>
      </vs-sidebar-item>
    </template>
    <vs-sidebar-item v-for="(item, index) in NavOptions" :key="index" :id="item.href">
      <template #icon>
        <i class="sidebar-icon bx" :class="item.icon"></i>
      </template>
      {{ item.name }}
    </vs-sidebar-item>

    <vs-sidebar-item href="https://github.com/Quento-Solutions">
      <template #icon>
        <i class="sidebar-icon bx bxl-github"></i>
      </template>
      <div style>Github</div>
    </vs-sidebar-item>

    <vs-sidebar-item href="https://discord.gg/vHhtD38">
      <template #icon>
        <i class="sidebar-icon bx bxl-discord"></i>
      </template>
      <div style>Discord</div>
    </vs-sidebar-item>

    <vs-sidebar-group>
      <template #header>
        <vs-sidebar-item arrow>
          <template #icon>
            <i class="bx bx-shape-polygon sidebar-icon"></i>
          </template>
          Coming Soon
        </vs-sidebar-item>
      </template>

      <vs-sidebar-item v-for="(item, index) in ComingSoonGroup" :key="index" :id="item.href">
        <template #icon>
          <i class="sidebar-icon bx" :class="item.icon"></i>
        </template>
        {{ item.name }}
      </vs-sidebar-item>
    </vs-sidebar-group>

    <template #footer></template>
  </vs-sidebar>
</template>

<script lang="ts">
import {Vue, Component} from 'nuxt-property-decorator'

import {navigationStore, windowStore, authStore} from '~/store'
import {NavigationOptionType} from '~/store/navigation'

@Component
export default class Sidebar extends Vue {
  get active() {
    return this.$route.path
  }
  set active(id: string) {
    this.PushRouterLink(id)
  }

  NavOptions = [
    {
      name: 'Home',
      id: 'home',
      icon: 'bx bx-home',
      href: '/home'
    },

    {
      name: 'Notes',
      id: 'notes',
      icon: 'bx bxs-note',
      href: '/notes'
    },
    {
      name: 'Questions',
      id: 'questions',
      icon: 'bx bx-comment-dots',
      href: '/questions'
    },
    {
      name: 'Groups',
      id: 'groups',
      icon: 'bx bxs-group',
      href: '/groups'
    },
    {
      name: 'Updates',
      id: 'newsletters',
      icon: 'bx bxs-envelope-open',
      href: '/newsletters'
    }
  ] as const

  ComingSoonGroup = [
    {
      name: 'Projects',
      id: 'projects',
      icon: 'bx bx-meteor'
    },
    {
      name: 'Contact',
      id: 'contact',
      icon: 'bx bxs-contact'
    }
  ]

  PushRouterLink(link: string) {
    this.$router.push(link)
  }
  get open() {
    return windowStore.sidebarOpen
  }
  set open(open) {
    windowStore.SetSidenavState(open)
  }
  get hover() {
    return !windowStore.sidenavIsOpen
  }
  get reduce() {
    return !windowStore.sidenavIsOpen
  }

  clickNotClose = true

  get currentPage() {
    return navigationStore.currentPage
  }
  set currentPage(page: NavigationOptionType) {
    navigationStore.changePage(page)
  }
}
</script>
<style lang="scss" scoped>
.sidebar-icon {
  font-size: 2rem;
}
</style>
