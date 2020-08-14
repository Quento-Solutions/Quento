import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { firestore as FirestoreModule } from 'firebase/app'

import { Question, Question_t_F } from '~/types/questions'
@Module({ stateFactory: true, name: 'questions', namespaced: true })
export default class QuestionsModule extends VuexModule {
  // Modal Logic

  // Global Logic
  IsReset = false

  PostQuestionModalOpen = false
  @Mutation
  public SET_RESET(val: boolean) {
    this.IsReset = val
  }

  // Post Modal
  @Mutation
  public SET_POST_MODAL_OPEN(value: boolean) {
    this.PostQuestionModalOpen = value
  }

  // Preview Modal
  PreviewQuestion: Question | null = null
  PreviewModalOpen = false
  @Mutation
  public SET_PREVIEW_QUESTION(i: Question | null) {
    this.PreviewQuestion = i
    this.PreviewModalOpen = !!i
  }

  @Action({ rawError: true })
  public ResetPosts() {
    this.SET_POST_MODAL_OPEN(false)
    this.SET_PREVIEW_QUESTION(null)
    this.SET_RESET(true)
  }
  // Notes Data Logic
  @Action({ rawError: true })
  public async CreateQuestion(question: Question) {
    await firestore.collection('questions').add(Question.toFirebase(question))
    return
  }

  @Action({ rawError: true })
  public async GetQuestion(id: string) {
    const questionDoc = await firestore.collection('questions').doc(id).get()
    const questionData = questionDoc.data() as Question_t_F
    const question = Question.fromFirebase(questionData)
    return question
  }
}
