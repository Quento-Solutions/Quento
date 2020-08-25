import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { firestore as FirestoreModule } from 'firebase/app'
import { authStore } from './index'
import firebase from '~/plugins/firebase'
import { Suggestion } from '~/types/suggestions'

@Module({ stateFactory: true, name: 'suggestions', namespaced: true })
export default class SuggestionsModule extends VuexModule {
  field: keyof Suggestion = 'upVotes'
  pageSize = 15
  currentPageSize = 15
  sortOrder: 'asc' | 'desc' = 'desc'
  likedSuggestions: string[] = []
  suggestions: Suggestion[] = []

  get NewQuery() {
    return firestore
      .collection('suggestions')
      .orderBy(this.field)
      .limit(this.pageSize)
  }

  @Action({ rawError: true })
  public async GetSuggestions() {
    try {
      const query = firestore
        .collection('suggestions')
        .orderBy(this.field, this.sortOrder)
        .limit(this.currentPageSize)
      const a = await query.get()
      const suggestions = a.docs.map(
        (value) => new Suggestion({ ...value.data(), id: value.id } as any)
      )
      this.SET_SUGGESTIONS({ suggestions })
    } catch (error) {
      console.log({ error })
    }
    return
  }
  @Mutation
  private SET_SUGGESTIONS({ suggestions }: { suggestions: Suggestion[] }) {
    this.suggestions = suggestions
  }

  @Mutation
  private SET_PAGE_SIZE(size: number) {
    this.currentPageSize = size
  }

  @Mutation
  private SET_LIKED_SUGGESTIONS(likedSuggestions?: string[]) {
    this.likedSuggestions = likedSuggestions || []
  }

  @Mutation
  private TOGGLE_LIKED_SUGGESTION(suggestionId: string) {
    var index = this.likedSuggestions.indexOf(suggestionId)
    const suggestionIndex = this.suggestions.findIndex(
      (doc) => doc.id! == suggestionId
    )!
    if (index === -1) {
      this.likedSuggestions.push(suggestionId)
      this.suggestions[suggestionIndex].upVotes++
    } else {
      this.likedSuggestions.splice(index, 1)
      this.suggestions[suggestionIndex].upVotes != 0
        ? this.suggestions[suggestionIndex].upVotes--
        : ''
    }
  }
  @Action({ rawError: true })
  public async ToggleLikedSuggestion(id: string) {
    const batch = firestore.batch()
    const userRef = firestore.collection('users').doc(authStore.user?.uid)
    const suggestionRef = firestore.collection('suggestions').doc(id)

    if (this.likedSuggestions.includes(id)) {
      batch.update(userRef, {
        likedSuggestions: FirestoreModule.FieldValue.arrayRemove(id)
      })
      batch.update(suggestionRef, {
        upVotes: FirestoreModule.FieldValue.increment(-1)
      })
    } else {
      batch.update(userRef, {
        likedSuggestions: FirestoreModule.FieldValue.arrayUnion(id)
      })
      batch.update(suggestionRef, {
        upVotes: FirestoreModule.FieldValue.increment(1)
      })
    }
    await batch.commit()
    this.TOGGLE_LIKED_SUGGESTION(id)
    return
  }
  @Mutation
  private SET_SORT_BY({
    field,
    order
  }: {
    field: 'createdAt' | 'upVotes'
    order: 'asc' | 'desc'
  }) {
    this.field = field
    this.sortOrder = order
    this.currentPageSize = this.pageSize
  }
  @Action({ rawError: true })
  public async SetSortBy(sortBy: 'createdAt' | 'upVotes') {
    if (this.field == sortBy || !sortBy) return
    switch (sortBy) {
      case 'createdAt':
        this.SET_SORT_BY({ field: sortBy, order: 'desc' })
        break
      case 'upVotes':
        this.SET_SORT_BY({ field: sortBy, order: 'desc' })
        break
    }

    return await this.GetSuggestions()
  }
  @Action({ rawError: true })
  public async GetLikedSuggestions() {
    const likedSuggestions = authStore.userData?.likedSuggestions
    this.SET_LIKED_SUGGESTIONS(likedSuggestions)
  }

  @Action({ rawError: true })
  public async GetNextPage() {
    if (this.currentPageSize > this.suggestions.length) {
      return
    }
    const numberDocsToGet = this.currentPageSize + this.pageSize
    this.SET_PAGE_SIZE(numberDocsToGet)
    this.GetSuggestions()
  }

  @Action({ rawError: true })
  public async PostSuggestion({
    title,
    contents
  }: {
    title: string
    contents: string
  }) {
    const createdAt = new Date()
    const { uid } = authStore.user!
    const { displayName } = authStore.userData!
    const docData = new Suggestion({
      title,
      contents,
      createdAt,
      upVotes: 0,
      userDisplayName: displayName!,
      uid
    })
    const docRef = await firestore
      .collection('suggestions')
      .add(docData.toFirebase())
    return docRef
  }
}
