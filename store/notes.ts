import {
  Module,
  VuexModule,
  MutationAction,
  Action,
  Mutation
} from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import type { firestore as store } from 'firebase'
import { authStore } from './index'

import { Note, Note_t, Note_t_F } from '~/types/notes'
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
    this.ActiveNotes = [];
    LastVisible = null;
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
    console.log({allSubjects : this.AllSubjects});
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
        console.log({snapshot});
      const notes = snapshot.docs.map((doc) =>
        Note.fromFirebase(doc.data() as Note_t_F, doc.id)
      )

      console.log({ notes })
      LastVisible = snapshot.docs[snapshot.docs.length - 1]
      // this.SET_LAST_VISIBLE(lastVisible);
      this.PUSH_NOTES(notes)
      console.log({ stateNotes: this.ActiveNotes })
    } catch (error) {
        console.log({error});
    }
  }
  @Action({ rawError: true })
  public async PostNote({ note, images }: { note: Note; images?: any[] }) {
    try {
      const docRef = await firestore.collection('notes').add(note.toFirebase())
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
