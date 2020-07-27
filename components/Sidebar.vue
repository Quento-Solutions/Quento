<template>
  <div >
    <vs-sidebar fixed hover-expand reduce v-model="currentPage" open style="height : 60%">
      <template #logo>
        <img :src='require(`~/assets/images/logo2.png`)'/>
      </template>
      <vs-sidebar-item id="home">
        <template #icon>
          <i class="bx bx-home"></i>
        </template>
        Home
      </vs-sidebar-item>
      <vs-sidebar-item id="projects">
        <template #icon>
          <i class="bx bx-shape-polygon"></i>
        </template>
        Projects
      </vs-sidebar-item>
      <vs-sidebar-item id="contact">
        <template #icon>
          <i class="bx bxs-contact"></i>
        </template>
        Contact
      </vs-sidebar-item>
      <template #footer>
        <vs-row justify="space-between">
          <vs-avatar>
            <img src="/avatars/avatar-5.png" alt="" />
          </vs-avatar>

          <vs-avatar badge-color="danger" badge-position="top-right">
            <i class="bx bx-bell"></i>

            <template #badge>
              28
            </template>
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

import { navigationStore } from "~/store";
import { NavigationOptionType } from "~/store/navigation";
@Component
export default class Sidebar extends Vue 
{
    active = 'home';

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