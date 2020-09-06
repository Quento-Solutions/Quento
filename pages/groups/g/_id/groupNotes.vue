<template>
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="notes-screen-container"
    v-if="group"
  >
    <div id="notes-content-overlay"></div>
    <!-- <FilterSidebar
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
    </div>-->
    <div class="vx-row mb-4 w-full bg-white rounded-md p-2 justify-start">
      <vs-avatar class="icon-small float-left" @click="goBack()">
        <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
      </vs-avatar>
      <div class="text-4xl font-bold pl-4">{{group.title}}'s Notes</div>
    </div>
    <NotesCard
      v-for="(note, index) in groupNotes"
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
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch, mixins} from 'nuxt-property-decorator'

import {Note, Note_t_F} from '~/types/notes'

import {windowStore, notesStore} from '~/store'
import FilterSidebar from '~/components/FilterSidebar.vue'
import NotesCard from '~/components/NotesCard.vue'
import LoadScroll from '~/mixins/LoadScrollMixin'
import {Subject_O, Grade_O} from '~/types/subjects'
import {School_O} from '~/types/schools'
import firestore from '~/plugins/firestore'
import {Group, Group_t_F} from '~/types/groups'
import functions from '~/plugins/firebaseFunctions'
import UserMixin from '~/mixins/UserMixin'

@Component<NotesPage>({
  components: {NotesCard, FilterSidebar},
  async mounted() {
    this.fetchNotes()
    this.fetchGroup()
    const loading = this.$vs.loading({
      type: 'circles',
      text: 'Loading Data'
    })
    try {
      const notes = notesStore.GetMoreNotes(true)
      await Promise.all([notes])
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
export default class NotesPage extends mixins(LoadScroll, UserMixin) {
  groupNotes: Note[] = []
  note: Note | null = null
  noteId: string | null = null
  groupId: string | null = null
  docNotFound = false
  group: Group | null = null
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
  get memberOfGroup() {
    return (
      this.group &&
      this.AuthUser?.uid &&
      this.group.memberList.includes(this.AuthUser.uid)
    )
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
  get NoteId() {
    return this.$route.params.id
  }
  get notesList() {
    return notesStore.ActiveNotes
  }
  async fetchNotes() {
    const loading = this.$vs.loading()
    this.noteId = this.$route.params.id
    if (!this.noteId) {
      this.$router.push('/notes')
      return
    }
    try {
      const doc = await firestore
        .collection('notes')
        .where('groupId', '==', this.noteId)
        .get()
      this.groupNotes = doc.docs.map((document) =>
        Note.fromFirebase(document.data() as Note_t_F, document.id)
      )
      loading.close()
      return
    } catch (error) {
      console.log({error})
      loading.close()
    }
  }
  async fetchGroup() {
    //   this.group!.bac
    const loading = this.$vs.loading()
    this.groupId = this.$route.params.id
    if (!this.groupId) {
      this.$router.push('/groups')
      return
    }
    try {
      const doc = await firestore.doc(`groups/${this.groupId}`).get()
      const groupData = doc.data() as Group_t_F
      if (!groupData) {
        this.docNotFound = true
        loading.close()
        return
      }
      this.group = Group.fromFirebase(groupData, doc.id)
      loading.close()
      return
    } catch (error) {
      console.log({error})
      loading.close()
    }
  }
  async GenerateJoinToken() {
    const groupId = this.groupId
    if (
      !groupId ||
      this.docNotFound ||
      !this.group ||
      !this.group.approved ||
      !this.memberOfGroup
    )
      return
    const loading = this.$vs.loading()
    const res = await functions.httpsCallable('GenerateJoinToken')({groupId})
    if (res.data.status !== 200) {
      this.$vs.notification({
        title: res.data.message,
        color: 'danger'
      })
      console.log({res})
    } else {
      this.fetchGroup()
    }
    loading.close()
  }
  goBack() {
    this.$router.push('/groups/g/' + this.groupId)
  }
}
</script>

<style lang="scss">
</style>
