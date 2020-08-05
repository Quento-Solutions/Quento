<template>
  <vs-sidebar
    absolute
    :open.sync="open"
    id="notes-sidebar"
    class="rounded-md w-full notes-sidebar"
    style="z-index: 2; border-radius: 1rem; height: auto;"
  >
    <template #logo>
      <vs-button icon danger @click="open = false">
        <i class="bx bx-x text-2xl" />
      </vs-button>
      <vs-button warn @click="toggleNotesModal(true)">
        <div class="text-2xl font-ginger-b">
          Posted Note &nbsp;
        </div>
        <i class="bx bx-notepad text-4xl" />
      </vs-button>
    </template>
    <div class="sidebar-content p-6 pt-0 w-full">
      <div class="text-xl font-bold w-full vx-row justify-center pb-2">
        Filters
      </div>
      
      <!-- <div
        class="w-full rounded mb-4"
        style="background-color: gray; height: 2px;"
      />

      <h6 class="font-bold mb-3">Rating</h6>

      <div
        class="vx-row w-full justify-evenly p-2 cursor-pointer"
        @mouseleave="unhoverStar()"
      >
        <i
          v-for="number in 5"
          :key="number"
          class="bx bxs-star text-3xl"
          :style="starColored(number)"
          @mouseover="hoverStar(number)"
          @click="setStarsFilter(number)"
        />
      </div> -->
<!-- 
      <div class="vx-row w-full">
        <div class="vx-col w-1/2 text-ginger" style="">
          <vs-button
            class="text-3xl text-ginger-b"
            size="lg"
            :active="false"
            color="#808080"
            border
            @click="clearFilter()"
            :disabled="clearDisabled"
            >CLEAR</vs-button
          >
        </div>

        <div class="vx-col w-1/2 text-ginger" style="">
          <vs-button
            class="text-3xl text-ginger-b"
            size="lg"
            color="warn"
            @click="setFilter()"
            :disabled="buttonDisabled"
            >FILTER</vs-button
          >
        </div>
      </div> -->

      <div
        class="w-full rounded my-4"
        style="background-color: gray; height: 2px;"
      />
      <h6 class="font-bold mb-5">Subjects</h6>

      <div
        class="my-2 ml-6 vx-row items-center border-solid cursor-pointer"
        @click="selectAllSubjects()"
      >
        <i
          class="bx text-3xl mr-2"
          :class="
            allSelected
              ? 'bxs-coin-stack text-purple-500'
              : 'bx-coin-stack text-gray-300'"
          style="transition-duration: 0.25s;"
        />

        <div class="font-bold truncate text-xl">
          All
        </div>
      </div>
      <vs-sidebar-group
        v-for="(subjectGroup, groupIndex) in subjectGroups"
        :key="groupIndex + 4"
      >
        <template #header>
          <vs-sidebar-item arrow>
            <div class="vx-row w-full">
            <!-- <vs-button /> -->
              <i class="bx text-3xl" :class="subjectGroup.iconClass" />


              <div class="font-bold truncate ml-4">
                {{ subjectGroup.name }}
              </div>
            </div>
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item
          v-for="(subject, index) in subjectGroup.items"
          :key="index"
        >
          <vs-checkbox
            v-model="SubjectDict[subject.name]"
            @click="subjectClicked(subject.name)"
          >
            <i class="bx text-3xl mr-2" :class="subject.iconClass" />
            <div class="font-bold truncate">
              {{ subject.name }}
            </div>
          </vs-checkbox>
        </vs-sidebar-item>
      </vs-sidebar-group>
      <div
        class="w-full rounded my-4"
        style="background-color: gray; height: 2px;"/>

        <vs-select
        label="Grade"
        filter
        class="block mb-6 w-6 mt-6 w-full lg:w-1/2"
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
        class="block mb-6 w-6 mt-6 w-full lg:w-1/2"
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
        <div class="vx-col w-1/2 text-ginger" style="">
          <vs-button
            class="text-3xl text-ginger-b p-2 w-full"
            style="font-size: 1.25rem;"
            size="lg"
            :active="false"
            color="#808080"
            border
            @click="clearFilter()"
            >CLEAR</vs-button
          >
        </div>

        <div class="vx-col w-1/2 text-ginger" style="">
          <vs-button
            class="text-3xl text-ginger-b p-2 w-full"
            style="font-size: 1.25rem;"
            size="lg"
            color="success"
            @click="filterSubjects()"
            >GO</vs-button
          >
        </div>
      </div>
    </div>
  </vs-sidebar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { windowStore, notesStore } from '~/store'
