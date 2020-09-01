<template>
  <VxCard
    fitContent="true"
    id="note-list-card"
    :class="clickable ? 'previewClickable' : ''"
    @click="PushNotesPage()"
    :no-shadow="true"
    card-border="true"
    class="cursor-pointer"
  >
    <!-- Card Header -->
    <template slot="no-body">
      <div
        class="vx-row w-full justify-between items-center flex-no-wrap p-2"
        style="flex-wrap : nowrap"
      >
        <!-- Profile Picture -->
        <div class="justify-start w-full m-0 vx-row items-center" style="flex-wrap: nowrap">
          <div>
            <vs-avatar class="icon" @click.stop="$router.push(`/user/view/${note.uid}`)">
              <img v-if="note.userPhotoUrl" :src="note.userPhotoUrl" />
              <template slot="text" v-else>{{ note.userDisplayName }}</template>
            </vs-avatar>
          </div>
          <div class="px-3 md:px-5" style="min-width:0">
            <!-- User name -->

            <slot name="title">
              <div class="md:text-xl text-ginger-b truncate text-sm">{{ note.title }}</div>
            </slot>
            <slot name="description">
              <div class="truncate text-sm">{{ note.contents }}</div>
            </slot>
          </div>
        </div>

        <!-- Action Button -->
        <div v-if="hasActions">
          <vs-navbar-group id="menu-dots" @click.stop.prevent="() => false">
            <vs-avatar
              :interactivity="true"
              class="profileIcon icon"
              :badge="badge"
              badge-color="success"
              @click.stop.prevent="() => false"
            >
              <i class="bx bx-dots-horizontal" style="font-size: 1.25rem;" />
            </vs-avatar>
            <template #items>
              <slot name="items"></slot>
            </template>
          </vs-navbar-group>
        </div>
      </div>
    </template>
    <!-- Category Pills -->
  </VxCard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Note } from '~/types/notes'
import { SubjectIconList, SubjectGroup_O, Subject_O } from '~/types/subjects'
import { notesStore, authStore } from '~/store'

@Component<NotesCard>({
  components: {},
  mounted() {
    if (this.note.images && this.note.images.length) {
      this.image = new Image()
      this.image.src = this.note.images[0]
      // this.note.userP
      this.hasImage = true
    }
  }
})
export default class NotesCard extends Vue {
  @Prop({ required: true }) note!: Note
  @Prop({ default: true }) clickable!: boolean
  // Loaded full content
  @Prop({ default: false }) preview!: boolean
  // Whether buttons should work or not
  @Prop({ default: false }) disabled!: boolean

  deleteNotesOpen = false

  formatDate(date?: Date) {
    if (!date) return
    const dateString = date.toDateString()
    return dateString.slice(4, 10) + ',' + dateString.slice(10)
  }
  OpenDeleteModal() {
    this.deleteNotesOpen = true
  }
  get NoteOwner() {
    return authStore.user?.uid == this.note.uid
  }

  OpenEditingModal() {
    notesStore.SetEditNote(this.note)
  }

  getIcon(subject: SubjectGroup_O | Subject_O) {
    return SubjectIconList[subject]
  }
  userLiked(id?: string) {
    if (!id) return false
    return notesStore.likedPosts.includes(id)
  }

  async toggleLike(id?: string, time?: any) {
    if (!id || this.disabled) return
    const a = this.$vs.loading()
    await notesStore.ToggleLikedNote(id)
    a.close()
  }
  vfOptions = {
    autoplay: false,
    allowFullscreen: true
  }
  vfTransitions = ['swipe']
  PushNotesPage() {
    if (this.clickable) return this.$router.push(`/notes/${this.note.id}`)
  }
  hasImage = false
  image?: HTMLImageElement
}
</script>
<style lang="scss">
mark {
  font-size: inherit !important;
}
</style>
