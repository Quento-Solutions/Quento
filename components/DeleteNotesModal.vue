<template>
  <vs-dialog v-model="active" id="deleteNotesModal" not-close width="550px">
    <template #header>
      <h4 class="not-margin">
        Are you <b>sure</b> you want to delete your Note <b>permanently?</b>
      </h4>
    </template>
    <template #footer>
      <div class="con-footer vx-row w-full justify-between">
        <vs-button dark transparent @click="active=false">
          Cancel
        </vs-button>
        <vs-button color="danger" @click="DeleteNote()">
          Ok
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'nuxt-property-decorator'
import { notesStore } from '~/store'

@Component<DeleteNotesModal>({ components: {} })
export default class DeleteNotesModal extends Vue {
  @PropSync('open', { type: Boolean }) active!: boolean
  @Prop({ required: true }) noteId!: string
  Cancel() {
    this.active = false
  }
  async DeleteNote() {
    const loading = this.$vs.loading()
    try {
      await notesStore.DeleteNote(this.noteId)
      this.$router.push('/notes')
      this.$vs.notification({
        title: 'Note Deleted',
        color: 'success'
      })
    } catch (error) {
      this.$qto.error(error);
    }
    loading.close()
  }
}
</script>
