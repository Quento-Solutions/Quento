import { Grade_O, Subject_O } from './subjects'

import { School_O } from './schools'

export type User = {
  uid: string
  displayName?: string | null
  email?: string | null
  phoneNumber?: string | null
  photoURL?: string | null
  providerId?: string
  emailVerified: boolean
  isAnonymous?: boolean
  isAdmin?: boolean
} | null

export interface UserData {
  email: string

  likedSuggestions?: string[]
  likedNotes?: string[]
  likedQuestions?: string[]
  likedResponses?: string[]

  userGuideClosed?: boolean
  userInformationAdded?: boolean

  displayName?: string | null
  photoURL?: string | null
  currentGrade?: Grade_O
  interestedSubjects?: Subject_O[]
  bio?: string
  school?: School_O

  postedSuggestions?: string[]
  postedNotes?: string[]

  newsletter?: boolean
  progressionExp?: number
  progressionLevel?: number

  discordId?: string
  discordUsername?: string
  photoFileName?: string | null

  notifications?: boolean
}
