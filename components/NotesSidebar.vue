<template>
  <vs-sidebar
    absolute
    :open.sync="open"
    id="notes-sidebar"
    class="rounded-md w-full notes-sidebar"
    style="z-index: 2; border-radius: 1rem; height: auto;"
  >
    <div>
      <div class="vx-row w-full justify-center p-4">

        <vs-button danger @click="open = false" class="w-full close-menu">
        <i class="bx bx-x text-4xl" />
        <div class="text-2xl font-ginger-b">
          &nbsp;Close Menu
        </div>
      </vs-button> 

      <vs-button warn @click="toggleNotesModal(true)" class="w-full">
        <i class="bx bxs-plus-square text-4xl" />
        <div class="text-2xl font-ginger-b">
          &nbsp; Post New Note 
        </div>
      </vs-button>
      </div>
    </div>
    <div class="sidebar-content p-6 pt-0 w-full">

      <div class="filter-options">
        <SubjectsDropdown :value.sync="SubjectDict" :list.sync="ActiveSubjectList"></SubjectsDropdown>
      </div>

        <vs-select
        label="Grade"
        filter
        class="block mb-6 w-6 mt-6 w-full lg:w-1/2 sort-option"
        placeholder="Grade"
        v-model="gradeSelect"
      >
        <vs-option
          v-for="(grade, subIndex) in GradeList"
          :key="subIndex"
          :label="`Grade ${grade}`"
          :value="grade"
        >
          <div class="font-bold truncate">Grade {{ grade }}</div>
        </vs-option>
      </vs-select>

        <vs-select
        label="Sort By"
        filter
        class="block mb-6 w-6 mt-6 w-full lg:w-1/2 sort-option"
        placeholder="Sort By"
        v-model="sortSelect"
      >
        <vs-option
          v-for="(sort, subIndex) in SortOptions"
          :key="subIndex"
          :label="sort.name"
          :value="sort.value"
        >
          <div class="font-bold truncate">{{sort.name}}</div>
        </vs-option>
      </vs-select>

      <div class="vx-row w-full">
        
        
          <vs-button
            class="text-3xl text-ginger-b p-2 w-full filter-button"
            style="font-size: 1.25rem;"
            size="lg"
            color="#99b8d1"
            @click="clearFilter()"
            >CLEAR FILTERS</vs-button
          >

          <vs-button
            class="text-3xl text-ginger-b p-2 w-full filter-button"
            style="font-size: 1.25rem;"
            size="lg"
            color="#b553ea"
            @click="filterSubjects()"
            >FILTER</vs-button
          >
      </div>
    </div>
  </vs-sidebar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { windowStore, notesStore } from '~/store'
import {
  GradeList,
  Grade_O,
  SubjectList,
  Subject_O,
  SortOptionsList,
  SortOptions_O,
  SubjectOptions
} from '~/types/subjects'

import SubjectsDropdown from '~/components/SubjectsDropdown.vue';

@Component<NotesSidebar>({ components: { SubjectsDropdown } })
export default class NotesSidebar extends Vue {
  GradeList = GradeList
  SortOptions = SortOptionsList;
  gradeSelect: Grade_O = notesStore.ActiveGrade
  allGradesSelected = true
  sortSelect : SortOptions_O = notesStore.SortSelect;

  toggleNotesModal(val: boolean) {
    notesStore.ToggleNotesModule(val)
  }

  SubjectDict = SubjectOptions;
  ActiveSubjectList :Subject_O[] = [];

  selectAllSubjects() {
    // Don't Reassign this.SubjectDict, alter values instead
    SubjectList.forEach(subject => this.SubjectDict[subject] = false);
    this.ActiveSubjectList.splice(0, this.ActiveSubjectList.length);
  }

  clearFilter() {
    this.selectAllSubjects();
    this.gradeSelect = 'ALL';
    this.sortSelect = "createdAt";
  }

  async filterSubjects() {
    const loading = this.$vs.loading()
    notesStore.SetActiveFilter({
      sortSelect : this.sortSelect,
      filterSubjects : this.ActiveSubjectList,
      filterGrades : this.gradeSelect,
    });
    await notesStore.GetMoreNotes();
    loading.close()
  }

  get open() {
    return !windowStore.smallerThanMd || windowStore.notesSidebarOpen
  }

  set open(open) {
    windowStore.SetNotesState(open)
  }
}
</script>

<style lang="scss">
.notes-sidebar {
  transform: translate(-130%);
}
.open {
  transform: translate(0%);
}
// sidebar subject hover effect
.vs-sidebar__item:hover {
  padding-left: 30px !important;
}
.filter-options {
  padding:0 10px !important;
}
.vs-sidebar__item__arrow {
  margin-right: 50px !important;
}
.vs-sidebar__group__header {
  margin-bottom: 3% !important;
}
.sort-option {
  margin-top: 40px;
}
.filter-button {
  letter-spacing: 0.1rem;
}
.close-menu {
  display:none;
}
@media only screen and (max-width: 991px) {
  .close-menu {
  display:block;
  }
}
</style>
