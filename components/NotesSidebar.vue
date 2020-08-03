<template>
  <vs-sidebar
    absolute
    :open.sync="open"
    id="notes-sidebar"
    class="rounded-md w-full notes-sidebar"
    style="z-index: 2; border-radius: 1rem; height: auto;"
  >
    <template #logo>
      <div class="text-xl font-bold">Filters</div>
    </template>
    <div class="sidebar-content p-6 pt-0 w-full">
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

export interface SubjectItem {
  name: string
  iconClass: string
}

export interface SubjectGroup {
  name: string
  iconClass: string
  group: true
  items: SubjectItem[]
}

export const NestedSubjectList: SubjectGroup[] = [
  {
    name: 'Sciences',
    iconClass: 'bxs-magic-wand',
    // Maybe flask
    group: true,
    items: [
      {
        name: 'Physics',
        iconClass: 'bx-atom'
      },
      {
        name: 'Chemistry',
        iconClass: 'bx-bong'
      },
      {
        name: 'Biology',
        iconClass: 'bx-hive'
      },
      {
        name: 'Math',
        iconClass: 'bx-brain'
      }
    ]
  },

  {
    name: 'Languages',
    iconClass: 'bxl-audible',
    // user voice
    group: true,
    items: [
      {
        name: 'English',
        iconClass: 'bx-book-bookmark'
      },

      {
        name: 'French',
        iconClass: 'bxs-map-alt'
      },

      {
        name: 'Spanish',
        iconClass: 'bx-church'
      }
    ]
  },

  {
    name: 'Arts',
    iconClass: 'bx-palette',
    // user voice
    group: true,
    items: [
      {
        name: 'Visual Arts',
        iconClass: 'bx-brush'
      },
      {
        name: 'Music',
        iconClass: 'bx-music'
      },
      {
        name: 'Dance',
        iconClass: 'bxs-guitar-amp'
      },
      {
        name: 'Drama',
        iconClass: 'bxs-user-voice'
      },
      {
        name: 'Film',
        iconClass: 'bx-camera-movie'
      }
    ]
  },
  {
    name: 'Social Sciences',
    iconClass: 'bx-group',
    group: true,
    items: [
      {
        name: 'TOK',
        iconClass: 'bx-network-chart'
      },

      {
        name: 'Geography',
        iconClass: 'bx-landscape'
      },

      {
        name: 'History',
        iconClass: 'bxs-landmark'
      },

      {
        name: 'Business',
        iconClass: 'bx-briefcase'
      }
    ]
  },
  {
    name: 'Technology',
    iconClass: 'bx-laptop',
    group: true,
    items: [
      {
        name: 'ICS',
        iconClass: 'bx-terminal'
      },
      {
        name: 'ITGS',
        iconClass: 'bx-globe-alt'
      },

      {
        name: 'ComTech',
        iconClass: 'bx-message-rounded-edit'
      }
    ]
  }
]

import { windowStore } from '~/store'

@Component<NotesSidebar>({ components: {} })
export default class NotesSidebar extends Vue {
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
    return !windowStore.isSmallScreen || windowStore.notesSidebarOpen;
  }

  set open(open) {
      console.log(open);
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
