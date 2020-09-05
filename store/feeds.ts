import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { authStore } from './index'
import { firestore as store } from 'firebase/app'
import { Note, Note_t_F } from '~/types/notes'

import functions from '~/plugins/firebaseFunctions'
import { HourDiff } from '~/utils/time'

let LastVisible: store.QueryDocumentSnapshot<store.DocumentData> | null = null

@Module({ stateFactory: true, name: 'feeds', namespaced: true })
export default class FeedsModule extends VuexModule {
  IsReset = false

  EndOfList = false;
  NotesPerPage = 5;
  ActiveItems: Note[] = []
  isPersonalized = false

  @Action({ rawError: true })
  public async GetMoreNotes(start = false) {
    if (this.EndOfList) {
      return
    }
    if (start && this.NotesPerPage <= this.ActiveItems.length) return
    // If you are just trying to get the first notes and note trying to load more, dont load more than you need to
    if (
      start &&
      authStore.userData
    ) {
      // If you are generating a new feed and the conditions are met
      this.SET_FEED_PERSONALIZED(true)
    }

    if (this.isPersonalized) {
      if (!LastVisible) {
        if (!authStore.userData?.lastFeedUpdated) {
          // If the user is generating the feed for the first time, wait for it to be generated completely
          await functions.httpsCallable('PersonalRank')()
        } else if (HourDiff(authStore.userData.lastFeedUpdated) > 2) {
          // If the user already has a feed, generate the feed asynchronously
          functions.httpsCallable('PersonalRank')()
        }
      }
      let query: store.Query<store.DocumentData> = firestore.collectionGroup('personalRanking')

      query = query.where("dataType", "==", "note");
      query = query.where('userId', '==', authStore.user?.uid);
      query = query.orderBy("updatedAt", "desc");
      query = query.orderBy('magicRank', 'desc');
      if (LastVisible) {
        query = query.startAfter(LastVisible)
      }
      query = query.limit(this.NotesPerPage)

      try {
        const rankingDocs = await query.get()
        LastVisible = rankingDocs.docs[rankingDocs.docs.length - 1]
        const notes = await Promise.all(
          rankingDocs.docs
            .map((doc) => {
              console.log({ parentPath: doc.data().parentPath })
              return firestore.doc(doc.data().parentPath).get()
            })
            .map(async (docPromise) =>
              Note.fromFirebase(
                (await (await docPromise).data()) as Note_t_F,
                (await docPromise).id
              )
            )
        )
        this.PUSH_ITEMS(notes)
      } catch (error) {
        console.log({ error })
        throw error
      }
      return
    }

    let query: store.Query<store.DocumentData> = firestore.collection('notes')
    // Do query filtering things
    query = query.orderBy('magicRank', 'desc')

    if (LastVisible) {
      query = query.startAfter(LastVisible)
    }

    query = query.limit(this.NotesPerPage)
    try {
      const snapshot = await query.get()
      const notes = snapshot.docs.map((doc) =>
        Note.fromFirebase(doc.data() as Note_t_F, doc.id)
      )
      LastVisible = snapshot.docs[snapshot.docs.length - 1]
      this.PUSH_ITEMS(notes)
    } catch (error) {
      console.log({ error })
      throw error
    }
  }
  
  @Mutation
  public SET_FEED_PERSONALIZED(isPersonalized: boolean) {
    this.isPersonalized = isPersonalized
  }

  @Mutation
  private PUSH_ITEMS(notes: Note[]) {
    if (notes.length < this.NotesPerPage) {
      this.EndOfList = true
    }
    this.ActiveItems.push(...notes)
  }

}
