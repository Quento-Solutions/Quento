<template>
  <VxCard
    fitContent="true"
    class="mb-8"
    id="note-card"
    :class="clickable ? 'previewClickable' : ''"
    @click="PushQuestionsPage()"
  >
    <!-- Card Header -->
    <AvatarBar
      :username="question.userDisplayName"
      :date="question.createdAt"
      :photoURL="question.userPhotoUrl"
    ></AvatarBar>

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

      <vs-tooltip>
        <vs-avatar class="icon-small">
          <i class="bx bx-comment-check"></i>
          <template #badge>
            {{ question.responses }}
          </template>
        </vs-avatar>
        <template #tooltip> {{ question.responses }} Responses </template>
      </vs-tooltip>
    </div>
  </VxCard>
</template>

<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'

import { Question } from '~/types/questions'
import { SubjectIconList, SubjectGroup_O, Subject_O } from '~/types/subjects'
import { notesStore, authStore, questionStore } from '~/store'

import UserMixin from '~/mixins/UserMixin';
import AvatarBar from '~/components/AvatarBar.vue'


@Component<QuestionCard>({
  components : 
  {
    AvatarBar
  }

})
export default class QuestionCard extends mixins(UserMixin) {
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
    return this.UserData?.likedQuestions?.includes(id);
  }

  async toggleLike() {
    if (!this.question?.id || this.disabled) return
    const loading = this.$vs.loading();
    try 
    {
      await questionStore.ToggleLikedQuestion(this.question.id);
      this.$emit("toggle-like");
    } catch (error)
    {
      this.$vs.notification({
        color : "danger",
        message : error.message
      })
      console.log({error});
    }
    loading.close();
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
