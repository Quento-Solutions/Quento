import {Module, VuexModule, Action, Mutation} from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import {authStore} from './index'
import {firestore as store} from 'firebase/app'
import {Note, Note_t, Note_t_F} from '~/types/notes'
import storage from '~/plugins/firebaseStorage'
// Fix the google
import {
  Grade_O,
  Subject_O,
  SortOptions_O,
  FilterOptions
} from '~/types/subjects'
import {School_O} from '~/types/schools'
import functions from '~/plugins/firebaseFunctions'
import {HourDiff} from '~/utils/time'
import UploadImage from '~/utils/uploadImage'
import {StoredImage} from '~/types/firebaseTypes'

let LastVisible: store.QueryDocumentSnapshot<store.DocumentData> | null = null

@Module({stateFactory: true, name: 'notes', namespaced: true})
export default class NotesModule extends VuexModule {
  PreviewNote: Note | null = null
  EditingNote: Note | null = null

  EditModalOpen = false
  PreviewModalOpen = false
  NotesModuleOpen = false

  IsReset = false

  UploadImages: File[] = []

  ActiveGrade: Grade_O = 'ALL'
  ActiveSchool: School_O | 'All Schools' = 'All Schools'
  ActiveSubjects: Subject_O[] = []
  ActiveNotes: Note[] = []
  SortSelect: SortOptions_O = 'magicRank'
  isPersonalized = false

  NotesPerPage = 5
  EndOfList = false

  get likedPosts() {
    return authStore.userData?.likedNotes
  }

  @Mutation
  public SET_FEED_PERSONALIZED(isPersonalized: boolean) {
    this.isPersonalized = isPersonalized
  }

  @Mutation
  public SET_RESET(val: boolean) {
    this.IsReset = val
  }

  @Mutation
  public RESET_NOTES() {
    this.ActiveNotes = []
    this.isPersonalized = false
    LastVisible = null
    this.EndOfList = false
  }

  @Action({rawError: true})
  public SetEditNote(note: Note | null) {
    this.SET_EDIT_NOTE(note)
  }

  @Mutation
  private SET_EDIT_NOTE(note: Note | null) {
    this.EditingNote = note
    this.EditModalOpen = !!note
  }

  @Action({rawError: true})
  public async ResetPosts() {
    this.RESET_NOTES()
    this.SET_RESET(true)
    this.TOGGLE_PREVIEW_MODAL(false)
    this.TOGGLE_NOTES_MODULE(false)
    this.SET_EDIT_NOTE(null)

    return await this.GetMoreNotes(true)
  }

  @Action({rawError: true})
  public SetFilter(filter: FilterOptions) {
    this.SET_FILTER(filter)
    this.RESET_NOTES()
  }

  @Mutation
  private SET_FILTER({
    filterGrades,
    filterSubjects,
    filterSchools,
    sortSelect
  }: FilterOptions) {
    this.ActiveSubjects = [...filterSubjects]
    this.ActiveGrade = filterGrades
    this.ActiveSchool = filterSchools
    this.SortSelect = sortSelect
  }

  @Action({rawError: true})
  public async IncrementView(id: string) {
    const updateViews = await firestore
      .collection('notes')
      .doc(id)
      .update({
        views: store.FieldValue.increment(1)
      })
    return updateViews
  }

  @Mutation
  public SET_UPLOAD_IMAGES(images?: File[]) {
    this.UploadImages = images || []
  }

  @Action({rawError: true})
  public async ToggleLikedNote(id: string) {
    //==============Change server side==============
    const batch = firestore.batch()
    //Getting the docuument in which the users, and notes live in
    const userRef = firestore.collection('users').doc(authStore.user?.uid)
    const noteRef = firestore.collection('notes').doc(id)

    //id = xr2pf0aOW4ZZgIBefOXA

    if (this.likedPosts?.includes(id)) {
      //Unliking the post
      batch.update(userRef, {
        likedNotes: store.FieldValue.arrayRemove(id)
      })
      batch.update(noteRef, {
        upVotes: store.FieldValue.increment(-1)
      })
    } else {
      //Liking the post
      batch.update(userRef, {
        likedNotes: store.FieldValue.arrayUnion(id)
      })
      batch.update(noteRef, {
        upVotes: store.FieldValue.increment(1)
      })
    }

    //Commit the change
    await batch.commit()

    //==============Change client side==============
    this.toggleLikedClient(id)
    return
  }

  @Mutation
  private toggleLikedClient(suggestionId: string) {
    //If userdata doesn't exist
    if (!authStore.userData) return
    //Get liked notes from userData
    const {likedNotes} = authStore.userData
    var index = likedNotes?.indexOf(suggestionId)

    const suggestionIndex = this.ActiveNotes.findIndex(
      (doc) => doc.id! == suggestionId
    )
    if (suggestionIndex === -1) return

    if (index !== -1) {
      //Liking a post
      this.ActiveNotes[suggestionIndex].upVotes++
    } else {
      //Disliking a post
      this.ActiveNotes[suggestionIndex].upVotes > 0
        ? this.ActiveNotes[suggestionIndex].upVotes--
        : console.log('YOU TRIED TO DISLIKE A POST WITH > 0 LIKES')
    }
  }

