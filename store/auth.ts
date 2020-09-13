import {
  Module,
  VuexModule,
  MutationAction,
  Action,
  Mutation
} from 'vuex-module-decorators'

import type { User as FirebaseUser } from 'firebase/app'
import type { FireAuthServerUser } from '@nuxtjs/firebase'
import { User, UserData, UserToFirebase } from '~/types/user'
import firestore from '~/plugins/firestore'
import { firebaseAuth, GoogleAuthProvider } from '~/plugins/firebase'
let UserListener :(() => void) | null = null;

export interface AuthState {
  user: User
  loading: boolean
}

@Module({ stateFactory: true, name: 'auth', namespaced: true })
export default class AuthModule extends VuexModule implements AuthState {
  user: User = null
  userData: UserData | null = null
  loading = false

  @Mutation
  private SET_LOADING(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  private SET_USER(user: User) {
    this.user = user
  }

  @Action({ rawError: true })
  public async serverAuthStateChangeAction(user?: FireAuthServerUser) {
    console.log('SERVER AUTH STATE CHANGE ACTION')
    if (!user) {
      this.context.commit('SET_USER', null)
      return
    }
    const { uid, email, emailVerified, displayName, photoURL } = user!
    this.context.commit('SET_USER', {
      uid,
      email,
      emailVerified,
      displayName,
      photoURL
    })
  }

  @Action({ rawError: true })
  public async authStateChange(firebaseUser: FirebaseUser) {
    this.context.commit('SET_LOADING', true)

    const firebaseUserInfo = firebaseUser.providerData[0]!
    let user: User = {
      ...firebaseUserInfo,
      isAdmin: false,
      emailVerified: firebaseUser.emailVerified,
      isAnonymous: firebaseUser.isAnonymous,
      uid: firebaseUser.uid
    }

    this.context.commit('SET_USER', user)
    this.listenUserData();
    this.context.commit('SET_LOADING', false)
  }
  @Action({ rawError: true })
  public async signInWithGoogle() {
    return await firebaseAuth.signInWithPopup(GoogleAuthProvider)
  }

  @Action({ rawError: true })
  public async signInWithEmail({
    email,
    password
  }: {
    email: string
    password: string
  }) {
    try {
      return await firebaseAuth.signInWithEmailAndPassword(email, password)
    } catch (error) {
      throw error
    }
  }

  @Action({ rawError: true })
  public async signUpWithEmail({
    email,
    password,
    displayName
  }: {
    email: string
    password: string
    displayName: string
  }) {
    try {
      await firebaseAuth.createUserWithEmailAndPassword(email, password)
      if (firebaseAuth.currentUser != null) {
        await firebaseAuth.currentUser.updateProfile({
          displayName: displayName
        })
      }
      await this.sendVerifyEmail();
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  @Action({rawError : true})
  public listenUserData()
  {
    if(!this.user)
    {
      UserListener = (UserListener && (UserListener())) || null
      return
    }
    UserListener = UserListener || firestore.collection("users").doc(this.user.uid).onSnapshot((snapshot) => {
      const UserData = snapshot.data() as UserData;
      this.SET_USER_DATA(UserData);
    });
  }

  @Action({rawError : true})
  public unlistenUserData()
  {
    UserListener = (UserListener && (UserListener())) || null
  }

  @Action({ rawError: true })
  public async signOut() {
    await firebaseAuth.signOut()
    this.context.commit('SET_USER', null)
  }

  @Mutation
  private SET_USER_DATA(userData: UserData | null) {
    this.userData = userData
  }

  @Action({ rawError: true })
  public async updateUserData(userData: Partial<UserData>) {
    if(!this.user?.uid) return;
    const uid = this.user.uid
    const firebaseUser = UserToFirebase(userData);
    await firestore.collection('users').doc(uid).update(firebaseUser);
    return
  }

  @Action({ rawError: true })
  public async sendVerifyEmail() {
    const redirect_uri = `${window.location.origin}/auth/verify-email?verified=true`
    await firebaseAuth.currentUser?.sendEmailVerification({
      url: redirect_uri
    })
  }
}
