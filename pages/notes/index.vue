<template>
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="notes-screen-container"
  >
    <div id="notes-content-overlay"></div>
    <FilterSidebar
      :sort.sync="sort"
      :subjects.sync="subjects"
      :school.sync="school"
      :grade.sync="grade"
      @filter="filter()"
    >
      <vs-button warn @click="notesModalActive = true" class="w-full">
        <i class="bx bxs-plus-square text-4xl" />
        <div class="text-2xl font-ginger-b">&nbsp; Post New Note</div>
      </vs-button>
    </FilterSidebar>
    <div class="sidebar-spacer"></div>
    <div class="vx-col lg:w-2/3 md:w-2/3 w-full">
      <div class="vx-col w-full inline-flex lg:hidden" style>
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="openFilterSidebar()">
            <i class="bx bx-menu" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
      </div>
      <NotesCard
        v-for="(note, index) in notesList"
        :key="index"
        class
        :note="note"
        :clickable="true"
        :preview="true"
      />
      <vs-alert color="danger" v-if="noNotesFound">
        <template #title>No Notes Found For This Search</template>
        <b>Sorry!</b> Something went wrong when fetching the Note. Please Try
        Again.
      </vs-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, mixins } from 'nuxt-property-decorator'

import { Note } from '~/types/notes'

import { windowStore, notesStore } from '~/store'
import FilterSidebar from '~/components/FilterSidebar.vue'
import NotesCard from '~/components/NotesCard.vue'
import LoadScroll from '~/mixins/LoadScrollMixin'
import { Subject_O, Grade_O } from '~/types/subjects'
import { School_O } from '~/types/schools'

@Component<NotesPage>({
  components: { NotesCard, FilterSidebar },
  async mounted() {
    const loading = this.$vs.loading({
      type: 'circles',
      text : "Loading Data"
    })
    try {
      const notes = notesStore.GetMoreNotes(true)
      await Promise.all([notes])
    } catch (error)
    {
      console.error({error});
      this.$vs.notification({
        title : error.message,
        color : "danger"
      })
    }
    this.loaded = true;
    loading.close()
  }
})
export default class NotesPage extends mixins(LoadScroll) {
  get noNotesFound() {
    return notesStore.EndOfList && this.notesList.length == 0
  }
  sort: typeof notesStore.SortSelect = 'magicRank'
  subjects: Subject_O[] = []
  grade: Grade_O = 'ALL'
  school: School_O | 'All Schools' = 'All Schools'

  async filter() {
    const loading = this.$vs.loading()
    notesStore.SetFilter({
      sortSelect: this.sort,
      filterSubjects: this.subjects,
      filterGrades: this.grade,
      filterSchools: this.school
    })
    await notesStore.GetMoreNotes(true)
    loading.close()
  }
  @Watch('IsScrolledDown')
  PageHeightChange(val: boolean, oldVal: boolean) {
    if (val && this.loaded) {
      this.LoadMoreNotes()
    }
  }

  async LoadMoreNotes() {
    const loading = this.$vs.loading()
    await notesStore.GetMoreNotes()
    loading.close()
  }

  get endOfList() {
    return notesStore.EndOfList
  }
  get bodyOverlay() {
    return windowStore.filterSidebarOpen && windowStore.isSmallScreen
  }
  get previewModalActive() {
    return notesStore.PreviewModalOpen
  }
  set previewModalActive(value: boolean) {
    notesStore.TogglePreviewModal(value)
  }

  get notesModalActive() {
    return notesStore.NotesModuleOpen
  }
  set notesModalActive(value: boolean) {
    notesStore.ToggleNotesModule(value)
  }
  openFilterSidebar() {
    windowStore.SetFilterSidebar(true)
  }

  get notesList() {
    return notesStore.ActiveNotes
  }
}
</script>

<style lang="scss">
</style>
