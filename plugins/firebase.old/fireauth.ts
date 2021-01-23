import { firebaseAuth } from '.';
import type { User } from '@firebase/auth-types';

export default async ({ store  } : any) => {
  await firebaseAuth.onAuthStateChanged(async (user : User | null) => {
    console.log("User changed")
    if (user) {
      await store.dispatch('auth/authStateChange', user);
    }
  });
};