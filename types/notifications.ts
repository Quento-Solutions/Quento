import { Date_t_F, firebaseDate } from './firebaseTypes'
import { Newsletter_t_F } from './newsletters'
import { Note_t_F } from './notes'
import { Question_t_F } from './questions'
import { Response_t_F } from './responses'

export const NotificationDataList = ['QUESTION', "NEWSLETTER", "NOTE", "RESPONSE"] as const
export const NotificationActionList = ['POST', "RESPONSE", "POPULAR"] as const

export type NotificationAction_O = typeof NotificationActionList[number]
export type NotificationData_O = typeof NotificationDataList[number]

export interface Notification_t_F<Type extends NotificationData_O> {
  createdAt: Date_t_F | Date
  docId: string
  read: boolean
  docData: NotificationDataMap[Type]
  dataType: Type
  userId?: string
  avatarDisplayName ?: string;
  avatarPhotoUrl ?: string;
  redirectUrl : string;
  title ?: string;
}

export type NotificationMapType = {
  [index in NotificationData_O]: any
}
export interface NotificationDataMap extends NotificationMapType {
  QUESTION: Question_t_F;
  NEWSLETTER : Newsletter_t_F;
  RESPONSE : Response_t_F;
  NOTE : Note_t_F;
}

export interface Notification_t<DataType extends NotificationData_O> {
  id?: string
  createdAt: Date
  docId: string
  read: boolean
  docData: NotificationDataMap[DataType]
  dataType: DataType
  userId?: string
  avatarPhotoUrl ?: string;
  avatarDisplayName ?: string;
  redirectUrl : string;
  title ?: string;
}

export class Notification<DataType extends NotificationData_O> {
  constructor(opts: Notification_t<DataType>) {
    return Object.assign(this, opts)
  }

  static fromFirebase = <DataType extends NotificationData_O>(
    doc: Notification_t_F<DataType>,
    id?: string
  ) => {
    const obj = {
      ...doc,
      createdAt: firebaseDate(doc.createdAt as Date_t_F),
      id
    }
    return new Notification(obj)
  }

  static toFirebase<DataType extends NotificationData_O>(
    question: Notification<DataType>
  ): Notification_t_F<DataType> {
    const { id, ...firebaseDoc } = { ...question }
    return firebaseDoc
  }
}
export interface Notification<DataType extends NotificationData_O>
  extends Notification_t<DataType> {}
