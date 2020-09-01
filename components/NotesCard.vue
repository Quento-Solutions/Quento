<template>
  <VxCard
    fitContent="true"
    class="mb-8"
    id="note-card"
    :class="clickable ? 'previewClickable' : ''"
    @click="PushNotesPage()"
  >
    <DeleteNotesModal v-if="!disabled && NoteOwner" :open.sync="deleteNotesOpen" :noteId="note.id"></DeleteNotesModal>
    
    <!-- Card Header -->
    <AvatarBar
      :username="note.userDisplayName"
      :date="note.createdAt"
      :photoURL="note.userPhotoUrl"
      :badge="NoteOwner"
      :userId="note.uid"
    >
      <template #items v-if="!disabled">
        <div
          @click.stop.prevent="OpenEditingModal()"
          v-if="NoteOwner"
          class="w-full px-2 py-1 menu-item rounded-md"
        >
          <i class="bx bx-edit" style="font-size: 1.25rem;" />
          Edit
        </div>
        <div
          @click.stop.prevent="PushNotesPage()"
          class="w-full px-2 py-1 menu-item rounded-md"
        >Details</div>
        <div
          @click.stop.prevent="OpenDeleteModal()"
          v-if="NoteOwner"
          class="w-full px-2 py-1 menu-item rounded-md bg-red-600 text-white"
        >
          <i class="bx bx-trash" style="font-size: 1.25rem;" />
          Delete
        </div>
      </template>
    </AvatarBar>


    <!-- Category Pills -->
    <div class="w-4/5 vx-row p-2 items-start md:items-center text-sm mt-2 flex-col md:flex-row title-content">
      <div
        class="rounded-full p-2 px-4 cursor-pointer vx-row items-center text-ginger text-white"
        style="background-color: #ed8936"
      >Grade {{ note.grade }}</div>
      <div
        class="rounded-full p-2 px-4 cursor-pointer vx-row items-center text-ginger text-white mx-0 mt-2 md:mt-0 md:mx-2"
        style="background-color: #9f7aea"
      >
        <i
          class="bx text-xl text-white mr-2"
          :class="getIcon(note.subject)"
          style="background-color:transparent;"
        />
        {{ note.subject }}
      </div>
      <VxTooltip v-if="note.school">
        <div
          class="rounded-full p-2 px-4 cursor-pointer vx-row items-center text-ginger text-white truncate"
          style="background-color: #6398de; max-width : 150px"
        >{{note.school}}</div>
        <template #tooltip>{{note.school}}</template>
      </VxTooltip>
    </div>


    <!-- Title -->
    <div
      class="w-4/5 text-ginger-b text-3xl p-4 ml-1/2 title-content"
      style="line-height: 1;"
    >{{ note.title }}</div>

    
    <!-- Content -->
    <div class="vx-row w-full justify-center p-4 pt-0 m-0 pt-0" style="margin: 0;">
      <div
        class="md:w-4/5 w-full vx-row justify-center overflow-y-hidden relative rounded-md p-1"
        :style="
          preview ? (hasImage ? 'max-height : 512px' : 'max-height: 200px') : ''"
      >
        <!-- Image? -->
        <img
          :src="note.images[0]"
          class="responsive rounded border-solid mb-4"
          v-if="hasImage && preview"
          style="border-width: 2px; border-color: #ccd6dd;"
        />

        <!-- Vue Flux -->
        <vue-flux
          :options="vfOptions"
          :images="note.images"
          :transitions="vfTransitions"
          class="w-full"
          ref="slider"
          v-if="hasImage && !preview"
        >
          <template v-slot:preloader>
            <flux-preloader />
          </template>

          <template v-slot:caption>
            <flux-caption />
          </template>

          <template v-slot:controls>
            <flux-controls />
          </template>

          <template v-slot:pagination>
            <flux-pagination />
          </template>

          <template v-slot:index>
            <flux-index />
          </template>
        </vue-flux>

        <!-- Actual Content -->
        <div
          v-html="$md.render(note.contents)"
          id="notes-md"
          class="w-full text-ginger p-2 md-container"
        />
        <!-- And as quick as it started, it has finished -->

      </div>
    </div>

    <!-- Footer -->
    <div class="vx-row w-full justify-evenly lg:px-10 p-6">
      <vs-avatar
        class="icon-small"
        :color="userLiked(note.id) ? 'danger' : '#f4f7f8'"
        badge-color="#7d33ff"
        @click.stop="toggleLike(note.id)"
      >
        <i
          class="bx bx-heart primary"
          :style="`color : ${userLiked(note.id) ? 'white' : '#ff4757'}`"
        ></i>
        <template #badge>{{ note.upVotes }}</template>
      </vs-avatar>
      <VxTooltip :interactivity="true">
        <vs-avatar class="icon-small">
          <i class="bx bx-show"></i>
          <template #badge>{{ note.views }}</template>
        </vs-avatar>
        <template #tooltip>{{ note.views }} Views</template>
      </VxTooltip>

      <VxTooltip :interactivity="true">
        <vs-avatar class="icon-small">
          <i class="bx bx-bookmark"></i>
        </vs-avatar>
        <template #tooltip>Bookmark</template>
      </VxTooltip>
    </div>
  </VxCard>
