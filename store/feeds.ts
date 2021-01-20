import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { authStore } from './index'
import firebase from 'firebase'
import { Note, Note_t_F } from '~/types/notes'

import functions from '~/plugins/firebaseFunctions'
import { HourDiff } from '~/utils/time'
import { Question, Question_t_F } from '~/types/questions'

let LastVisible: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | null = null

export type FeedItem_t =
  | {
      docData: Note
      dataType: 'note'
    }
  | { docData: Question; dataType: 'question' }
@Module({ stateFactory: true, name: 'feeds', namespaced: true })
export default class FeedsModule extends VuexModule {
  IsReset = false

  EndOfList = false
  NotesPerPage = 5
  ActiveItems: FeedItem_t[] = []
  isPersonalized = false

  @Action({ rawError: true })
  public async GetMoreNotes(start = false) {
    if (this.EndOfList) {
      return
    }
    if (start && this.NotesPerPage <= this.ActiveItems.length) return
    // If you are just trying to get the first notes and note trying to load more, dont load more than you need to
    if (start && authStore.userData) {
      // If you are generating a new feed and the conditions are met
      this.SET_FEED_PERSONALIZED(true)
    }
    let query: firebase.firestore.Query<firebase.firestore.DocumentData>

    // personalized, no feed, outdated feed -> regen feed, give personalized
    if (this.isPersonalized) {
      // Regen feed if no feed or outdated feed
      if (
        !authStore.userData?.lastFeedUpdated ||
        HourDiff(authStore.userData.lastFeedUpdated) > 2
      ) {
        functions.httpsCallable('PersonalRank')()
      }

      // Fetch global feed if no feed, if there is a feed get the latest personalized feed
      if (!authStore.userData?.lastFeedUpdated) {
        query = firestore.collectionGroup('ranking')
      } else {
        query = firestore.collectionGroup('personalRanking')
        query = query.where('userId', '==', authStore.user?.uid)
        query = query.orderBy('updatedAt', 'desc')
      }
    } 
    // If no user data, get global feed,
    else {
      query = firestore.collectionGroup('ranking')
    }
    query = query.orderBy('magicRank', 'desc')

    if (LastVisible) {
      query = query.startAfter(LastVisible)
    }
    query = query.limit(this.NotesPerPage)

    try {
      const rankingDocs = await query.get()
      LastVisible = rankingDocs.docs[rankingDocs.docs.length - 1]
      const notes = await Promise.all(
        rankingDocs.docs
          .map(async (doc) => {
            if(!doc.data().parentPath) console.log({id : doc.id, "error" : "error", doc : doc.data()})
            return {
              doc: await firestore.doc(doc.data().parentPath).get(),
              dataType: doc.data().dataType
            }
          })
          .map(async (docPromise) => {
            switch ((await docPromise).dataType) {
              case 'note':
                return {
                  docData: Note.fromFirebase(
                    (await (await docPromise).doc.data()) as Note_t_F,
                    (await docPromise).doc.id
                  ),
                  dataType: 'note' as const
                }
              case 'question':
                return {
                  docData: Question.fromFirebase(
                    (await (await docPromise).doc.data()) as Question_t_F,
                    (await docPromise).doc.id
                  ),
                  dataType: 'question' as const
                }
            }
          })
      )
      const a = notes.filter(
        async (doc) => typeof doc !== 'undefined'
      ) as FeedItem_t[]
      this.PUSH_ITEMS(a)
    } catch (error) {

      throw error
    }
    return
  }

  @Mutation
  public SET_FEED_PERSONALIZED(isPersonalized: boolean) {
    this.isPersonalized = isPersonalized
  }

  @Mutation
  private PUSH_ITEMS(notes: FeedItem_t[]) {
    if (notes.length < this.NotesPerPage) {
      this.EndOfList = true
    }
    this.ActiveItems.push(...notes)
  }
}
