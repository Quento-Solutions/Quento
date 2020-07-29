import {
    Module,
    VuexModule,
    MutationAction,
    Action,
    Mutation
} from 'vuex-module-decorators';

import type { User as FirebaseUser} from 'firebase'
import type {FireAuthServerUser} from '@nuxtjs/firebase'

import firestore from '~/plugins/firestore';
import { firebaseAuth, GoogleAuthProvider } from '~/plugins/firebase';

export interface AuthState {
    user : User;
    loading : boolean;
}
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

@Module({ stateFactory: true, name: 'auth', namespaced: true })
export default class AuthModule extends VuexModule implements AuthState {
    user : User = null;
    loading = false;
    
    @Mutation
    private SET_LOADING(loading : boolean) {
        this.loading = loading;
    }

    @Mutation
    private SET_USER(user : User) 
    {
        this.user = user;
    }

    @Action({rawError : true})
    public async serverAuthStateChangeAction(user ?: FireAuthServerUser)
    {
        // console.log("server state ")
        if (!user) {
            this.context.commit('SET_USER', null);
            return
        }
        const { uid, email, emailVerified, displayName, photoURL } = user!;
        this.context.commit('SET_USER', {
            uid, email, emailVerified, displayName, photoURL
        })
    }

    @Action({rawError : true})
    public async authStateChange(firebaseUser : FirebaseUser) {
        this.context.commit('SET_LOADING', (true));

        const firebaseUserInfo = firebaseUser.providerData[0]!;
        let user : User = {
            ...firebaseUserInfo,
            isAdmin : false,
            emailVerified : firebaseUser.emailVerified,
            isAnonymous : firebaseUser.isAnonymous,
            uid : firebaseUser.uid
        }
        if (user && user.uid)
        {
            firestore
                .collection('users')
                .doc(user.uid)
                .get();
            const role = await firestore
                .collection('roles')
                .doc(user.uid)
                .get();
            if (role.exists)
            {
                user = {...user, isAdmin : role.data()?.role === 'admin'};
            }
        }
        this.context.commit('SET_USER', (user));
        this.context.commit('SET_LOADING', (false));
    }
    @Action({rawError : true})
    public async signInWithGoogle()
    {
        return await firebaseAuth.signInWithPopup(GoogleAuthProvider);
    }

    @Action({rawError : true})
    public async signInWithEmail({email, password} : {email : string, password: string})
    {
        return await firebaseAuth.signInWithEmailAndPassword(email, password);
    }

    @Action({rawError : true})
    public async signUpWithEmail({email, password} : {email : string, password: string})
    {
        return await firebaseAuth.createUserWithEmailAndPassword(email, password);
        
    }

    @Action({rawError : true})
    public async signOut()
    {
        await firebaseAuth.signOut();
        this.context.commit('SET_USER', (null));
    }

}