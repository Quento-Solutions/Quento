<template>
  <div>
    <vs-sidebar  fixed :hover-expand="hover" :reduce="reduce" v-model="active" :open.sync="open" style="z-index : 100000">
      <template #logo>
        <img :src='require(`~/assets/images/logo2.png`)'/>
      </template>
      <vs-sidebar-item id="home">
        <template #icon>
          <i class="sidebar-icon bx bx-home"></i>
        </template>
        Home
      </vs-sidebar-item>
      <vs-sidebar-item id="projects">
        <template #icon>
          <i class="sidebar-icon bx bx-shape-polygon"></i>
        </template>
        Projects
      </vs-sidebar-item>
      <vs-sidebar-item id="contact">
        <template #icon>
          <i class="sidebar-icon bx bxs-contact"></i>
        </template>
        Contact
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
    active = 'home';

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