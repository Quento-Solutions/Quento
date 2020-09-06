<template>
  <vs-sidebar
    :absolute="absolute"
    :relative="!absolute"
    :open.sync="open"
    id="notes-sidebar"
    class="rounded-md w-full notes-sidebar"
    style="z-index: 2; border-radius: 1rem; height: auto;"
    :style="style"
  >
    <div>
      <div class="vx-row w-full justify-center p-4">
        <vs-button danger @click="open = false" class="w-full close-menu">
          <i class="bx bx-x text-4xl" />
          <div class="text-2xl font-ginger-b">&nbsp;Close Menu</div>
        </vs-button>

        <slot></slot>
      </div>
    </div>
    <div class="sidebar-content p-6 pt-0 w-full">
      <!-- Filters -->
      <div class="filter-options">
        <vs-sidebar-group
          color="#9331e1"
          v-for="(subjectGroup, groupIndex) in subjectGroups"
          :key="groupIndex + 4"
        >
          <template #header>
            <vs-sidebar-item arrow>
              <div class="vx-row w-full">
                <!-- <vs-button /> -->
                <i class="bx text-3xl" :class="subjectGroup.iconClass" />

                <div class="font-bold truncate ml-4">{{ subjectGroup.name }}</div>
              </div>
            </vs-sidebar-item>
          </template>

          <vs-sidebar-item v-for="(subject, index) in subjectGroup.items" :key="index">
            <vs-checkbox
              color="#4D7C8A"
              v-model="SubjectDict[subject.name]"
              @click="subjectClicked(subject.name)"
            >
              <i class="bx text-3xl mr-2" :class="subject.iconClass" />
              <div class="font-bold truncate">{{ subject.name }}</div>
            </vs-checkbox>
          </vs-sidebar-item>
        </vs-sidebar-group>
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
        label="School"
        filter
        class="block mb-6 w-6 mt-6 w-full lg:w-1/2 sort-option"
        placeholder="School"
        v-model="schoolSelect"
      >
        <vs-option
          v-for="(school, subIndex) in SchoolList"
          :key="subIndex"
          :label="school"
          :value="school"
        >
          <div class="font-bold truncate">{{ school }}</div>
        </vs-option>
      </vs-select>

      <vs-select
        label="Sort By"
        v-if="sortEnabled"
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
        >CLEAR FILTERS</vs-button>

        <vs-button
          class="text-3xl text-ginger-b p-2 w-full filter-button"
          style="font-size: 1.25rem;"
          size="lg"
          color="#b553ea"
          @click="filterSubjects()"
        >FILTER</vs-button>
      </div>
    </div>
  </vs-sidebar>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'nuxt-property-decorator'
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
} from '~/types/subjects'
import { SchoolList, School_O } from '~/types/schools'

let s: {
  [index in Subject_O]?: boolean
} = {}
SubjectList.forEach((subject) => (s[subject] = false))

@Component<NotesSidebar>({ components: {} })
export default class NotesSidebar extends Vue {
  @PropSync('subjects', {type : Array}) ActiveSubjectList!: Subject_O[]
  @PropSync('grade') gradeSelect!: Grade_O
  @PropSync('school') schoolSelect!: School_O | 'All Schools'
  @PropSync('sort') sortSelect!: typeof notesStore.SortSelect
  @Prop({default : true}) sortEnabled !: boolean
  @Prop({default : true}) absolute !: boolean
  @Prop({default : ''}) style !: string;

  SubjectDict = s
  GradeList = GradeList
  SortOptions = [...SortOptionsList]
  readonly SchoolList = ['All Schools', ...SchoolList]

  subjectClicked(
    name: Subject_O,
    clicked = true,
    value = !this.SubjectDict[name]
  ) {
    this.allSelected = false
    if (value === true && !this.ActiveSubjectList.includes(name)) {
      this.ActiveSubjectList.unshift(name)
      if (this.ActiveSubjectList.length > 10) {
        const removedSubject = this.ActiveSubjectList.pop()!
        this.SubjectDict[removedSubject] = false
      }
    } else {
      this.ActiveSubjectList = this.ActiveSubjectList.filter(
        (val) => val !== name
      )
    }
    if (!clicked) this.SubjectDict[name] = value
  }

  subjectGroupClicked(name: SubjectGroup_O) {
    SubjectGroups[name].forEach((subject: Subject_O) =>
      this.subjectClicked(subject, false, true)
    )
  }

  currentSubjects = NestedSubjectList.flatMap((value) =>
    value.items.map((v2) => v2.name)
  )
  allSelected = true
  subjectGroups = NestedSubjectList

  selectAllSubjects() {
    if (!this.allSelected) {
      SubjectList.forEach((subject) => (this.SubjectDict[subject] = false))
      this.ActiveSubjectList = []
      this.allSelected = true
    } else {
      this.currentSubjects = []
      this.allSelected = false
    }
  }
  clearFilter() {
    if (!this.allSelected) {
      this.selectAllSubjects()
    }
    this.gradeSelect = 'ALL'
    this.schoolSelect = 'All Schools'
    this.sortSelect = 'magicRank'
  }

  async filterSubjects() {
    this.$emit('filter')
  }

  get open() {
    return !windowStore.smallerThanMd || windowStore.filterSidebarOpen
  }

  set open(open) {
    windowStore.SetFilterSidebar(open)
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
  padding: 0 10px !important;
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
  display: none;
}
@media only screen and (max-width: 991px) {
  .close-menu {
    display: block;
  }
}
</style>
