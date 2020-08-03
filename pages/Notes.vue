<template>
  <div
    class="vx-row w-full relative justify-evenly"
    id="notes-screen-container"
  >
  <NotesSidebar/>
    <div class="sidebar-spacer"></div>
    <div class="vx-col lg:w-1/2 md:w-2/3 w-full sidebar-spacer-margin">
    <div class="vx-col w-full display-none md:inline-flex" style="">
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
      >
      </NotesCard>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import { Note } from '~/types/notes'
import NotesCard from '~/components/NotesCard.vue'

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


import NotesSidebar from '~/components/NotesSidebar.vue';
import { windowStore } from '~/store'
@Component<NotesPage>({ components: { NotesCard, NotesSidebar }, layout: 'main' })
export default class NotesPage extends Vue {

  openNotesSidebar()
  {
    windowStore.SetNotesState(true);
  }
  
  notesList: Note[] = [
    new Note({
      title:
        'KubeCon + CloudNativeCon Virtual - August 17-20, 2020 - Connect from Anywhere',
      uid: '',
      userDisplayName: 'Raheem Al-Ahmed ',
      userPhotoUrl:
        'https://lh3.googleusercontent.com/a-/AOh14Ggj2FcgQxSBMwipYEazz4XFF3LqGlZZboUwHHKY',
      createdAt: new Date(),

      contents: '',
      images: ['https://cdn-demo.algolia.com/bestbuy-0118/5477500_sb.jpg'],
      upVotes: 0,
      views: 0
    }),
    new Note({
      title:
        'KubeCon + CloudNativeCon Virtual - August 17-20, 2020 - Connect from Anywhere',
      uid: '',
      userDisplayName: 'Raheem Al-Ahmed ',
      userPhotoUrl:
        'https://lh3.googleusercontent.com/a-/AOh14Ggj2FcgQxSBMwipYEazz4XFF3LqGlZZboUwHHKY',
      createdAt: new Date(),

      contents: html,
      upVotes: 0,
      views: 0
    })
  ]
}
</script>

<style lang="scss">
#notes-screen-container {
  .sidebar-spacer {
    width: calc(260px);
    margin-left: 0;
  }
  // .sidebar-spacer-margin
  // {
  //     margin-left : calc(260px + 2.2rem);
  //    max-width : calc(100% - 260px - 2.2rem)
  // }
}
</style>