import {
  NestedSubjectList,
  GradeList,
  Grade_O,
  SubjectList,
  Subject_O,
  SubjectGroup_O,
  SubjectGroups,
  SortOptionsList,
  SortOptions_O
  // SubjectGroupDict
} from '~/types/subjects'

  let s: {
    [index in Subject_O]?: boolean
  } = {}
  SubjectList.forEach((subject) => (s[subject] = false))
    const g: {
    [index in SubjectGroup_O] : boolean
  } = {
    Sciences : false,
    Arts : false,
    Languages : false,
    "Social Sciences" : false,
    Technology : false,
  }
// huh.
@Component<NotesSidebar>({ components: {} })
export default class NotesSidebar extends Vue {
  GradeList = GradeList
  SortOptions = SortOptionsList;
  gradeSelect: Grade_O = notesStore.ActiveGrade
  allGradesSelected = true
  sortSelect : SortOptions_O = notesStore.SortSelect;

  subjectClicked(name : Subject_O, clicked = true, value =!this.SubjectDict[name])
  {
    this.allSelected = false;
    if(value === true && !this.ActiveSubjectList.includes(name))
    {
      this.ActiveSubjectList.unshift(name);
      if(this.ActiveSubjectList.length > 10)
      {
        const removedSubject = this.ActiveSubjectList.pop()!;
        console.log({removedSubject});
        this.SubjectDict[removedSubject] = false;
      }
    }
    else 
    {
      this.ActiveSubjectList = this.ActiveSubjectList.filter(val => val !== name);
    }
    if(!clicked) this.SubjectDict[name] = value;
  }

  subjectGroupClicked(name : SubjectGroup_O)
  {
    SubjectGroups[name].forEach((subject : Subject_O)=> this.subjectClicked(subject, false, true));
  }



  toggleNotesModal(val: boolean) {
    notesStore.ToggleNotesModule(val)
  }
  SubjectDict = s;
  ActiveSubjectList :Subject_O[] = [];

  // selectedSubjects = SubjectList.map()
  currentSubjects = NestedSubjectList.flatMap((value) =>
    value.items.map((v2) => v2.name)
  )
  allSelected = true
  subjectGroups = NestedSubjectList

  selectAllSubjects() {
    console.log(this.allSelected)
    if (!this.allSelected) {
      SubjectList.forEach((subject) => (this.SubjectDict[subject] = false))
      this.ActiveSubjectList = [];
      this.allSelected = true
    } else {
      this.currentSubjects = []
      this.allSelected = false
    }
  }

  hoverStars = 3
  filterStars = 3
  activeStars = 3

  clearFilter() {
    if(!this.allSelected)
    {
      this.selectAllSubjects();
    }
    this.gradeSelect = 'ALL';
    this.sortSelect = "upVotes";
  }
  setFilter() {
    this.activeStars = this.hoverStars = this.filterStars
  }

  get clearDisabled() {
    return this.activeStars == 0
  }
  get buttonDisabled() {
    return this.activeStars == this.filterStars
  }

  starColored(index: number) {
    if (index <= this.hoverStars) return 'color : orange;'
  }

  hoverStar(index: number) {
    this.hoverStars = index
  }

  unhoverStar() {
    this.hoverStars = this.filterStars
  }

  setStarsFilter(index: number) {
    this.hoverStars = this.filterStars = index
  }

  async filterSubjects() {
    const loading = this.$vs.loading()
    notesStore.SetActiveFilter({
      sortSelect : this.sortSelect,
      filterSubjects : this.ActiveSubjectList,
      filterGrades : this.gradeSelect,
      allSubjectsSelected : this.allSelected
    });
    await notesStore.GetMoreNotes();
    loading.close()
  }

  get open() {
    return !windowStore.isSmallScreen || windowStore.notesSidebarOpen
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
</style>
