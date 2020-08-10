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
    newsletter ?: boolean;
    userGuideClosed ?: boolean;
}