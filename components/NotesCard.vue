<template>
  <div class="w-full">
    <VxCard
      v-if="listView && preview"
      fitContent="true"
      class="mb-8"
      id="note-card"
      :class="clickable ? 'previewClickable' : ''"
      @click="PushNotesPage()"
    >
      <template slot="no-body">
        <div class="card-content" :style="preview? 'cursor: pointer;':''">
          <div class="w-full vx-row p-2 justify-start items-center text-sm flex-row my-2">
            <div class="w-1/12 vx-row list-icons">
              <div
                class="rounded-full w-10 h-10 ml-2 vx-row items-center justify-center"
                style="background-color: #9f7aea"
              >
                <i
                  class="bx text-xl text-white"
                  :class="getIcon(note.subject)"
                  style="background-color:transparent;"
                />
              </div>
              <div
                class="rounded-full w-10 h-10 ml-2 vx-row items-center justify-center font-ginger-b text-white bottom-icon"
                style="background-color: #ed8936;"
              >{{ note.grade }}</div>
            </div>
            <div class="w-2/5 vx-row list-title" style="overflow: hidden;white-space: nowrap;">
              <div class="text-ginger text-xl ml-4 text-gray-600">{{ note.title }}</div>
            </div>

            <div class="w-1/6 vx-row list-date" style="overflow: hidden;white-space: nowrap;">
              <div
                class="text-ginger text-xl ml-4 text-gray-600"
              >{{ note.createdAt.toDateString().slice(4, 10) + ',' + note.createdAt.toDateString().slice(10) }}</div>
            </div>

            <div class="w-1/6 vx-row list-name" style="overflow: hidden;white-space: nowrap;">
              <div class="text-ginger text-xl ml-4 text-gray-600">{{ note.userDisplayName }}</div>
            </div>

            <div class="w-1/6 vx-row justify-between pl-4 list-buttons">
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
                <vs-avatar class="icon-small bottom-icon">
                  <i class="bx bx-show"></i>
                  <template #badge>{{ note.views }}</template>
                </vs-avatar>
                <template #tooltip>{{ note.views }} Views</template>
              </VxTooltip>

              <VxTooltip :interactivity="true">
                <vs-avatar class="icon-small bottom-icon">
                  <i class="bx bx-bookmark"></i>
                </vs-avatar>
                <template #tooltip>Bookmark</template>
              </VxTooltip>
            </div>
          </div>
        </div>
      </template>
    </VxCard>

    <VxCard
      v-if="!listView || !preview"
      fitContent="true"
      class="mb-8"
      id="note-card"
      :class="clickable ? 'previewClickable' : ''"
      @click="PushNotesPage()"
    >
      <template slot="no-body">
        <div class="card-content" :style="preview? 'cursor: pointer;':''">
          <div class="px-2 md:px-4 py-4 text-container" :style="preview ? '' : 'width:100%'">
            <DeleteNotesModal
              v-if="!disabled && NoteOwner"
              :open.sync="deleteNotesOpen"
              :noteId="note.id"
            ></DeleteNotesModal>

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

            <div class="inner-content" :style="preview? '':'width:70%;margin-left:15%'">
              <!-- Category Pills -->
              <CategoryPills :grade="note.grade" :school="note.school" :subject="note.subject"></CategoryPills>

              <!-- Title -->
              <div
                class="w-4/5 text-ginger-b text-3xl p-4 ml-1/2 pl-2"
                style="line-height: 1.3;"
              >{{ note.title }}</div>

              <!-- Content -->
              <div class="vx-row w-full justify-start p-4 pt-0 m-0 pt-0 pl-0" style="margin: 0;">
                <div
                  class="md:w-full w-full vx-row justify-center overflow-y-hidden relative rounded-md p-1 pb-0"
                  :class="preview? 'content-max-height':''"
                >
                  <vue-flux
                    :options="vfOptions"
                    :images="coverImages"
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
              <div
                class="vx-row md:w-1/2 w-2/3 justify-between lg:px-10 p-6"
                style="padding-left:1rem;padding-top:0;"
                :style="preview? '':'width:80%;margin-left:10%'"
              >
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
            </div>
          </div>
          <div
            class="image-container"
            :style="preview ? '' : 'display:none;'"
            :class="preview && !hasImage?'default-image':''"
          >
            <img
              :src="coverImages[0]"
              v-if="hasImage && preview"
              style="position:absolute;object-fit: cover;min-height:100%"
            />
            <img
              src="../assets/images/Quento_Notes_Filler.png"
              v-if="!hasImage && preview"
              style="position:absolute;object-fit: cover;min-height:100%"
            />
          </div>
        </div>
      </template>
    </VxCard>
  </div>
