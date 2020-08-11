import {
    Grade_O,
    Subject_O
} from './subjects';

import { School_O } from './schools'

export type User  = {
    uid: string;
    displayName ?: string | null;
    email ?: string | null;
    phoneNumber ?: string | null;
    photoURL ?: string | null;
    providerId ?: string;
    emailVerified: boolean;
    isAnonymous ?: boolean;
    isAdmin ?: boolean;
} | null;

export interface UserData {
    email : string;

    likedSuggestions ?: string[];
    likedNotes ?: string[];

    userGuideClosed ?: boolean;
    userInformationAdded ?: boolean;

    currentGrade ?: Grade_O;
    interestedSubjects ?: Subject_O[];
    bio ?: string;
    school ?: School_O;

    postedSuggestions ?: string[];
    postedNotes ?: string[];
    
    newsletter ?: boolean;

}