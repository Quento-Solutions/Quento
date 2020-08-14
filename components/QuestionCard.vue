<template>
  <VxCard
    fitContent="true"
    class="mb-8"
    id="note-card"
    :class="clickable ? 'previewClickable' : ''"
    @click="PushQuestionsPage()"
  >
    <!-- Card Header -->
    <div class="vx-row w-full justify-between items-center">
      <!-- Profile Picture -->
      <div class="justify-start w-5/6 m-0">
        <div class="vx-row w-full justify-start items-center">
          <div class="vx-col">
            <vs-tooltip class="inline-block">
              <vs-avatar class="icon">
                <img v-if="question.userPhotoUrl" :src="question.userPhotoUrl" />
                <template #text v-else>
                  {{ question.userDisplayName }}
                </template>
              </vs-avatar>
              <template #tooltip>
                {{ question.userDisplayName }}
              </template>
            </vs-tooltip>
          </div>
          <div class="vx-col">
            <!-- User name -->
            <div class="text-xl text-ginger-b">
              <div class="">
                {{ question.userDisplayName }}
              </div>
            </div>
            <div class="">
              <div class="">
                {{ question.createdAt.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div>
        <vs-navbar-group id="menu-dots" @click.stop.prevent="() => false">
          <vs-avatar
            class="profileIcon icon"
            :badge="QuestionOwner"
            badge-color="success"
            @click.stop.prevent="() => false"
          >
            <i class="bx bx-dots-horizontal" style="font-size: 1.25rem;" />
          </vs-avatar>
          <template #items v-if="!disabled">
            <div
              @click.stop.prevent="OpenEditingModal()"
              v-if="QuestionOwner"
              class="w-full px-2 py-1 menu-item rounded-md"
            >
              <i class="bx bx-edit" style="font-size: 1.25rem;" />
              Edit
            </div>
            <div
              @click.stop.prevent="PushQuestionsPage()"
              class="w-full px-2 py-1 menu-item rounded-md"
            >
              Details
            </div>
          </template>
        </vs-navbar-group>
      </div>
    </div>

    <!-- Category Pills -->
    <div
      class="w-4/5 vx-row p-2 items-center text-sm mt-2 ml-1/2 title-content"
    >
      <div
        class="rounded-full bg-orange-500 p-2 px-4 vx-row items-center text-ginger text-white"
      >
        Grade {{ question.grade }}
      </div>
      <div
        class="rounded-full bg-purple-500 p-2 px-4 vx-row items-center text-ginger text-white mx-2"
      >
        <i class="bx text-xl text-white mr-2" :class="getIcon(question.subject)" />
        {{ question.subject }}
      </div>
    </div>

    <!-- Title -->
    <div
      class="w-4/5 text-ginger-b text-3xl p-4 ml-1/2 title-content"
      style="line-height: 1;"
    >
      {{ question.title }}
    </div>

    <!-- Content -->
    <div
      class="vx-row w-full justify-center p-4 pt-0 m-0 pt-0"
      style="margin: 0;"
    >
      <div
        class="md:w-4/5 w-full vx-row justify-center overflow-y-hidden relative rounded-md p-1"
        :style="
          preview ? 'max-height: 200px' : ''"
      >

        <div
          v-html="$md.render(question.contents)"
          id="notes-md"
          class="w-full text-ginger p-2 md-container"
        ></div>
        <!-- <div
          style="
            width: 100%;
            height: 100%;
            position: absolute;
            background-image: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0) 80%,
              white 90%
            );
          "
        ></div> -->
      </div>
    </div>

    <div class="vx-row w-full"></div>

    <!-- Footer -->

    <div class="vx-row w-full justify-evenly lg:px-10 p-6">
      <vs-avatar
        class="icon-small"
        :color="userLiked(question.id) ? 'danger' : '#f4f7f8'"
        badge-color="#7d33ff"
        @click.stop="toggleLike(question.id)"
      >
        <i
          class="bx bx-heart primary"
          :style="`color : ${userLiked(question.id) ? 'white' : '#ff4757'}`"
        ></i>
        <template #badge>
          {{ question.upVotes }}
        </template>
      </vs-avatar>
      <vs-tooltip>
        <vs-avatar class="icon-small">
          <i class="bx bx-show"></i>
          <template #badge>
            {{ question.views }}
          </template>
        </vs-avatar>
        <template #tooltip> {{ question.views }} Views </template>
      </vs-tooltip>

      <vs-avatar class="icon-small">
        <i class="bx bx-bookmark"></i>
      </vs-avatar>
    </div>
  </VxCard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Question } from '~/types/questions'
import { SubjectIconList, SubjectGroup_O, Subject_O } from '~/types/subjects'
import { notesStore, authStore } from '~/store'

@Component<NotesCard>({
  // components :

})
export default class NotesCard extends Vue {
  @Prop({ required: true }) question!: Question
  @Prop({ default: false }) clickable!: boolean
  // Loaded full content
  @Prop({ default: false }) preview!: boolean
  // Whether buttons should work or not
  @Prop({ default: false }) disabled!: boolean

  get QuestionOwner() {
    return authStore.user?.uid == this.question.userId
  }
  OpenEditingModal() {
    // notesStore.SetEditNote(this.note)
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
  PushQuestionsPage() {
    if (this.clickable) return this.$router.push(`/questions/${this.question.id}`)
  }
  hasImage = false
  image?: HTMLImageElement
}
</script>
<style lang="scss">

</style>
