<template>
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="notes-screen-container"
    v-if="group"
  >
    <PostQuestionModal :presetGroup="group"></PostQuestionModal>
    <PreviewQuestionModal></PreviewQuestionModal>

    <div class="vx-row mb-4 w-full bg-white rounded-md p-2 justify-between">
      <div class="text-4xl font-bold pl-4">{{group.title}}'s Questions</div>
      <vs-button warn @click="questionModalActive = true">
        <i class="bx bxs-plus-square text-4xl" />
        <div class="text-2xl font-ginger-b">&nbsp; Post New Question</div>
      </vs-button>
    </div>
    <QuestionCard
      v-for="(question, index) in groupQuestions"
      :key="index"
      class
      :question="question"
      :clickable="true"
      :preview="true"
    />
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, mixins, Watch} from 'nuxt-property-decorator'

import {Question, Question_t_F} from '~/types/questions'
import {Group, Group_t_F} from '~/types/groups'
import firestore from '~/plugins/firestore'

import {windowStore, questionStore} from '~/store'
import QuestionCard from '~/components/QuestionCard.vue'
import {Subject_O, Grade_O} from '~/types/subjects'
import {School_O} from '~/types/schools'
import LoadScrollMixin from '~/mixins/LoadScrollMixin'
import UserMixin from '~/mixins/UserMixin'
import PreviewQuestionModal from '~/screens/questions/PreviewQuestionModal.vue'
import PostQuestionModal from '~/screens/questions/PostQuestionModal.vue'

@Component<groupQuestions>({
  components: {
    QuestionCard,
    PostQuestionModal,
    PreviewQuestionModal
  },
  async mounted() {
    if(!this.memberOfGroup) return this.$router.push(`/groups/g/${this.groupId}`);
    const loading = this.$vs.loading({
      type: 'circles',
      text: 'Loading Data'
    })
    try {
      await this.fetchQuestions()
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
export default class groupQuestions extends mixins(LoadScrollMixin, UserMixin) {
  groupQuestions: Question[] = []
  endOfList = false
  @Prop({required: true}) group!: Group
  @Prop({required: true, type: Array}) members!: any[]
  @Prop({required: true, type: String}) groupId!: string

  get IsReset() {
    return questionStore.IsReset
  }

  @Watch('IsReset')
  notePosted(val: boolean, oldVal: boolean) {
    if (val) {
      this.fetchQuestions()
    }
  }

  get memberOfGroup() {
    return (
      this.group &&
      this.AuthUser?.uid &&
      this.group.memberList.includes(this.AuthUser.uid)
    )
  }

  @Watch('IsReset')
  onResetChanged(value: boolean, oldVal: boolean) {
    if (value) {
      this.fetchQuestions()
    }
  }

  async fetchQuestions() {
    const loading = this.$vs.loading()
    this.groupId = this.$route.params.id
    if (!this.groupId) {
      this.$router.push('/groups')
      return
    }
    try {
      const doc = await firestore
        .collection('questions')
        .where('groupId', '==', this.groupId)
        .orderBy('magicRank', 'desc')
        .get()
      this.groupQuestions = doc.docs.map((document) =>
        Question.fromFirebase(document.data() as Question_t_F, document.id)
      )
      loading.close()
      return
    } catch (error) {
      console.log({error})
      loading.close()
    }
  }

  goBack() {
    this.$router.push('/groups/g/' + this.groupId)
  }

  get noItemsFound() {
    return this.endOfList && this.groupQuestions.length === 0
  }

  get previewModalActive() {
    return questionStore.PreviewModalOpen
  }

  get questionModalActive() {
    return questionStore.PostQuestionModalOpen
  }

  set questionModalActive(value: boolean) {
    questionStore.SET_POST_MODAL_OPEN(value)
  }
}
</script>

<style lang="scss">
</style>
