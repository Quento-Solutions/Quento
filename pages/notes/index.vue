<template>
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="notes-screen-container"
  >
    <div id="notes-content-overlay"></div>
    <NotesSidebar />
    <div class="sidebar-spacer"></div>
    <div class="vx-col lg:w-1/2 md:w-2/3 w-full">

      <div class="vx-col w-full inline-flex lg:hidden" style="">
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="openNotesSidebar()">
            <i class="bx bx-menu" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
      </div>
      <NotesCard
        v-for="(note, index) in notesList"
        :key="index"
        class=""
        :note="note"
        :clickable="true"
        :preview="true"
      />
      <vs-alert color="danger" v-if="noNotesFound">
        <template #title>
          No Notes Found For This Search
        </template>
        <b>Sorry!</b> Something went wrong when fetching the Note. Please Try
        Again.
      </vs-alert>
      <vs-button
        size="xl"
        type="filled"
        color="warn"
        class="vx-col shadow-md m-4 text-bold float-right"
        style="font-weight: bold;"
        id="buttonLoadMoreNotes"
        @click="LoadMoreNotes()"
        :disabled="endOfList"
        >Load More &nbsp;
        <i class="bx bx-loader-circle text-2xl" />
      </vs-button>
    </div>
  </div>
</template>

<script lang="ts">
function clickLoadMoreNotes(){
  if (document.getElementById("buttonLoadMoreNotes")){
    document.getElementById("buttonLoadMoreNotes")!.click()
  }
}
setInterval(clickLoadMoreNotes, 500)
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import { Note } from '~/types/notes'

import { windowStore, notesStore } from '~/store'
import NotesSidebar from '~/components/NotesSidebar.vue'
import NotesCard from '~/components/NotesCard.vue'
import NotesSearchBar from '~/components/NotesSearchBar.vue';

@Component<NotesPage>({
  components: { NotesCard, NotesSidebar, NotesSearchBar },
  async mounted() {
    const loading = this.$vs.loading()
    const notes = notesStore.GetMoreNotes()
    const likes = notesStore.GetLikedNotes()
    await Promise.all([notes, likes])
    loading.close()
  }
})
export default class NotesPage extends Vue {
  get noNotesFound() {
    return notesStore.EndOfList && this.notesList.length == 0
  }
  async LoadMoreNotes()
  {
    if (document.body.scrollTop >= document.body.scrollHeight - 650){
      const loading = this.$vs.loading()
      await notesStore.GetMoreNotes()
      loading.close();
    }
  }

  get endOfList()
  {
    return notesStore.EndOfList;
  }
  get bodyOverlay() {
    return windowStore.notesSidebarOpen && windowStore.isSmallScreen
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
  openNotesSidebar() {
    windowStore.SetNotesState(true)
  }

  get notesList() {
    return notesStore.ActiveNotes
  }
}
</script>

<style lang="scss">

</style>
