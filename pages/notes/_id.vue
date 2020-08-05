<template>
  <div class="vx-row w-full justify-center" style="">
    <div class="vx-row w-full md:w-2/3 p-4" style="">
      <div class="vx-col w-full display-none md:inline-flex" style="">
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
      </div>
      <NotesCard :note="note" v-if="note"> </NotesCard>
      <vs-alert color="danger" v-if="docNotFound">
        <template #title>
          Something Went Wrong
        </template>
        <b>Sorry!</b> Something went wrong when fetching the Note. Please Try
        Again.
      </vs-alert>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import NotesCard from '~/components/NotesCard.vue'
import { Note, Note_t_F } from '~/types/notes'
import firestore from '~/plugins/firestore'

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

@Component<NotesContentPage>({
  components: { NotesCard },
  layout: 'main',
  mounted() {
    this.fetchNotes()
  }
})
export default class NotesContentPage extends Vue {
  note: Note | null = null
  noteId: string | null = null
  docNotFound = false
  async fetchNotes() {
    const loading = this.$vs.loading()
    this.noteId = this.$route.params.id
    if (!this.noteId) {
      this.$router.push('/notes')
      return
    }
    try {
      const doc = await firestore.doc(`notes/${this.noteId}`).get()
      const noteData = doc.data() as Note_t_F
      if (!noteData) {
        this.docNotFound = true
        loading.close()
        return
      }
      this.note = Note.fromFirebase(noteData, doc.id)
      loading.close()
      return
    } catch (error) {
      console.log({ error })
      loading.close()
    }
  }
  goBack() {
    this.$router.push('/notes')
  }
}
</script>
