<template>
  <!-- ----------------------------------JEFF'S VERSION---------------------------------- -->
  <!--
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="groups-screen-container"
  >
    <div id="notes-content-overlay"></div>
    <FilterSidebar
      :sort.sync="sort"
      :subjects.sync="subjects"
      :school.sync="school"
      :grade.sync="grade"
      :sortEnabled="false"
      @filter="filter()"
    >
      <vs-button to="/groups" class="w-full">
        <i class="bx bx-arrow-back text-4xl" />
        <div class="text-2xl font-ginger-b">&nbsp; Your Groups</div>
      </vs-button>
    </FilterSidebar>

    <div class="sidebar-spacer"></div>
    <div class="vx-col lg:w-2/3 md:w-2/3 w-full">
      Mobile
      <div class="vx-col w-full inline-flex lg:hidden" style>
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="openFilterSidebar()">
            <i class="bx bx-menu" style="font-size: 1.25rem;" />
            piss
          </vs-avatar>
        </div>
      </div>
      
      <div class="vx-row" style>
        Join Group
        <div
          class="vx-col flex flex-col justify-center items-center w-full lg:w-1/3 md:w-1/2"
          style
        >
          <div
            @click="ToggleGroupsModal(true)"
            class="flex flex-col justify-center items-center cursor-pointer"
          >
            <vs-avatar class="w-full" size="160">
              <i class="bx bx-plus-circle" style="font-size: 8rem" />
            </vs-avatar>
            <div class="my-4 text-title text-2xl">Add Or Join A Group</div>
          </div>
        </div>

        <div
          class="vx-col w-full lg:w-1/3 md:w-1/2"
          v-for="(group, index) in groupsList"
          :key="index"
          style
        >
          <GroupsCard
            class="w-full lg:w-1/3 md:w-1/2"
            :group="group"
            :clickable="true"
            :preview="true"
          />
        </div>
      </div>

      <vs-alert color="danger" v-if="noNotesFound">
        <template #title>No Groups Found For This Search</template>
        <b>Sorry!</b> Something went wrong when fetching the Groups. Please Try
        Again.
      </vs-alert>
    </div>
  </div>
  -->

  <!-- ----------------------------------MY VERSION---------------------------------- -->
  
  <div> <!-- Yay we need a root because fun vue -->
    <!-- TITLE AND CREATE CARDS? -->
    <div class = "mb-10 pt-8" style = "width:60%">
      <div class = 'mb-3 text-black font-extrabold text-6xl font-open'>
        Groups
      </div>

      <div class = "absolute right-0"> <!-- Button Container -->
        <vs-button circle flat success animation-type="vertical" class=" inline-block float-right mr-10" @click="ToggleGroupsModal(true)">
          <div class="text-lg text-xs font-ginger-b">Create/Join by Link</div>
          <template #animate>
            <i class="bx bx-plus text-2xl"></i>
          </template>
        </vs-button>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed augue lorem, interdum a maximus ut, luctus vel justo. Maecenas sit amet massa purus. Quisque eu mattis nibh, in commodo turpis. Aenean turpis ante, porta non euismod at, maximus eu justo. Curabitur nec gravida libero. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus ac molestie neque. Etiam vitae rutrum nisi, eget feugiat est.
      </p>
    </div>
    

    <!-- CARDS -->
    <div class = "flex flex-row"> <!-- BANDAID SOLUTIONS 4 LIFE -->
      <FilterSidebar
          :sort.sync="sort"
          :subjects.sync="subjects"
          :school.sync="school"
          :grade.sync="grade"
          :sortEnabled="false"
          @filter="filter()"
          :absolute="false"
        >
          <vs-button to="/groups" class="w-full">
            <i class="bx bx-arrow-back text-4xl" />
            <div class="text-2xl font-ginger-b">&nbsp; Your Groups</div>
          </vs-button>
      </FilterSidebar>
      
      <div v-if="groupsList.length" class="flex flex-row justify-between flex-wrap self-start" id="groupCard">
        <div v-for="(item, index) in groupsList" :key="index" class="px-2 w-full xxlmin:w-33% lg:w-50% xs:w-100%">
          <GroupsCard :group="item" id="groupsCard"></GroupsCard>
        </div>
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

@Component<DiscoverGroups>({
  components: {NotesCard, FilterSidebar, GroupsCard},
  async mounted() {
    if (groupsStore.groupList.length) return
    const loading = this.$vs.loading({
      type: 'circles',
      text: 'Loading Data'
    })
    try {
      const groups = groupsStore.GetMoreGroups(true)
      await Promise.all([groups])
    } catch (error) {
      console.error({error})
      this.$vs.notification({
        title: error.message,
        color: 'danger'
      })
    }
    this.loaded = true
    loading.close()
  }
})

export default class DiscoverGroups extends mixins(LoadScroll) {
  get noNotesFound() {
    return notesStore.EndOfList && this.groupsList.length == 0
  }
  sort: typeof notesStore.SortSelect = 'createdAt'
  subjects: Subject_O[] = []
  grade: Grade_O = 'ALL'
  school: School_O | 'All Schools' = 'All Schools'

  async filter() {
    const loading = this.$vs.loading()
    groupsStore.SetFilter({
      sortSelect: this.sort,
      filterSubjects: this.subjects,
      filterGrades: this.grade,
      filterSchools: this.school
    })
    await groupsStore.GetMoreGroups(true)
    loading.close()
  }

  @Watch('IsScrolledDown')
  PageHeightChange(val: boolean, oldVal: boolean) {
    if (!this.endOfList && val && this.loaded) {
      this.LoadMoreGroups()
    }
  }
  async LoadMoreGroups() {
    const loading = this.$vs.loading()
    await groupsStore.GetMoreGroups()
    loading.close()
  }
  get endOfList() {
    return groupsStore.EndOfList
  }

  get bodyOverlay() {
    return windowStore.filterSidebarOpen && windowStore.isSmallScreen
  }

  openFilterSidebar() {
    windowStore.SetFilterSidebar(true)
  }

  get groupsList() {
    return groupsStore.groupList
  }
  ToggleGroupsModal(val: boolean) {
    groupsStore.ToggleGroupsModule(val)
  }
}
</script>

<style scoped>
  #groupsCard{
    transition: transform 0.2s cubic-bezier(0.64, -0.01, 0.47, 1.02), box-shadow 0.4s cubic-bezier(0.64, -0.01, 0.47, 1.02);
  }
  #groupsCard:hover{
      transform: translateY(-3px);
  }
</style>