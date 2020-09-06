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
        style="background-color: #9f7aea">
        <i
          class="bx text-xl text-white"
          :class="getIcon(question.subject)"
          style="background-color:transparent;"
        /></div>
      <div
        class="rounded-full  w-10 h-10 ml-2 vx-row items-center justify-center font-ginger-b text-white bottom-icon" 
        style="background-color: #ed8936;"
      >{{ question.grade }}</div>

      </div>
<div class="w-2/5 vx-row list-title" style="overflow: hidden;white-space: nowrap;">

      <div
      class="text-ginger text-xl ml-4 text-gray-600"
    >{{ question.title }}</div>

</div>

<div class="w-1/6 vx-row list-date" style="overflow: hidden;white-space: nowrap;">
    <div
      class="text-ginger text-xl ml-4 text-gray-600"
    >{{ question.createdAt.toDateString().slice(4, 10) + ',' + question.createdAt.toDateString().slice(10) }}</div>

</div>

<div class="w-1/6 vx-row list-name" style="overflow: hidden;white-space: nowrap;">
    <div
      class="text-ginger text-xl ml-4 text-gray-600"
    >{{ question.userDisplayName }}</div>
</div>

 <div class="w-1/6 vx-row justify-between pl-4 list-buttons"> 
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
        <template #badge>{{ question.upVotes }}</template>
      </vs-avatar>
      <VxTooltip :interactivity="true">
        <vs-avatar class="icon-small bottom-icon">
          <i class="bx bx-show"></i>
          <template #badge>{{ question.views }}</template>
        </vs-avatar>
        <template #tooltip>{{ question.views }} Views</template>
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
    @click="PushQuestionsPage()"
  >
  <template slot="no-body">
    <!-- Card Header -->
     <div class="p-6">
    <AvatarBar
      :username="question.userDisplayName"
      :date="question.createdAt"
      :photoURL="question.userPhotoUrl"
      :userId="question.userId"
    ></AvatarBar>
    <!-- Category Pills -->
        <div class="inner-content" :style="preview? '':'width:70%;margin-left:15%'">

    <div
      class="w-4/5 vx-row p-2 items-start md:items-center md:text-sm text-xs mt-2 flex-row"
    >
      <div
        class="rounded-full bg-orange-500 md:p-2 md:px-4 p-2 px-4 vx-row items-center text-ginger text-white" 
        style="background-color: #ed8936 padding-top:0.6rem;padding-bottom:0.6rem;"
      >Grade {{ question.grade }}</div>
      <div
        class="rounded-full bg-purple-500 md:p-2 md:px-4 p-2 px-4 vx-row items-center text-ginger text-white mt-0 mx-2"
        style="background-color: #9f7aea"
      >
        <i
          class="bx text-xl text-white mr-2"
          :class="getIcon(question.subject)"
          style="background-color:transparent;"
        />
        {{ question.subject }}
      </div>
      <VxTooltip v-if="question.school">
        <div
          class="rounded-full p-2 px-4 cursor-pointer vx-row items-center text-ginger text-white truncate"
          style="background-color: #6398de; max-width : 150px"
        >{{question.school}}</div>
        <template #tooltip>{{question.school}}</template>
      </VxTooltip>
    </div>

    <!-- Title -->
    <div
      class="w-4/5 text-ginger-b text-3xl p-4 ml-1/2 pl-2"
      style="line-height: 1.3;"
    >{{ question.title }}</div>
    <!-- Content -->
<div class="vx-row w-full justify-start p-4 pt-0 m-0 pt-0 pl-0" style="margin: 0;">
        <div
       class="md:w-full w-full vx-row justify-center overflow-y-hidden relative rounded-md p-1 pb-0"
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

    <div class="vx-row md:w-1/2 w-2/3 justify-between lg:px-10 p-6" style="padding-left:1rem;padding-top:0;" :style="preview? '':'width:80%;margin-left:10%'">
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
        <template #badge>{{ question.upVotes }}</template>
      </vs-avatar>
      <VxTooltip>
        <vs-avatar class="icon-small">
          <i class="bx bx-show"></i>
          <template #badge>{{ question.views }}</template>
        </vs-avatar>
        <template #tooltip>{{ question.views }} Views</template>
      </VxTooltip>

      <VxTooltip>
        <vs-avatar class="icon-small">
          <i class="bx bx-comment-check"></i>
          <template #badge>{{ question.responses }}</template>
        </vs-avatar>
        <template #tooltip>{{ question.responses }} Responses</template>
      </VxTooltip>
    </div>
      </div>
     </div>
     </template>
  </VxCard>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'

import { Question } from '~/types/questions'
import { SubjectIconList, SubjectGroup_O, Subject_O } from '~/types/subjects'
import { notesStore, authStore, questionStore } from '~/store'

import UserMixin from '~/mixins/UserMixin'
import AvatarBar from '~/components/AvatarBar.vue'

@Component<QuestionCard>({
  components: {
    AvatarBar
  }
})
export default class QuestionCard extends mixins(UserMixin) {
  @Prop({ required: true }) question!: Question
  @Prop({ default: false }) clickable!: boolean
  // Loaded full content
  @Prop({ default: false }) preview!: boolean
  @Prop({ default: false }) listView!: boolean

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
    return this.UserData?.likedQuestions?.includes(id)
  }

  async toggleLike() {
    if (!this.question?.id || this.disabled) return
    const loading = this.$vs.loading()
    try {
      await questionStore.ToggleLikedQuestion(this.question.id)
      this.$emit('toggle-like')
    } catch (error) {
      this.$vs.notification({
        color: 'danger',
        message: error.message
      })
      console.log({ error })
    }
    loading.close()
  }

  vfOptions = {
    autoplay: false,
    allowFullscreen: true
  }
  vfTransitions = ['swipe']
  PushQuestionsPage() {
    if (this.clickable)
      return this.$router.push(`/questions/${this.question.id}`)
  }
  hasImage = false
  image?: HTMLImageElement
}
</script>

<style scoped>

@media only screen and (max-width: 1670px) {
  .list-icons {
    width:15%;
  }
  .list-title{
    width:40%;
  }
  .list-date{
    display: none;
  }
  .list-buttons{
    width:20%;
  }
}

@media only screen and (max-width: 1300px) {
  .list-name{
    display:none;
  }
  .list-title{
    width:50%;
  }
  .list-buttons{
    width:30%;
  }
}

@media only screen and (max-width: 650px) {
  .list-icons {
    width:20%;
  }
  .list-title{
    width:40%;
  }
  .list-title div {
    font-size: 0.9rem !important;
    white-space: pre-wrap;
  }
  .list-buttons{
    width:40%;
  }
}

@media only screen and (max-width: 480px) {
  .list-icons {
    flex-direction:column;
    width:15%;
  }
  .list-title{
    width:60%;
  }
  .list-title div {
    font-size: 1rem !important;
  }
  .list-buttons{
    flex-direction:column;
    width: 15%;
  }
  .bottom-icon {
    margin-top: 1rem;
  }
}
</style>
