<template>
  <div class="vx-row w-full relative justify-evenly" id="groups-screen-container">
    <div class="vx-row w-full" style>
      <div class="w-full lg:w-2/3 md:w-1/2 vx-col" style>
        <vs-alert color="primary" class>
          <template #title>
            <div class="text-2xl">Introducing Groups</div>
          </template>
          <b>Groups -</b> A way to keep all of your content and learning material in one place.
          <template #footer>
            <vs-button to="/groups/discover">
              <div
                class="px-3 py-1 text-ginger text-xl flex flex-row flex-no-wrap items-center justify-center"
                style
              >
                <i class="bx bx-compass text-3xl" />&nbsp; Discover Groups
              </div>
            </vs-button>
          </template>
        </vs-alert>
      </div>
    </div>

    <div class = "flex flex-row">
      <!-- Add/Join Group -->
      <div class = "w-full xxlmin:w-33% lg:w-50% xs:w-100%" style = "text-align:center;">
        <vs-avatar class="w-full cursor-pointer flex flex-row" size="160" @click="ToggleGroupsModal(true)">
          <i class="bx bx-plus-circle" style="font-size: 8rem" />
        </vs-avatar>
        <div class="my-4 text-title text-2xl">
          Add Or Join A Group
        </div>
      </div>

      <!-- GroupCards -->
      <div
        class="w-full xxlmin:w-33% lg:w-50% xs:w-100%"
        v-for="(group, index) in groupsList"
        :key="index"
        style
      >
        <GroupsCard class="w-full" :group="group" :clickable="true" :preview="true"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch, mixins} from 'nuxt-property-decorator'

import {Note} from '~/types/notes'

import {windowStore, notesStore, groupsStore} from '~/store'
import FilterSidebar from '~/components/FilterSidebar.vue'
import NotesCard from '~/components/NotesCard.vue'
import GroupsCard from '~/components/GroupsCard.vue'
import LoadScroll from '~/mixins/LoadScrollMixin'
import {Subject_O, Grade_O} from '~/types/subjects'
import {School_O} from '~/types/schools'

@Component<GroupsPage>({
  components: {NotesCard, FilterSidebar, GroupsCard},
  async mounted() {
    if (groupsStore.userGroups.length) return
    const loading = this.$vs.loading({
      type: 'circles',
      text: 'Loading Data'
    })
    try {
      const groups = groupsStore.GetUserGroups()
      await Promise.all([groups])
    } catch (error) {
      console.error({error})
      this.$vs.notification({
        title: error.message,
        color: 'danger'
      })
    }
    this.loaded = true
    console.log(groupsStore.userGroups)
    loading.close()
  }
})
export default class GroupsPage extends mixins(LoadScroll) {
  get noNotesFound() {
    return notesStore.EndOfList && this.groupsList.length == 0
  }
  openFilterSidebar() {
    windowStore.SetFilterSidebar(true)
  }

  get groupsList() {
    return groupsStore.userGroups
  }
  ToggleGroupsModal(val: boolean) {
    groupsStore.ToggleGroupsModule(val)
  }
}
</script>