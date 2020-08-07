import * as firebase from 'firebase/app';
import 'firebase/auth';

import { firebaseConfig } from "~/envars";


export default (!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app());
const providerConstructor = firebase.auth?.GoogleAuthProvider!;
export const GoogleAuthProvider = new providerConstructor();
export const firebaseAuth = firebase?.auth!();
// export const firestore = firebase.firestore;
//lmao wtf quesiton mark exclamation mark btw