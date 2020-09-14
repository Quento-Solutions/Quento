import { Subject_O, Grade_O } from './subjects'
import {
  Date_t_F,
  Date_t_A,
  firebaseDate,
  StoredImage,
  algoliaDate,
} from './firebaseTypes'

import {School_O} from './schools'
import { Timestamp } from './env.utils'

export interface Note_t {
  title: string
  uid: string
  userDisplayName: string
  userPhotoUrl?: string

  images?: string[]
  contents : string
  storedImages?: StoredImage[]
  coverImages ?: StoredImage[]
  school ?: School_O | null;

  createdAt: Date
  upVotes: number
  views: number

  subject: Subject_O
  grade: Grade_O
  //Unique
  id?: string
  
  groupId ?: string;
  groupName ?: string;
}

// Firebase Interface
export interface Note_t_F {
  title: string
  uid: string
  userDisplayName: string
  userPhotoUrl?: string

  images?: string[]
  contents : string
  storedImages?: StoredImage[]
  coverImages ?: StoredImage[]

  school ?: School_O | null;

  createdAt: Date_t_F
  upVotes: number
  views: number
  
  subject: Subject_O
  grade: Grade_O

  groupId?: string
  groupName ?: string;
  //Unique to this one
  magicRank?: number
}

//Julius Caesar, to Brutus in actual Latin (circa 45 BC)
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Note_t_A = Omit<Note_t_F, 'createdAt'> & {
  createdAt: Date_t_A | Date
  gradeName: string
  objectID: string
}

export class Note{
  constructor(opts: Note_t) {
    return Object.assign(this, opts)
  }

  static fromFirebase = (doc: Note_t_F, id?: string) => {
    const createdAt = firebaseDate(doc.createdAt)
    const obj = { ...doc, createdAt, id }
    return new Note(obj)
  }

  static toFirebase = (note: Note) => {
    const createdAt = Timestamp.fromDate(note.createdAt)
    const school = (!note.school || note.school === 'All Schools') ? null : note.school;
    const { id, ...firebaseDoc } = { ...note }
    return { ...firebaseDoc, createdAt, school }
  }
  static toAlgolia = (note: Note, objectID: string): Note_t_A => {
    const { id, grade, ...firebaseDoc } = { ...note }
    const gradeName = typeof grade === 'number' ? 'Grade ' + grade : grade
    return { ...firebaseDoc, objectID, grade, gradeName }
  }
  static fromAlgolia = (doc: Note_t_A) => {
    const { objectID, ...obj } = {
      ...doc,
      createdAt: algoliaDate(doc.createdAt as Date_t_A),
      id: doc.objectID
    }
    return new Note(obj)
  }
}

export interface Note extends Note_t {}