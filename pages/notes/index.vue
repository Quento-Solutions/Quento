<template>
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="notes-screen-container"
  >
    <PreviewNotesModal v-model="previewModalActive" />
    <PostNotesModal v-model="notesModalActive" />
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
      >
      </NotesCard>
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
        @click="LoadMoreNotes()"
        :disabled="endOfList"
        >Load More &nbsp;
        <i class="bx bx-loader-circle text-2xl" />
      </vs-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import { Note } from '~/types/notes'

const html = `# Quento

## Description
Welcome to Quento, a collection of utilities created by students, for students. Quento is an open source web app created by high school students using Vue.js, with the sole purpose of creating and compiling useful software to a single location to help students better manage their education.  

## Build Setup
\`\`\`
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
\`\`\`
`

import { windowStore, notesStore } from '~/store'
import NotesSidebar from '~/components/NotesSidebar.vue'
import PostNotesModal from '~/screens/PostNotesModal.vue'
import PreviewNotesModal from '~/screens/PreviewNotesModal.vue'

import NotesCard from '~/components/NotesCard.vue'

@Component<NotesPage>({
  components: { NotesCard, NotesSidebar, PostNotesModal, PreviewNotesModal },
  layout: 'main',
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
    const loading = this.$vs.loading()
    await notesStore.GetMoreNotes()
    loading.close();
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
#notes-screen-container {
  .sidebar-spacer {
    width: calc(130px);
    margin-left: 0;
  }

  #notes-content-overlay {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: opacity 0.7s;
    z-index: -1;
  }
}
#notes-screen-container.show-overlay {
  #notes-content-overlay {
    z-index: 1;
    opacity: 1;
  }
}

</style>
