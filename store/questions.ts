import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { auth, firestore as FirestoreModule } from 'firebase/app'
import functions from '~/plugins/firebaseFunctions'
import storage from '~/plugins/firebaseStorage'

import { Question, Question_t_F } from '~/types/questions'
import { Response, Response_t_F } from '~/types/responses'
import {
  Grade_O,
  SubjectList,
  Subject_O,
  SortOptions_O,
  FilterOptions
} from '~/types/subjects'

import { authStore } from '~/store'
import { School_O } from '~/types/schools'
import { firestore as store } from 'firebase/app'

let LastVisible: store.QueryDocumentSnapshot<store.DocumentData> | null = null

@Module({ stateFactory: true, name: 'questions', namespaced: true })
export default class QuestionsModule extends VuexModule {
  get likedPosts()
  {
    return authStore.userData?.likedQuestions
  }
  ActiveGrade: Grade_O = 'ALL'
  ActiveSchool: School_O | 'All Schools' = 'All Schools'
  ActiveSubjects: Subject_O[] = []
  ActiveItems: Question[] = []
  SortSelect: SortOptions_O = 'createdAt'

  ItemsPerPage = 5
  EndOfList = false

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

  @Mutation
  public RESET_ITEMS() {
    this.ActiveItems = []
    LastVisible = null
    this.EndOfList = false
  }

  @Mutation
  public SET_FILTER({
    filterGrades,
    filterSubjects,
    filterSchools,
    sortSelect
  }: FilterOptions) {
    this.ActiveItems = []
    LastVisible = null
    this.ActiveSubjects = [...filterSubjects]
    this.ActiveGrade = filterGrades
    this.ActiveSchool = filterSchools
    this.SortSelect = sortSelect
    this.EndOfList = false
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

  @Mutation
  private PUSH_QUESTIONS(questions: Question[]) {
    if (questions.length < this.ItemsPerPage) {questions
      this.EndOfList = true
    }
    this.ActiveItems.push(...questions)
  }
  
  @Action({rawError : true})
  public async GetMoreQuestions(max ?: number) {
    if (this.EndOfList) {
      return
    }
    if (max && max <= this.ActiveItems.length) return;
    let query: store.Query<store.DocumentData> = firestore.collection('questions')
    // Do query filtering things

    if ((this.ActiveGrade !== 'ALL')) {
      query = query.where('grade', '==', this.ActiveGrade)
    }
    if ((this.ActiveSchool !== 'All Schools')) {
      query = query.where('school', '==', this.ActiveSchool)
    }
    if (this.ActiveSubjects.length != 0) {
      query = query.where('subject', 'in', this.ActiveSubjects.slice(0, 10))
    }

    query = query.orderBy(this.SortSelect, 'desc')

    if (LastVisible) {
      query = query.startAfter(LastVisible)
    }

    query = query.limit(this.ItemsPerPage)
    try {
      const snapshot = await query.get()
      const notes = snapshot.docs.map((doc) =>
        Question.fromFirebase(doc.data() as Question_t_F, doc.id)
      )
      LastVisible = snapshot.docs[snapshot.docs.length - 1]
      this.PUSH_QUESTIONS(notes)
    } catch (error) {
      console.log({ error })
      throw error
    }
  }
  // Question Data Logic
  @Action({ rawError: true })
  public async CreateQuestion(question: Question) {
    const deleteImages = question.storedImages?.map(async (image) => {
      // Deletes all unused images.
      const imageUsed = question.contents?.includes(image.imageURL)
      if (!imageUsed) {
        try {
          const deleteImage = await storage.ref(image.fileName).delete()
          return deleteImage
        } catch (error) {
          console.log({ error })
          return
        }
      }
      return
    })
    await Promise.all(deleteImages || [])
    const newImages = question.storedImages?.filter((value) =>
      question.contents?.includes(value.imageURL)
    )
    const newQuestion: Question = Object.assign({}, question, {
      storedImages: newImages
    })
    return question.id
      ? await firestore
          .collection('questions')
          .doc(question.id)
          .update(Question.toFirebase(newQuestion))
      : await firestore
          .collection('questions')
          .add(Question.toFirebase(newQuestion))
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
      userDisplayName: authStore.userData?.displayName!,
      userId: authStore.user?.uid!,
      userPhotoUrl: authStore.userData?.photoURL!,
      views: 0
    })
    return await firestore
      .collection('questions')
      .doc(questionId)
      .collection('responses')
      .add(Response.toFirebase(response))
  }

  @Action({ rawError: true })
  public async GetQuestion(id: string) {
    const questionDoc = await firestore.collection('questions').doc(id).get()
    const responseRefs = await firestore
      .collection('questions')
      .doc(id)
      .collection('responses')
      .orderBy('upVotes', 'desc')
      .get()

    const responses = responseRefs.docs.map((doc) =>
      Response.fromFirebase(doc.data() as Response_t_F, doc.id)
    )
    const questionData = questionDoc.data() as Question_t_F
    const question = Question.fromFirebase(questionData, id)
    this.SET_ACTIVE_QUESTION_DATA({ question, responses })
    return question
  }

  // Response Data Logic
  @Action({ rawError: true })
  public async ToggleLikedQuestion(questionId: string) {
    const batch = firestore.batch()
    const userRef = firestore.collection('users').doc(authStore.user?.uid)
    const questionRef = firestore.collection('questions').doc(questionId)

    const userLiked = authStore.userData?.likedQuestions?.includes(questionId)
    batch.update(userRef, {
      likedQuestions: userLiked
        ? FirestoreModule.FieldValue.arrayRemove(questionId)
        : FirestoreModule.FieldValue.arrayUnion(questionId)
    })
    batch.update(questionRef, {
      upVotes: userLiked
        ? FirestoreModule.FieldValue.increment(-1)
        : FirestoreModule.FieldValue.increment(1)
    })
    await batch.commit()
    return
  }
  @Action({ rawError: true })
  public async ToggleLikedResponse({
    questionId,
    responseId
  }: {
    questionId: string
    responseId: string
  }) {
    const batch = firestore.batch()
    const userRef = firestore.collection('users').doc(authStore.user?.uid)
    const responseRef = firestore
      .collection('questions')
      .doc(questionId)
      .collection('responses')
      .doc(responseId)

    const userLiked = authStore.userData?.likedResponses?.includes(responseId)
    batch.update(userRef, {
      likedResponses: userLiked
        ? FirestoreModule.FieldValue.arrayRemove(responseId)
        : FirestoreModule.FieldValue.arrayUnion(responseId)
    })
    batch.update(responseRef, {
      upVotes: userLiked
        ? FirestoreModule.FieldValue.increment(-1)
        : FirestoreModule.FieldValue.increment(1)
    })
    await batch.commit()
    return
  }

  @Action({ rawError: true })
  public async IncrementView(id: string) {
    const updateViews = await firestore
      .collection('questions')
      .doc(id)
      .update({
        views: FirestoreModule.FieldValue.increment(1)
      })
    return updateViews
  }
}
