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
import { v4 } from 'uuid';
import { Note, Note_t, Note_t_F } from '~/types/notes'
import storage from '~/plugins/firebaseStorage';
import {
  GradeList,
  Grade_O,
  NestedSubjectList,
  SubjectIconList,
  SubjectList,
  Subject_O
} from '~/types/subjects'

import firebase from '~/plugins/firebase'
type QueryType = store.Query<store.DocumentData>

let LastVisible: store.QueryDocumentSnapshot<store.DocumentData> | null = null


@Module({ stateFactory: true, name: 'notes', namespaced: true })
export default class NotesModule extends VuexModule {
  PreviewNote: Note | null = null
  PreviewModalOpen = false
  NotesModuleOpen = false

  AllSubjects = true
  AllGrades = true

  UploadImages : File[] = [];
  likedPosts: string[] = []
  ActiveGrades: Grade_O[] = [...GradeList]
  ActiveSubjects: Subject_O[] = [...SubjectList]
  ActiveNotes: Note[] = []

  NotesPerPage = 5
  EndOfList = false

  @Action({ rawError: true })
  public async SetActiveFilter(bob: {
    allGradesSelected: boolean
    filterSubjects: Subject_O[]
    filterGrades: Grade_O[]
    allSubjectsSelected: boolean
  }) {
    this.SET_FILTER(bob)
  }
  @Mutation
  private SET_FILTER({
    allGradesSelected,
    allSubjectsSelected,
    filterGrades,
    filterSubjects
  }: {
    allGradesSelected: boolean
    filterSubjects: Subject_O[]
    filterGrades: Grade_O[]
    allSubjectsSelected: boolean
  }) {
    this.ActiveNotes = []
    LastVisible = null
    this.ActiveGrades = filterGrades
    this.ActiveSubjects = filterSubjects
    this.AllGrades = allGradesSelected
    this.AllSubjects = allSubjectsSelected

    if (allGradesSelected) {
      this.ActiveGrades = []
    }
    if (allSubjectsSelected) {
      this.AllSubjects = true
      this.ActiveSubjects = []
    }
    this.EndOfList = false
  }

  @Mutation
  private SET_LIKED_SUGGESTIONS(likedSuggestions: string[]) {
    this.likedPosts = likedSuggestions
  }

  @Action({ rawError: true })
  public async GetLikedSuggestions() {
    console.log({ user: authStore.user })
    const userId = authStore.user?.uid
    console.log({ userId })
    if (!userId) return
    const user = await firestore.collection('users').doc(userId).get()

    const userData = user.data()
    console.log({ userData })
    const likedSuggestions = user.data()?.likedNotes

    console.log({ likedSuggestions })
    if (likedSuggestions) {
      this.SET_LIKED_SUGGESTIONS(likedSuggestions)
    }
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
  public SET_UPLOAD_IMAGES(images: File[]) {
    this.UploadImages = images
  }

  @Action({ rawError: true })
  public async ToggleLikedNote(id: string) {
    if (this.likedPosts.includes(id)) {
      const updateUser = firestore
        .collection('users')
        .doc(authStore.CurrentUser?.uid)
        .update({
          likedNotes: store.FieldValue.arrayRemove(id)
        })
      const updateSuggestion = firestore
        .collection('notes')
        .doc(id)
        .update({
          upVotes: store.FieldValue.increment(-1)
        })
      await Promise.all([updateUser, updateSuggestion])
    } else {
      const updateUser = firestore
        .collection('users')
        .doc(authStore.CurrentUser?.uid)
        .update({
          likedNotes: store.FieldValue.arrayUnion(id)
        })
      const updateSuggestion = firestore
        .collection('notes')
        .doc(id)
        .update({
          upVotes: store.FieldValue.increment(1)
        })
      await Promise.all([updateUser, updateSuggestion])
    }
    this.TOGGLE_LIKED_SUGGESTION(id)
    return
  }

  @Mutation
  private TOGGLE_LIKED_SUGGESTION(suggestionId: string) {
    var index = this.likedPosts.indexOf(suggestionId)
    const suggestionIndex = this.ActiveNotes.findIndex(
      (doc) => doc.id! == suggestionId
    )!
    if (index === -1) {
      this.likedPosts.push(suggestionId)
      this.ActiveNotes[suggestionIndex].upVotes++
    } else {
      this.likedPosts.splice(index, 1)
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

  @Action({})
  public async GetMoreNotes() {
    if (this.EndOfList) {
      console.log('END OF LIST')
      return
    }
    let query: store.Query<store.DocumentData> = firestore.collection('notes')
    // Do query filtering things
    console.log({ allSubjects: this.AllSubjects })
    if (!this.AllSubjects) {
      console.log(this.ActiveSubjects)
      query = query.where('subject', 'in', this.ActiveSubjects.slice(0, 10))
    }
    if (!this.AllGrades) {
      query = query.where('grade', 'in', this.ActiveGrades)
    }
    query = query.orderBy('upVotes', 'desc')
    query = query.limit(this.NotesPerPage)

    if (LastVisible) {
      query = query.startAfter(LastVisible)
    }
    try {
      const snapshot = await query.get()
      console.log({ snapshot })
      const notes = snapshot.docs.map((doc) =>
        Note.fromFirebase(doc.data() as Note_t_F, doc.id)
      )

      console.log({ notes })
      LastVisible = snapshot.docs[snapshot.docs.length - 1]
      // this.SET_LAST_VISIBLE(lastVisible);
      this.PUSH_NOTES(notes)
      console.log({ stateNotes: this.ActiveNotes })
    } catch (error) {
      console.log({ error })
    }
  }
  @Action({ rawError: true })
  public async PostNote({ note, images }: { note: Note; images?: any[] }) {
    
    const uploadRefs = this.UploadImages.map(async (image) => {
        const uid = v4();
        const fileName = image.name.toLowerCase();
        const extMatches = fileName.match(/\.([^\.]+)$/);
        var ext = extMatches ? extMatches[0] : "";
        const imageName = `${uid}${ext}`;
        const imageRef = storage.ref(imageName);
        const imageReuploadName = `postedNote@${imageName}`
        const snapshot = await imageRef.put(image);
         const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref.bucket}/o/${encodeURIComponent(imageReuploadName)}?alt=media`;
        // return await snapshot.ref.;
        console.log({ext, imageName, imageRef, imageUrl});
        return imageUrl;
    // https://firebasestorage.googleapis.com/v0/b/supplant-44e15.appspot.com/o/thumb%40256_e9320c0e-a80e-485d-864d-0fa97d665cff.jpg?alt=media&token=2315a102-391e-48f4-a05b-37ed2fd96fb3
    })
    const imageLinks = await Promise.all(uploadRefs);
    console.log({imageLinks});
    const newNote = note.toFirebase();
    newNote.images = imageLinks
    try {
        
      const docRef = await firestore.collection('notes').add(newNote)
    } catch (error) {}
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
}
