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
      <div
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
      </div>

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
      </div>

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
              : 'bx-coin-stack text-gray-300'
          "
          style="transition-duration: 0.25s;"
        />

        <div class="font-bold truncate text-xl">
          All
        </div>
      </div>
      <vs-sidebar-group
        v-for="(subjectGroup, groupIndex) in subjectGroups"
        :key="groupIndex"
      >
        <template #header>
          <vs-sidebar-item arrow>
            <vs-checkbox
              v-model="currentSubjects"
              :val="subjectGroup.name"
              @click="allSelected = false"
            >
              <i class="bx text-3xl mr-2" :class="subjectGroup.iconClass" />
              <div class="font-bold truncate">
                {{ subjectGroup.name }}
              </div>
            </vs-checkbox>
          </vs-sidebar-item>
        </template>
        <vs-sidebar-item
          v-for="(subject, index) in subjectGroup.items"
          :key="index"
        >
          <vs-checkbox
            v-model="currentSubjects"
            :val="subject.name"
            @click="allSelected = false"
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
        style="background-color: gray; height: 2px;"
      />
      <h6 class="font-bold mb-5">Grades</h6>
                  <div
              class="my-2 ml-6 vx-row items-center border-solid cursor-pointer"
              @click="selectAllGrades()"
            >
              <i
                class="bx text-3xl mr-2"
                :class="
                  allGradesSelected
                    ? 'bxs-coin-stack text-purple-500'
                    : 'bx-coin-stack text-gray-300'
                "
                style="transition-duration: 0.25s;"
              />

              <div class="font-bold truncate text-xl">
                All
              </div>
            </div>


        <vs-sidebar-item
          v-for="(grade, index) in GradeOptions"
          :key="index"
        >
          <vs-checkbox
            v-model="currentGrades"
            :val="grade"
            @click="allGradesSelected = false"
          >
            <div class="font-bold truncate ml-6">
              Grade {{grade}}
            </div>
          </vs-checkbox>
        </vs-sidebar-item>

      <div class="vx-row w-full">
        <div class="vx-col w-1/2 text-ginger" style="">
          <vs-button
            class="text-3xl text-ginger-b p-2 w-full"
            style="font-size: 1.25rem;"
            size="lg"
            :active="false"
            color="#808080"
            border
            @click="selectAllSubjects()"
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
import { NestedSubjectList, GradeList, Grade_O } from '~/types/subjects'

@Component<NotesSidebar>({ components: {} })
export default class NotesSidebar extends Vue {

  GradeOptions = GradeList;
  currentGrades : Grade_O[] = [...GradeList];
  allGradesSelected = true;


  selectAllGrades()
  {
    if (!this.allGradesSelected)
    {
      this.allGradesSelected = true;
      this.currentGrades = [...GradeList];
    } else 
    {
      this.allGradesSelected = false;
      this.currentGrades = []
    }
  }

  toggleNotesModal(val: boolean) {
    notesStore.ToggleNotesModule(val)
  }

  currentSubjects = NestedSubjectList.flatMap((value) =>
    value.items.map((v2) => v2.name)
  )
  allSelected = true
  subjectGroups = NestedSubjectList

  selectAllSubjects() {
    console.log(this.allSelected)
    if (!this.allSelected) {
      this.currentSubjects = NestedSubjectList.flatMap((value) =>
        value.items.map((v2) => v2.name)
      )
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
    this.activeStars = this.hoverStars = this.filterStars = 0
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

  filterSubjects() {}

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
