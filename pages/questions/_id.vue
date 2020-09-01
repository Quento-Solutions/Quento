<template>
  <div class="vx-row w-full justify-center" style>
    <div class="vx-row w-full md:w-2/3 p-4" style>
      <div class="vx-col w-full display-none md:inline-flex" style>
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
      </div>
      <div v-if="question" class="w-full">
        <QuestionCard :question="question" v-on:toggle-like="RefreshLikes()"></QuestionCard>
        <VxCard class="w-full mb-6" title="Post An Answer" collapseAction="true">
          <div class="vx-row w-full" style>
            <VsTextarea
              placeholder="Leave a response..."
              v-model="responseContent"
              class="w-full"
              height="10rem"
            ></VsTextarea>
            <div class="vx-row w-full justify-end p-0" style="padding: 0;">
              <vs-button class="float-right" color="danger" size="large">Cancel</vs-button>
              <vs-button
                class="float-right"
                color="success"
                size="large"
                :disabled="!responseContent"
                @click="PostResponse()"
              >Post</vs-button>
            </div>
          </div>
        </VxCard>

        <VxCard class="w-full" :fitContent="true" title="Responses">
          <div class="vx-row w-full" style>
            <ResponseCard
              v-for="(response, index) in ResponseList"
              :key="index"
              :response="response"
            ></ResponseCard>
          </div>
        </VxCard>
      </div>

      <vs-alert color="danger" v-if="docNotFound">
        <template #title>Something Went Wrong</template>
        <b>Sorry!</b> Something went wrong when fetching the Note. Please Try
        Again.
      </vs-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, mixins, Watch } from 'nuxt-property-decorator'
import { Question, Question_t_F } from '~/types/questions'
import { Response } from '~/types/responses'
import UserMixin from '~/mixins/UserMixin'
import { questionStore } from '~/store'
import QuestionCard from '~/components/QuestionCard.vue'
import ResponseCard from '~/components/ResponseCard.vue'

@Component<QuestionContentPage>({
  components: { QuestionCard, ResponseCard },
  mounted() {
    this.FetchQuestion()
  }
})
export default class QuestionContentPage extends mixins(UserMixin) {
  question: Question | null = null
  questionId: string | null = null
  docNotFound = false
  responseContent = ''
    get QuestionId()
  {
    return this.$route.params.id;
  }
  @Watch("QuestionId")
  QuestionIdChange(value : string, oldValue : string)
  {
    // This is to update the page when going from notes/note1 -> notes/note2
    this.FetchQuestion();
  }
  ResponseList: Response[] = []
  RefreshLikes() {
    if (!this.question) return
    if (this.UserData?.likedQuestions?.includes(this.questionId || '')) {
      this.question.upVotes++
    } else {
      this.question.upVotes--
    }
  }
  clone(a: any) {
    return Object.assign({}, a)
  }
  async FetchQuestion() {
    const loading = this.$vs.loading()
    this.questionId = this.$route.params.id
    if (!this.questionId) {
      this.$router.push('/questions')
      return
    }
    try {
      await questionStore.GetQuestion(this.questionId)
      questionStore.IncrementView(this.questionId)

      this.question = Object.assign({}, questionStore.ActiveQuestion)
      this.ResponseList = questionStore.ActiveResponses.map((a) =>
        Object.assign({}, a)
      )
      loading.close()
      return
    } catch (error) {
      if (!questionStore.ActiveQuestion) {
        this.docNotFound = true
        loading.close()
        return
      }
      console.log({ error })
      loading.close()
    }
  }

  async PostResponse() {
    if (!this.questionId) return
    const loading = this.$vs.loading()
    try {
      await questionStore.PostResponse({
        contents: this.responseContent,
        questionId: this.questionId
      })
      await this.FetchQuestion()
      this.$vs.notification({
        color: 'success',
        title: 'Answer Posted!'
      })
      this.responseContent = ''
    } catch (error) {
      this.$vs.notification({ title: error.message, color: 'danger' })
    }
    loading.close()
    this.$forceUpdate()
  }
  goBack() {
    this.$router.push('/questions')
  }
}
</script>
