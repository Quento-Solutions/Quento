import {
  Module,
  VuexModule,
  MutationAction,
  Action,
  Mutation
} from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { authStore } from './index'
import { firestore as store } from 'firebase/app'
import { v4 } from 'uuid'
import { Note, Note_t, Note_t_F } from '~/types/notes'
import storage from '~/plugins/firebaseStorage'

// Fix the google
import {
  Grade_O,
  SubjectList,
  Subject_O,
  SortOptions_O,
  FilterOptions
} from '~/types/subjects'

import { School_O } from '~/types/schools'

let LastVisible: store.QueryDocumentSnapshot<store.DocumentData> | null = null

@Module({ stateFactory: true, name: 'notes', namespaced: true })
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
  ActiveSubjects: Subject_O[] = [...SubjectList]
  ActiveNotes: Note[] = []
  SortSelect: SortOptions_O = 'magicRank'

  NotesPerPage = 5
  EndOfList = false

  get likedPosts() {
    return authStore.userData?.likedNotes
  }

  @Mutation
  public SET_RESET(val: boolean) {
    this.IsReset = val
  }

  @Mutation
  public RESET_NOTES() {
    this.ActiveNotes = []
    LastVisible = null
    this.EndOfList = false
  }

  @Action({ rawError: true })
  public SetEditNote(note: Note | null) {
    console.log({ note })
    this.SET_EDIT_NOTE(note)
  }

  @Mutation
  private SET_EDIT_NOTE(note: Note | null) {
    this.EditingNote = note
    this.EditModalOpen = !!note
  }

  @Action({ rawError: true })
  public async ResetPosts() {
    this.RESET_NOTES()
    this.SET_RESET(true)
    this.TOGGLE_PREVIEW_MODAL(false)
    this.TOGGLE_NOTES_MODULE(false)
    this.SET_EDIT_NOTE(null)
    return await this.GetMoreNotes()
  }

  @Mutation
  public SET_FILTER({
    filterGrades,
    filterSubjects,
    filterSchools,
    sortSelect
  }: FilterOptions) {
    this.ActiveNotes = []
    LastVisible = null
    this.ActiveSubjects = [...filterSubjects]
    this.ActiveGrade = filterGrades
    this.ActiveSchool = filterSchools
    this.SortSelect = sortSelect
    this.EndOfList = false
  }

  @Action({ rawError: true })
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

  @Action({ rawError: true })
  public async ToggleLikedNote(id: string) {
    const batch = firestore.batch()
    const userRef = firestore.collection('users').doc(authStore.user?.uid)
    const noteRef = firestore.collection('notes').doc(id)
    console.log(this.likedPosts)
    if (this.likedPosts?.includes(id)) {
      batch.update(userRef, {
        likedNotes: store.FieldValue.arrayRemove(id)
      })
      batch.update(noteRef, {
        upVotes: store.FieldValue.increment(-1)
      })
    } else {
      batch.update(userRef, {
        likedNotes: store.FieldValue.arrayUnion(id)
      })
      batch.update(noteRef, {
        upVotes: store.FieldValue.increment(1)
      })
    }
    await batch.commit()
    this.TOGGLE_LIKED_SUGGESTION(id)
    return
  }

  @Mutation
  private TOGGLE_LIKED_SUGGESTION(suggestionId: string) {
    if (!authStore.userData) return
    const { likedNotes } = authStore.userData
    console.log(likedNotes)
    var index = likedNotes?.indexOf(suggestionId)
    const suggestionIndex = this.ActiveNotes.findIndex(
      (doc) => doc.id! == suggestionId
    )!
    if (index !== -1) {
      this.ActiveNotes[suggestionIndex].upVotes++
    } else {
      this.ActiveNotes[suggestionIndex].upVotes != 0
        ? this.ActiveNotes[suggestionIndex].upVotes--
        : ''
    }
  }

  @Mutation
  private PUSH_NOTES(notes: Note[]) {
    if (notes.length < this.NotesPerPage) {
      this.EndOfList = true
    }
    this.ActiveNotes.push(...notes)
  }

  @Action({ rawError: true })
  public async GetMoreNotes(max ?: number) {
    if (this.EndOfList) {
      return
    }
    if (max && max <= this.ActiveNotes.length) return;
    let query: store.Query<store.DocumentData> = firestore.collection('notes')
    // Do query filtering things

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
      const notes = snapshot.docs.map((doc) => {
        doc.ref.update({
          deteriorate: store.FieldValue.increment(1)
        })
        return Note.fromFirebase(doc.data() as Note_t_F, doc.id)
      })
      LastVisible = snapshot.docs[snapshot.docs.length - 1]
      // this.SET_LAST_VISIBLE(lastVisible);
      this.PUSH_NOTES(notes)
    } catch (error) {
      console.log({ error })
      throw error
    }
  }
  @Action({ rawError: true })
  public async PostNote({ note }: { note: Note }) {
    const deleteImages = note.storedImages?.map(async (image) => {
      // Delete unused images.
      const imageUsed = note.contents?.includes(image.imageURL)
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
    const newImages = note.storedImages?.filter((value) =>
      note.contents?.includes(value.imageURL)
    )
    const newNote: Note = Object.assign({}, note, { storedImages: newImages })
    if (note.id) {
      return await firestore
        .collection('notes')
        .doc(note.id)
        .update(Note.toFirebase(newNote))
    }
    await firestore.collection('notes').add(Note.toFirebase(newNote))
  }

  @Mutation
  private TOGGLE_NOTES_MODULE(val: boolean) {
    this.NotesModuleOpen = val
  }

  @Action({ rawError: true })
  public ToggleNotesModule(val: boolean) {
    this.TOGGLE_NOTES_MODULE(val)
  }

  @Mutation
  private TOGGLE_PREVIEW_MODAL(val: boolean) {
    this.PreviewModalOpen = val
  }

  @Action({ rawError: true })
  public TogglePreviewModal(val: boolean) {
    this.TOGGLE_PREVIEW_MODAL(val)
  }

  @Mutation
  private SET_PREVIEW_NOTE(val: Note | null) {
    this.PreviewNote = val
  }

  @Action({ rawError: true })
  public SetPreviewNote(val: Note | null) {
    this.SET_PREVIEW_NOTE(val)
  }

  @Action({ rawError: true })
  public async DeleteNote(id: string) {
    await firestore.collection('notes').doc(id).delete()
    return await this.ResetPosts()
  }
}