</template>

<script lang="ts">
  // Imports
  import { Component, Vue, Prop } from 'nuxt-property-decorator'
  import { Note } from '~/types/notes'
  import { SubjectIconList, SubjectGroup_O, Subject_O } from '~/types/subjects'
  import { notesStore, authStore } from '~/store'
  import DeleteNotesModal from '~/components/DeleteNotesModal.vue'
  import AvatarBar from '~/components/AvatarBar.vue'

  @Component<NotesCard>({
    components: { DeleteNotesModal, AvatarBar },
    mounted() {
      if (this.note.images && this.note.images.length) {
        this.image = new Image()
        this.image.src = this.note.images[0]
        // this.note.userP
        this.hasImage = true
      }
    }
  })
  
  // OUTPUT
  export default class NotesCard extends Vue {
    @Prop({ required: true }) note!: Note
    @Prop({ default: false }) clickable!: boolean
    // Loaded full content
    @Prop({ default: false }) preview!: boolean
    // Whether buttons should work or not
    @Prop({ default: false }) disabled!: boolean

    deleteNotesOpen = false

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
  #note-card {
    .vs-navbar__group__items {
      min-width: 120px;
      background-color: white;
      .menu-item:hover {
        opacity: 1;
        background-color: initial !important;
      }
      .menu-item {
        opacity: 0.8;
        transition-duration: 0.1s;
        cursor: pointer;
      }
    }
    .icon {
      width: 4rem !important;
      height: 4rem !important;
      max-width: 10vw;
      max-height: 10vw;
    }
    .icon-small {
      width: 3rem !important;
      height: 3rem !important;
      max-width: 8vw;
      max-height: 8vw;
    }
    #profile {
      .vs-navbar__group__items {
        min-width: 0 !important;
        // max-width : 100%;
        width: 150%;
        transform: translate(-25%, 90%);
      }
    }
  }
  .previewClickable {
    :hover {
      background-color: #f5f5f6;
    }
    transition-duration: 100ms !important;
  }
  ::-webkit-scrollbar {
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(90, 90, 90, 0.5);
    border-radius: 15px !important;
  }

  ::-webkit-scrollbar-track {
    background: rgba(90, 90, 90, 0.1);
    border-radius: 15px !important;
  }
  .title-content {
    margin-left: 10%;
  }
  @media only screen and (max-width: 768px) {
    .title-content {
      margin-left: 0%;
    }
  }
  .flux-image {
    background-position: 0px 0px !important;
    background-size: auto 100% !important;
    background-color: black;
    background-position: center !important;
  }
</style>
