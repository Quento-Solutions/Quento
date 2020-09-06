<template>
  <div
    class="vx-row w-full relative justify-evenly"
    :class="[{ 'show-overlay': bodyOverlay }]"
    id="notes-screen-container"
    v-if="group"
  >
    <div id="notes-content-overlay"></div>
    <!-- <FilterSidebar
      :sort.sync="sort"
      :subjects.sync="subjects"
      :school.sync="school"
      :grade.sync="grade"
      @filter="filter()"
    >
      <vs-button warn @click="questionModalActive = true" class="w-full">
        <i class="bx bxs-plus-square text-4xl" />
        <div class="text-2xl font-ginger-b">&nbsp; Ask A Question</div>
      </vs-button>
    </FilterSidebar>
    <div class="sidebar-spacer"></div>
    <div class="vx-col lg:w-1/2 md:w-2/3 w-full">
      <div class="vx-col w-full inline-flex lg:hidden" style>
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="openFilterSidebar()">
            <i class="bx bx-menu" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
    </div>-->
    <div class="vx-row mb-4 w-full bg-white rounded-md p-2 justify-start">
      <vs-avatar class="icon-small float-left" @click="goBack()">
        <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
      </vs-avatar>
      <div class="text-4xl font-bold pl-4">{{group.title}}'s Questions</div>
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
      <template #title>No Questions Found For This Search</template>
      <b>Sorry!</b> Something went wrong when fetching the Question. Please Try
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

@Component<groupQuestions>({
  components: {QuestionCard, FilterSidebar},
  async mounted() {
    this.fetchQuestions()
    this.fetchGroup()
    const loading = this.$vs.loading()
    await questionStore.GetMoreQuestions()
    this.loaded = true
    loading.close()
  }
})
export default class groupQuestions extends mixins(LoadScrollMixin, UserMixin) {
  groupQuestion: Question[] = []
  question: Question | null = null
  questionId: string | null = null
  groupId: string | null = null
  docNotFound = false
  group: Group | null = null
  sort: typeof questionStore.SortSelect = 'createdAt'
  subjects: Subject_O[] = []
  grade: Grade_O = 'ALL'
  school: School_O | 'All Schools' = 'All Schools'

  @Watch('IsScrolledDown')
  PageHeightChange(val: boolean, oldVal: boolean) {
    if (val && this.loaded) {
      this.LoadMoreQuestions()
    }
  }
  get memberOfGroup() {
    return (
      this.group &&
      this.AuthUser?.uid &&
      this.group.memberList.includes(this.AuthUser.uid)
    )
  }
  async fetchQuestions() {
    const loading = this.$vs.loading()
    this.questionId = this.$route.params.id
    if (!this.questionId) {
      this.$router.push('/groups')
      return
    }
    try {
      const doc = await firestore
        .collection('questions')
        .where('questionId', '==', this.questionId)
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
  async filter() {
    const loading = this.$vs.loading()
    try {
      questionStore.SET_FILTER({
        sortSelect: this.sort,
        filterSubjects: this.subjects,
        filterGrades: this.grade,
        filterSchools: this.school
      })
      await questionStore.GetMoreQuestions()
    } catch (error) {
      this.$vs.notification({
        title: error.message,
        color: 'danger'
      })
      console.error(error)
    }

    loading.close()
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
      const doc = await firestore.doc(`groups/${this.groupId}`).get()
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
  async GenerateJoinToken() {
    const groupId = this.groupId
    if (
      !groupId ||
      this.docNotFound ||
      !this.group ||
      !this.group.approved ||
      !this.memberOfGroup
    )
      return
    const loading = this.$vs.loading()
    const res = await functions.httpsCallable('GenerateJoinToken')({groupId})
    if (res.data.status !== 200) {
      this.$vs.notification({
        title: res.data.message,
        color: 'danger'
      })
      console.log({res})
    } else {
      this.fetchGroup()
    }
    loading.close()
  }
  goBack() {
    this.$router.push('/groups/g/' + this.groupId)
  }

  get noItemsFound() {
    return questionStore.EndOfList && this.questionList.length == 0
  }
  async LoadMoreQuestions() {
    const loading = this.$vs.loading()
    await questionStore.GetMoreQuestions()
    loading.close()
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
