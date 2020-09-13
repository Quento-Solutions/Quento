import { Subject_O, Grade_O } from './subjects'
import { Date_t_F, StoredImage } from './firebaseTypes'

import { School_O } from './schools'
import { Timestamp } from './env.utils'

export interface Group_t {
  title: string
  userId: string
  // contents : string;
  createdAt: Date
  // views : number;
  approved : boolean
  description: string
  backgroundImageUrl: string,
  fileUpload ?: StoredImage

  private : boolean

  id?: string
  school?: School_O
  memberList : string[]
  members: number
                                                                                                                                                                                                          
  inviteToken ?: string;
  subject?: Subject_O
  grade?: Grade_O
}

export interface Group_t_F {
  userId: string
  title: string
  // contents : string;
  approved : boolean;
  description: string
  backgroundImageUrl: string,
  private : boolean
  fileUpload ?: StoredImage

  
  createdAt: Date | Date_t_F
  members : number
  memberList : string[]

  inviteToken ?: string;

  school?: School_O
  subject ?: Subject_O
  grade ?: Grade_O
  // views : number;
}

export class Group {
  constructor(opts: Group_t) {
    return Object.assign(this, opts)
  }

  static fromFirebase = (doc: Group_t_F, id?: string) => {
    const createdAt = new Date((doc.createdAt as Date_t_F).seconds * 1000)
    const obj = { ...doc, createdAt, id }
    
    return new Group(obj)
  }

  static toFirebase(doc: Group) {
    const school = (!doc.school || doc.school === 'All Schools') ? null : doc.school;
    const { id, ...firebaseDoc } = { ...doc }
    return {...firebaseDoc, school}
  }
}

export interface Group extends Group_t {}