</template>

<script lang="ts">
// Imports
import {Component, Vue, Prop} from 'nuxt-property-decorator'
import {Note} from '~/types/notes'
import {SubjectIconList, SubjectGroup_O, Subject_O} from '~/types/subjects'
import {notesStore, authStore} from '~/store'
import DeleteNotesModal from '~/components/DeleteNotesModal.vue'
import AvatarBar from '~/components/AvatarBar.vue'
import CategoryPills from '~/components/CategoryPills.vue'

@Component<NotesCard>({
  components: {DeleteNotesModal, AvatarBar, CategoryPills},
  mounted() {
    if (this.note.coverImages && this.note.coverImages.length) {
      this.image = new Image()
      this.image.src = this.note.coverImages[0]?.imageURL
      // this.note.userP
      this.hasImage = true
    }
  }
})

// OUTPUT
export default class NotesCard extends Vue {
  @Prop({required: true}) note!: Note
  @Prop({default: false}) clickable!: boolean
  // Loaded full content
  @Prop({default: false}) preview!: boolean
  @Prop({default: false}) listView!: boolean
  // Whether buttons should work or not
  @Prop({default: false}) disabled!: boolean

  deleteNotesOpen = false

  get coverImages() {
    return this.note.coverImages?.map((img) => img?.imageURL) || []
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
    return notesStore.likedPosts?.includes(id)
  }

  async toggleLike(id: string, time?: any) {
    if (this.disabled) return
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

<style>
.vs-navbar__group__items {
  background: white !important;
}
</style>

<style lang="scss" scoped>
.content-max-height {
  max-height: 150px;
}
.card-content {
  flex-direction: row;
  display: flex;
  padding: 0 !important;
}

.text-container {
  width: 66%;
}

.image-container {
  width: 34%;
  background: white;
  position: relative;
  overflow: hidden;
}

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

@media only screen and (max-width: 1670px) {
  .list-icons {
    width: 15%;
  }
  .list-title {
    width: 40%;
  }
  .list-date {
    display: none;
  }
  .list-buttons {
    width: 20%;
  }
}

@media only screen and (max-width: 1300px) {
  .list-name {
    display: none;
  }
  .list-title {
    width: 50%;
  }
  .list-buttons {
    width: 30%;
  }
}

@media only screen and (max-width: 650px) {
  .list-icons {
    width: 20%;
  }
  .list-title {
    width: 40%;
  }
  .list-title div {
    font-size: 0.9rem !important;
    white-space: pre-wrap;
  }
  .list-buttons {
    width: 40%;
  }
}

@media only screen and (max-width: 480px) {
  .list-icons {
    flex-direction: column;
    width: 15%;
  }
  .list-title {
    width: 60%;
  }
  .list-title div {
    font-size: 1rem !important;
  }
  .list-buttons {
    flex-direction: column;
    width: 15%;
  }
  .bottom-icon {
    margin-top: 1rem;
  }
}

@media only screen and (max-width: 1024px) {
  .content-max-height {
    max-height: 100px !important;
  }
  .default-image {
    display: none !important;
  }
  .card-content {
    flex-direction: column-reverse;
  }
  .inner-content {
    width: 100% !important;
    margin: 0 !important;
  }
  .text-container {
    width: 100%;
  }

  .image-container {
    width: 100%;
    height: 250px;
  }
  .image-container img {
    width: 100% !important;
    height: auto !important;
  }
}
.flux-image {
  background-position: 0px 0px !important;
  background-size: auto 100% !important;
  background-color: black;
  background-position: center !important;
}
</style>