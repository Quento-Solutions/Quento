<template>
  <div class="w-full" id="discoverMain">
    <!-- LOCAL NAVBAR -->
    <div class="vx-row mb-4 w-full bg-white rounded-md p-2 justify-between">
      <div class="vx-row">
        <vs-avatar class="icon-small float-left" @click="$router.back()">
          <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
        </vs-avatar>
        <vs-avatar class="icon-small ml-2" v-if="isSmallScreen" @click="ToggleMenu()">
          <i class="bx bx-menu" style="font-size: 1.25rem;" />
        </vs-avatar>
      </div>
      <vs-button
        circle
        flat
        success
        animation-type="vertical"
        class="inline-block float-right mr-10"
        @click="ToggleGroupsModal(true)"
      >
        <div class="text-xs font-ginger-b">Create/Join by Link</div>
        <template #animate>
          <i class="bx bx-plus text-2xl"></i>
        </template>
      </vs-button>
    </div>


    <!-- CARDS -->
    <div class="w-full relative flex flex-row">
      <!-- BANDAID SOLUTIONS 4 LIFE -->
      <FilterSidebar
        :sort.sync="sort"
        :subjects.sync="subjects"
        :school.sync="school"
        :grade.sync="grade"
        :sortEnabled="false"
        style="top : auto;"
        @filter="filter()"
      />
      <div style="width:350px"></div>
      <div v-if="groupsList.length" class="grid grid-cols-3 w-full gap-4" id="groupCard">
        <GroupsCard v-for="(item, index) in groupsList" :key="index" :group="item"></GroupsCard>
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
  name: 'discoverGroups',
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
  ToggleMenu() {
    windowStore.SetFilterSidebar(!windowStore.filterSidebarOpen)
  }
  get isSmallScreen()
  {
    return windowStore.smallerThanMd
  }
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
      sortSelect: 'createdAt',
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
