<template>
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="notes-screen-container"
    v-if="group"
  >
    <div id="notes-content-overlay"></div>
    <PostQuestionModal :presetGroup="group"></PostQuestionModal>
    <PreviewQuestionModal></PreviewQuestionModal>

    <div class="vx-row mb-4 w-full bg-white rounded-md p-2 justify-between">
      <vs-avatar class="icon-small float-left" @click="goBack()">
        <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
      </vs-avatar>
      <div class="text-4xl font-bold pl-4">{{group.title}}'s Questions</div>
      <vs-button warn @click="questionModalActive = true">
        <i class="bx bxs-plus-square text-4xl" />
        <div class="text-2xl font-ginger-b">&nbsp; Post New Question</div>
      </vs-button>
    </div>
    <QuestionCard
      v-for="(question, index) in groupQuestion"
      :key="index"
      class
      :question="question"
      :clickable="true"
      :preview="true"
    />
    <vs-alert color="danger" v-if="noItemsFound">
      <template #title>Group Not Found</template>
      <b>Sorry!</b> Something went wrong when fetching the Group. Please Try
      Again.
    </vs-alert>
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, mixins, Watch} from 'nuxt-property-decorator'

import {Question, Question_t_F} from '~/types/questions'
import {Note} from '~/types/notes'
import {Group, Group_t_F} from '~/types/groups'
import firestore from '~/plugins/firestore'

import {windowStore, questionStore} from '~/store'
import FilterSidebar from '~/components/FilterSidebar.vue'
import QuestionCard from '~/components/QuestionCard.vue'
import {Subject_O, Grade_O} from '~/types/subjects'
import {School_O} from '~/types/schools'
import LoadScrollMixin from '~/mixins/LoadScrollMixin'
import UserMixin from '~/mixins/UserMixin'
import functions from '~/plugins/firebaseFunctions'
import PreviewQuestionModal from '~/screens/questions/PreviewQuestionModal.vue'
import PostQuestionModal from '~/screens/questions/PostQuestionModal.vue'

@Component<groupQuestions>({
  components: {
    QuestionCard,
    FilterSidebar,
    PostQuestionModal,
    PreviewQuestionModal
  },
  async mounted() {
    const loading = this.$vs.loading()
    this.fetchQuestions()
    this.fetchGroup()
    loading.close()
  }
})
export default class groupQuestions extends mixins(LoadScrollMixin, UserMixin) {
  groupQuestion: Question[] = []
  groupId: string | null = null
  docNotFound = false
  group: Group | null = null

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
      this.groupQuestion = doc.docs.map((document) =>
        Question.fromFirebase(document.data() as Question_t_F, document.id)
      )
      loading.close()
      return
    } catch (error) {
      console.log({error})
      loading.close()
    }
  }

  async fetchGroup() {
    //   this.group!.bac
    const loading = this.$vs.loading()
    this.groupId = this.$route.params.id
    if (!this.groupId) {
      this.$router.push('/groups')
      return
    }
    try {
      const doc = await firestore.collection('groups').doc(this.groupId).get()
      const groupData = doc.data() as Group_t_F
      if (!groupData) {
        this.docNotFound = true
        loading.close()
        return
      }
      this.group = Group.fromFirebase(groupData, doc.id)
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
    return questionStore.EndOfList && this.questionList.length == 0
  }

  get endOfList() {
    return questionStore.EndOfList
  }
  get bodyOverlay() {
    return windowStore.filterSidebarOpen && windowStore.isSmallScreen
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
  openFilterSidebar() {
    windowStore.SetFilterSidebar(true)
  }

  get questionList() {
    return questionStore.ActiveItems
  }
}
</script>

<style lang="scss">
</style>
