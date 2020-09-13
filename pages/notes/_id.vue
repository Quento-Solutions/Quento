<template>
  <div class="vx-row w-full justify-center" style>
    <EditNotesModal :isActive.sync="Editing" :NoteData="note" @reset="noteIdChange()"></EditNotesModal>
    <div class="vx-row w-full md:w-2/3 p-4" style>
      <div class="vx-col w-full display-none md:inline-flex" style>
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
      </div>
      <NotesCard :note="note" v-if="note"></NotesCard>
      <vs-alert color="danger" v-if="docNotFound">
        <template #title>Something Went Wrong</template>
        <b>Sorry!</b> Something went wrong when fetching the Note. Please Try
        Again.
      </vs-alert>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch, mixins} from 'nuxt-property-decorator'
import NotesCard from '~/components/NotesCard.vue'
import {Note, Note_t_F} from '~/types/notes'
import firestore from '~/plugins/firestore'
import {notesStore} from '~/store'
import EditNotesModal from '~/screens/notes/EditNotesModal.vue'
import UserMixin from '~/mixins/UserMixin'

@Component<NotesContentPage>({
  components: {NotesCard, EditNotesModal},
  layout: 'main',
  mounted() {
    this.noteIdChange()
  }
})
export default class NotesContentPage extends mixins(UserMixin) {
  note: Note | null = null
  docNotFound = false

  get Editing()
  {
    return this.$route.query.editing === 'true';
  }
  set Editing(val : boolean)
  {
    this.$router.replace(`/notes/${this.noteId}${val ? '?editing=true' : ''}`)
  }

  @Watch('Editing')
  editingChange(newVal ?: boolean, oldVal ?: boolean)
  {
    if(!this.AuthUser?.uid || (this.note && this.AuthUser.uid !== this.note.uid))
    {
      this.Editing = false;
    }
  }

  get noteId() {
    return this.$route.params.id
  }
  @Watch('noteId')
  async noteIdChange(value ?: string, oldValue ?: string) {
    // This is to update the page when going from notes/note1 -> notes/note2
    await this.fetchNotes()
    this.editingChange(this.Editing);
  }

  async fetchNotes() {
    const loading = this.$vs.loading()
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
      notesStore.IncrementView(this.noteId)
      this.note = Note.fromFirebase(noteData, doc.id)
      //Add note to activeNotes so functions work
      notesStore.pushActiveNotes(this.note)
      loading.close()
      return
    } catch (error) {
      console.log({error})
      loading.close()
    }
  }
  goBack() {
    this.$router.back()
  }
}
</script>
