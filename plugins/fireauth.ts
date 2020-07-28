import { firebaseAuth } from '~/plugins/firebase';
import type { User } from '@firebase/auth-types';

import { authStore } from "~/store";
export default async ({ store  } : any) => {
  await firebaseAuth.onAuthStateChanged(async (user : User | null) => {
    if (user) {
      await store.dispatch('auth/authStateChange', user);
    }
  });
};