  @Mutation
  public pushActiveNotes(noteInQuestion: Note) {
    if (!this.ActiveNotes.some((note) => note.id === noteInQuestion.id)) {
      this.ActiveNotes.push(noteInQuestion)
    }
  }

  @Mutation
  private PUSH_NOTES(notes: Note[]) {
    if (notes.length < this.NotesPerPage) {
      this.EndOfList = true
    }
    this.ActiveNotes.push(...notes)
  }

  //Load more notes for a list
  @Action({rawError: true})
  public async GetMoreNotes(start = false) {
    if (this.EndOfList) {
      return
    }
    if (start && this.NotesPerPage <= this.ActiveNotes.length) return
    // If you are just trying to get the first notes and note trying to load more, dont load more than you need to
    if (
      start &&
      authStore.userData &&
      this.ActiveGrade === 'ALL' &&
      this.ActiveSchool === 'All Schools' &&
      this.ActiveSubjects.length === 0 &&
      this.SortSelect === 'magicRank'
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
      let query: store.Query<store.DocumentData> = firestore.collectionGroup(
        'personalRanking'
      )

      query = query.where('dataType', '==', 'note')
      query = query.where('userId', '==', authStore.user?.uid)
      query = query.orderBy('updatedAt', 'desc')
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
            .map((doc) => {
              if (!doc.data().parentPath)
                console.log(
                  '(In noteStore/NotesModule/GetMoreNotes function ',
                  {parentPath: doc.data().parentPath, docData: doc.data()}
                )
              return firestore.doc(doc.data().parentPath).get()
            })
            .map(async (docPromise) =>
              Note.fromFirebase(
                (await (await docPromise).data()) as Note_t_F,
                (await docPromise).id
              )
            )
        )
        this.PUSH_NOTES(notes)
      } catch (error) {
        console.log({error})
        throw error
      }
      return
    }

    let query: store.Query<store.DocumentData> = firestore.collection('notes')
    // Do query filtering things
    query = query.where('private', '==', false)

    if (!(this.ActiveGrade === 'ALL')) {
      query = query.where('grade', '==', this.ActiveGrade)
    }
    if (this.ActiveSchool !== 'All Schools') {
      query = query.where('school', '==', this.ActiveSchool)
    }
    if (this.ActiveSubjects.length != 0) {
      query = query.where('subject', 'in', this.ActiveSubjects.slice(0, 10))
    }
    query = query.orderBy(this.SortSelect, 'desc')

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
      // this.SET_LAST_VISIBLE(lastVisible);
      this.PUSH_NOTES(notes)
    } catch (error) {
      console.log({error})
      throw error
    }
  }
  @Action({rawError: true})
  public async PostNote({
    note,
    deleteImages,
    coverImageFiles
  }: {
    note: Note
    deleteImages ?: StoredImage[]
    coverImageFiles ?: File[]
  }) {
    const unusedImages = note.storedImages?.map(async (image) => {
      // Delete unused images.
      const imageUsed = note.contents?.includes(image.imageURL)
      if (!imageUsed) {
        try {
          const deleteImage = await storage.ref(image.fileName).delete()
          return deleteImage
        } catch (error) {
          console.log({error})
          return
        }
      }
      return
    })

    await Promise.all(unusedImages || [])
    const newImages = note.storedImages?.filter((value) =>
      note.contents?.includes(value.imageURL)
    )
    const uploadImages = await Promise.all(
      coverImageFiles?.map((file) => UploadImage(file)) || []
    )
    const coverImages = [...(note.coverImages || []), ...uploadImages]
    const newNote: Note = {...note, storedImages: newImages, coverImages}

    if (note.id) {
      await firestore
        .collection('notes')
        .doc(note.id)
        .update(Note.toFirebase(newNote))
      return note.id;
    }
    const noteRef = await firestore.collection('notes').add(Note.toFirebase(newNote))
    return noteRef.id;
  }

  @Mutation
  private TOGGLE_NOTES_MODULE(val: boolean) {
    this.NotesModuleOpen = val
  }

  @Action({rawError: true})
  public ToggleNotesModule(val: boolean) {
    this.TOGGLE_NOTES_MODULE(val)
  }

  @Mutation
  private TOGGLE_PREVIEW_MODAL(val: boolean) {
    this.PreviewModalOpen = val
  }

  @Action({rawError: true})
  public TogglePreviewModal(val: boolean) {
    this.TOGGLE_PREVIEW_MODAL(val)
  }

  @Mutation
  private SET_PREVIEW_NOTE(val: Note | null) {
    this.PreviewNote = val
  }

  @Action({rawError: true})
  public SetPreviewNote(val: Note | null) {
    this.SET_PREVIEW_NOTE(val)
  }

  @Action({rawError: true})
  public async DeleteNote(id: string) {
    await firestore.collection('notes').doc(id).delete()
    return await this.ResetPosts()
  }
}
