import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { firestore as FirestoreModule } from 'firebase/app'

import { Question, Question_t_F } from '~/types/questions'
import { Response, Response_t_F } from '~/types/responses'

import { authStore } from '~/store'
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
  // Question Data Logic
  @Action({ rawError: true })
  public async CreateQuestion(question: Question) {
    await firestore.collection('questions').add(Question.toFirebase(question))
    return
  }

  ActiveQuestion: Question | null = null
  ActiveResponses: Response[] = []
  @Mutation
  private SET_ACTIVE_QUESTION_DATA({
    question,
    responses
  }: {
    question: Question
    responses: Response[]
  }) {
    this.ActiveQuestion = question
    this.ActiveResponses = responses
  }

  @Action({ rawError: true })
  public async PostResponse({
    contents,
    questionId
  }: {
    contents: string
    questionId: string
  }) {
    if (!authStore.user) return
    const response = new Response({
      contents,
      questionId,
      createdAt: new Date(),
      upVotes: 0,
      userDisplayName: authStore.user?.displayName!,
      userId: authStore.user?.uid!,
      userPhotoUrl: authStore.user?.photoURL!,
      views: 0
    });
    return await firestore.collection('questions').doc(questionId).collection("responses").add(Response.toFirebase(response));
  }

  @Action({ rawError: true })
  public async GetQuestion(id: string) {
    const questionDoc = await firestore.collection('questions').doc(id).get()
    const responseRefs = await firestore
      .collection('questions')
      .doc(id)
      .collection('responses')
      .orderBy('upVotes')
      .get()

    const responses = responseRefs.docs.map((doc) =>
      Response.fromFirebase(doc.data() as Response_t_F)
    )
    const questionData = questionDoc.data() as Question_t_F
    const question = Question.fromFirebase(questionData)
    this.SET_ACTIVE_QUESTION_DATA({ question, responses })
    return question
  }
  // Response Data Logic
}
