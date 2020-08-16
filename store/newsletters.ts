import { Module, VuexModule, MutationAction,Mutation, Action } from 'vuex-module-decorators'

import firestore from '~/plugins/firestore'
import {Newsletter, Newsletter_t_F, Newsletter_t} from '~/types/newsletters'
import { authStore } from './index'
import { firestore as store } from 'firebase/app'
import { v4 } from 'uuid'
import storage from '~/plugins/firebaseStorage'
import firebase from '~/plugins/firebase'

import {
  Grade_O,
  SubjectList,
  Subject_O,
  SortOptions_O
} from '~/types/subjects'
let LastVisible: store.QueryDocumentSnapshot<store.DocumentData> | null = null
export interface FilterOptions {
  filterSubjects: Subject_O[]
  filterGrades: Grade_O
  sortSelect: SortOptions_O
}

@Module({ stateFactory: true, name: 'newsletters', namespaced: true })
export default class NewslettersModule extends VuexModule {

  newsletterList : Newsletter[] = [];
  sortBy = "createdAt";
  PreviewNote: Newsletter | null = null
  EditingNote: Newsletter | null = null

  EditModalOpen = false
  PreviewModalOpen = false
  NotesModuleOpen = false

  IsReset = false

  UploadImages: File[] = []
  likedPosts: string[] = []
  ActiveGrade: Grade_O = 'ALL'
  ActiveSubjects: Subject_O[] = [...SubjectList]
  ActiveNotes: Newsletter[] = []
  SortSelect: SortOptions_O = 'createdAt'

  NotesPerPage = 5
  EndOfList = false

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
  public SetEditNote(note: Newsletter | null) {
    console.log({note});
    this.SET_EDIT_NOTE(note)
  }

  @Mutation
  private SET_EDIT_NOTE(note: Newsletter | null) {
    this.EditingNote = note
    this.EditModalOpen = !!note
  }

  @Action({ rawError: true })
  public async ResetPosts() {

    this.RESET_NOTES()
    this.SET_RESET(true)
    this.TOGGLE_PREVIEW_MODAL(false)
    this.TOGGLE_NOTES_MODULE(false)
    this.SET_EDIT_NOTE(null);
    return await this.GetMoreNotes()
  }

  @Action({ rawError: true })
  public async SetActiveFilter(Options: FilterOptions) {
    this.SET_FILTER(Options)
  }

  @Mutation
  private SET_FILTER({
    filterGrades,
    filterSubjects,
    sortSelect
  }: FilterOptions) {
    this.ActiveNotes = []
    LastVisible = null
    this.ActiveSubjects = [...filterSubjects]
    this.ActiveGrade = filterGrades
    this.SortSelect = sortSelect
    this.EndOfList = false
  }

  @Mutation
  private SET_LIKED_NOTES(likedSuggestions?: string[]) {
    this.likedPosts = likedSuggestions || []
  }

  @Action({ rawError: true })
  public async GetLikedNotes() {
    const likedNotes = authStore.userData?.likedNotes;
    this.SET_LIKED_NOTES(likedNotes);
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
  public SET_UPLOAD_IMAGES(images ?: File[]) {
    this.UploadImages = images || [];
  }

  @Action({ rawError: true })
  public async ToggleLikedNote(id: string) {
    if (this.likedPosts.includes(id)) {
      const updateUser = firestore
        .collection('users')
        .doc(authStore.user?.uid)
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
        .doc(authStore.user?.uid)
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
  private PUSH_NOTES(notes: Newsletter[]) {
    if (notes.length < this.NotesPerPage) {
      this.EndOfList = true
    }
    this.ActiveNotes.push(...notes)
  }

  @Action({})
  public async GetMoreNotes() {
    if (this.EndOfList) {
      return
    }
    let query: store.Query<store.DocumentData> = firestore.collection('notes')
    // Do query filtering things

    if (!(this.ActiveGrade === 'ALL')) {
      query = query.where('grade', '==', this.ActiveGrade)
    }
    if (this.ActiveSubjects.length != 0) {
      query = query.where('subject', 'in', this.ActiveSubjects.slice(0, 10))
    }

    query = query.orderBy(this.SortSelect, 'desc')
    query = query.limit(this.NotesPerPage)

    if (LastVisible) {
      query = query.startAfter(LastVisible)
    }
    try {
      const snapshot = await query.get()
      const notes = snapshot.docs.map((doc) =>
        Newsletter.fromFirebase(doc.data() as Newsletter_t_F, doc.id)
      )
      LastVisible = snapshot.docs[snapshot.docs.length - 1]
      // this.SET_LAST_VISIBLE(lastVisible);
      this.PUSH_NOTES(notes)
    } catch (error) {
      console.log({ error })
      throw error
    }
  }
  @Action({ rawError: true })
  public async PostNote({ note }: { note: Newsletter }) {
    console.log({note});
    if(note.id)
    {
      return await firestore.collection('notes').doc(note.id).update(Newsletter.toFirebase());
    }    
    const uploadRefs = this.UploadImages.map(async (image) => {
      const uid = v4()
      const fileName = image.name.toLowerCase()
      const extMatches = fileName.match(/\.([^\.]+)$/)
      var ext = extMatches ? extMatches[0] : ''
      const imageName = `${uid}${ext}`
      const imageRef = storage.ref(imageName)
      const imageReuploadName = `postedNote@${imageName}`
      const snapshot = await imageRef.put(image)
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        snapshot.ref.bucket
      }/o/${encodeURIComponent(imageReuploadName)}?alt=media`
      // return await snapshot.ref.;
      return imageUrl
      // https://firebasestorage.googleapis.com/v0/b/supplant-44e15.appspot.com/o/thumb%40256_e9320c0e-a80e-485d-864d-0fa97d665cff.jpg?alt=media&token=2315a102-391e-48f4-a05b-37ed2fd96fb3
    })
    const imageLinks = await Promise.all(uploadRefs)
    const newNote = Newsletter.toFirebase(note)
    newNote.images = imageLinks

    await firestore.collection('notes').add(newNote)
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
  private SET_PREVIEW_NOTE(val: Newsletter | null) {
    this.PreviewNote = val
  }

  @Action({ rawError: true })
  public SetPreviewNote(val: Newsletter | null) {
    this.SET_PREVIEW_NOTE(val)
  }

  @Mutation
  private SET_NEWSLETTER_LIST(items : Newsletter[])
  {
    this.newsletterList = items;
  }

  @Action({ rawError: true })
  public async GetNewsletters() {
    try {
      const query = await firestore.collection('newsletters').orderBy(this.sortBy).get();
      const items = query.docs.map(doc => Newsletter.fromFirebase(doc.data() as Newsletter_t_F));
      this.SET_NEWSLETTER_LIST(items);
      return;
    } catch (error) {
      console.log({ error })
    }
    return; 
  }
}