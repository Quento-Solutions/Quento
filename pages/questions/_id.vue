<template>
  <div class="vx-row w-full justify-center" style="">
    <div class="vx-row w-full md:w-2/3 p-4" style="">
      <div class="vx-col w-full display-none md:inline-flex" style="">
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
      </div>
      <QuestionCard :question="question" v-if="question"> </QuestionCard>
      <vs-alert color="danger" v-if="docNotFound">
        <template #title>
          Something Went Wrong
        </template>
        <b>Sorry!</b> Something went wrong when fetching the Note. Please Try
        Again.
      </vs-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Question, Question_t_F } from '~/types/questions'
import { questionStore } from '~/store'
import QuestionCard from '~/components/QuestionCard.vue'

@Component<QuestionContentPage>({
  components: { QuestionCard },
  mounted() {
    this.FetchQuestion()
  }
})
export default class QuestionContentPage extends Vue {
  question: Question | null = null
  questionId: string | null = null
  docNotFound = false

  async FetchQuestion() {
    const loading = this.$vs.loading()
    this.questionId = this.$route.params.id
    if (!this.questionId) {
      this.$router.push('/questions')
      return
    }
    try {
      this.question = await questionStore.GetQuestion(this.questionId)
      loading.close()
      return
    } catch (error) {
      console.log({ error })
      loading.close()
    }
  }
  goBack() {
    this.$router.push('/questions')
  }
}
</script>
