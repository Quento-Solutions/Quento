import { Grade_O, Subject_O } from './subjects'

import { School_O } from './schools'
import { Timestamp } from './env.utils'

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
  school?: School_O | null;

  postedSuggestions?: string[]
  postedNotes?: string[]

  newsletter?: boolean
  progressionExp?: number
  progressionLevel?: number
  totalExp: number;

  discordId?: string
  discordUsername?: string
  photoFileName?: string | null

  notifications?: boolean
  pendingFollowing?: string[]
  following?: string[]
  lastFeedUpdated ?: Timestamp
}
export const UserToFirebase = (user : Partial<UserData>) =>
{
  const newUser = Object.assign({}, user);
  if(newUser.lastFeedUpdated) newUser.lastFeedUpdated = new Timestamp(newUser.lastFeedUpdated.seconds, newUser.lastFeedUpdated.nanoseconds);
  if(!newUser.school || newUser.school === 'All Schools') newUser.school = null;
  return newUser
}