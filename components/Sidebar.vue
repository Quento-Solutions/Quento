<template>
  <div>
    <vs-sidebar  fixed :hover-expand="hover" :reduce="reduce" v-model="active" :open.sync="open" style="z-index : 100000">
      <template #logo>
        <img :src='require(`~/assets/images/logo2.png`)'/>
      </template>
      <vs-sidebar-item v-for="(item, index) in NavOptions" :key="index" :id="item.href" >
        <template #icon>
            <i class="sidebar-icon bx " :class="item.icon"></i>
          </template>
          {{item.name}}
      </vs-sidebar-item>
     
      <template #footer>
        <vs-row justify="space-between">
          <vs-avatar success>
            <i class="bx bxl-vuejs"></i>
          </vs-avatar>

          <vs-avatar warn>
            <i class="bx bx-news"></i>
          </vs-avatar>
        </vs-row>
      </template>
    </vs-sidebar>
  </div>
</template>

<script lang="ts">

import
{
    Vue, 
    Component,
} from "nuxt-property-decorator"

import { navigationStore, windowStore, authStore } from "~/store";
import { NavigationOptionType } from "~/store/navigation";


@Component
export default class Sidebar extends Vue 
{
  get active() {
    return this.$route.path;
  } 
  set active(id : string)
  {
    this.PushRouterLink(id);
  }



  NavOptions = [
    {
      name : "Home",
      id : "home",
      icon : "bx bx-home",
      href : '/home'
    },
    {
      name : "Suggestions",
      id : "suggestions",
      icon : "bx bxs-message-square-edit",
      href : '/suggestions'
    },
    {
      name : "Projects",
      id : "projects",
      icon : "bx bx-shape-polygon",
      href : '/coming-soon'
    },
    {
      name : "Contact",
      id : "contact",
      icon : "bx bxs-contact",
      href : '/contact'
    }
  ] as const

  PushRouterLink(link : string)
  {
    this.$router.push(link);
  }
  get open()
  {
    return windowStore.sidebarOpen;
  }
  set open(open)
  {
    windowStore.SetSidenavState(open);
  }
  get hover()
  {
    return !windowStore.sidenavIsOpen
  }
  get reduce()
  {
    return !windowStore.sidenavIsOpen
  }


  clickNotClose = true;
    get currentPage()
    {
        return navigationStore.currentPage;
    }
    set currentPage(page : NavigationOptionType)
    {
        navigationStore.changePage(page);
    }

}
</script>
<style lang="scss" scoped>
.sidebar-icon
{
  font-size : 2rem;
}
</style>