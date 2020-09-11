<template>
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="notes-screen-container"
    v-if="group"
  >
    <PostNotesModal :presetGroup="group"></PostNotesModal>
    <PreviewNotesModal></PreviewNotesModal>

    <div class="vx-row mb-4 w-full bg-white rounded-md p-2 justify-between">
      <div class="text-4xl font-bold pl-4">{{group.title}}'s Notes</div>
      <vs-button warn @click="notesModalActive = true">
        <i class="bx bxs-plus-square text-4xl" />
        <div class="text-2xl font-ginger-b">&nbsp; Post New Note</div>
      </vs-button>
    </div>

    <NotesCard
      v-for="(note, index) in groupNotes"
      :key="index"
      class
      :note="note"
      :clickable="true"
      :preview="true"
    />
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch, mixins} from 'nuxt-property-decorator'

import {Note, Note_t_F} from '~/types/notes'

import {windowStore, notesStore} from '~/store'
import NotesCard from '~/components/NotesCard.vue'
import LoadScroll from '~/mixins/LoadScrollMixin'
import firestore from '~/plugins/firestore'
import {Group, Group_t_F} from '~/types/groups'
import UserMixin from '~/mixins/UserMixin'
import PreviewNotesModal from '~/screens/notes/PreviewNotesModal.vue'
import PostNotesModal from '~/screens/notes/PostNotesModal.vue'

@Component<GroupNotes>({
  components: {NotesCard, PreviewNotesModal, PostNotesModal},
  async mounted() {
    if(!this.memberOfGroup) return this.$router.push(`/groups/g/${this.groupId}`);
    const loading = this.$vs.loading({
      type: 'circles',
      text: 'Loading Data'
    })
    try {
      await this.fetchNotes()
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
export default class GroupNotes extends mixins(LoadScroll, UserMixin) {
  groupNotes: Note[] = []

  @Prop({required: true}) group!: Group
  @Prop({required: true, type: Array}) members!: any[]
  @Prop({required: true, type: String}) groupId!: string

  get IsReset() {
    return notesStore.IsReset
  }
  @Watch('IsReset')
  notePosted(val: boolean, oldVal: boolean) {
    if (val) {
      this.fetchNotes()
    }
  }

  get memberOfGroup() {
    return (
      this.group &&
      this.AuthUser?.uid &&
      this.group.memberList.includes(this.AuthUser.uid)
    )
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

  get notesList() {
    return notesStore.ActiveNotes
  }

  async fetchNotes() {
    const loading = this.$vs.loading()
    this.groupId = this.$route.params.id
    if (!this.groupId) {
      this.$router.push('/groups/g/')
      return
    }
    try {
      const doc = await firestore
        .collection('notes')
        .where('groupId', '==', this.groupId)
        .orderBy('magicRank', 'desc')
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
}
</script>

<style lang="scss">
</style>
