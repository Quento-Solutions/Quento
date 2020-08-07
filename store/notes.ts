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
import firebase from '~/plugins/firebase';

// Fix the googl 
import {
  Grade_O,
  SubjectList,
  Subject_O,
  SortOptions_O
} from '~/types/subjects'

type QueryType = store.Query<store.DocumentData>

let LastVisible: store.QueryDocumentSnapshot<store.DocumentData> | null = null
export interface FilterOptions {
  filterSubjects: Subject_O[]
  filterGrades: Grade_O,
  sortSelect : SortOptions_O
  allSubjectsSelected: boolean
};

@Module({ stateFactory: true, name: 'notes', namespaced: true })
export default class NotesModule extends VuexModule {
  PreviewNote: Note | null = null
  PreviewModalOpen = false
  NotesModuleOpen = false

  IsReset = false;
  AllSubjects = true

  UploadImages : File[] = [];
  likedPosts: string[] = []
  ActiveGrade : Grade_O  = "ALL"
  ActiveSubjects: Subject_O[] = [...SubjectList]
  ActiveNotes: Note[] = []
  SortSelect : SortOptions_O = "upVotes"

  NotesPerPage = 5
  EndOfList = false

  @Mutation
  public SET_RESET(val : boolean)
  {
    this.IsReset = val;
  }
  
  @Mutation
  public RESET_NOTES()
  {
    this.ActiveNotes = [];
    LastVisible = null;
    this.EndOfList = false;
  }

  @Action({rawError: true})
  public async ResetPosts()
  {
    this.RESET_NOTES();
    this.SET_RESET(true);
    this.TOGGLE_PREVIEW_MODAL(false);
    this.TOGGLE_NOTES_MODULE(false);
    return await this.GetMoreNotes();
  }

  @Action({ rawError: true })
  public async SetActiveFilter(Options: FilterOptions) {
    this.SET_FILTER(Options)
  }

  @Mutation
  private SET_FILTER({allSubjectsSelected,filterGrades,filterSubjects, sortSelect}: FilterOptions) {
    this.ActiveNotes = []
    LastVisible = null
    this.ActiveSubjects = filterSubjects
    this.ActiveGrade = filterGrades
    this.AllSubjects = allSubjectsSelected
    this.SortSelect = sortSelect;

    if (allSubjectsSelected) {
      this.AllSubjects = true
      this.ActiveSubjects = []
    }
    this.EndOfList = false
  }

  @Mutation
  private SET_LIKED_NOTES(likedSuggestions ?: string[]) {
    this.likedPosts = likedSuggestions || [];
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
      return
    }
    let query: store.Query<store.DocumentData> = firestore.collection('notes')
    // Do query filtering things

    if (!(this.ActiveGrade === "ALL")) {
      query = query.where('grade', '==', this.ActiveGrade)
    }
    if (!this.AllSubjects) {
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
        Note.fromFirebase(doc.data() as Note_t_F, doc.id)
      )

      LastVisible = snapshot.docs[snapshot.docs.length - 1]
      // this.SET_LAST_VISIBLE(lastVisible);
      this.PUSH_NOTES(notes)
    } catch (error) {
      console.log({ error })
      throw(error);
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
        return imageUrl;
    // https://firebasestorage.googleapis.com/v0/b/supplant-44e15.appspot.com/o/thumb%40256_e9320c0e-a80e-485d-864d-0fa97d665cff.jpg?alt=media&token=2315a102-391e-48f4-a05b-37ed2fd96fb3
    })
    const imageLinks = await Promise.all(uploadRefs);
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
