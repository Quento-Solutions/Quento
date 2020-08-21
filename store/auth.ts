import {
    Module,
    VuexModule,
    MutationAction,
    Action,
    Mutation
} from 'vuex-module-decorators';

import type { User as FirebaseUser} from 'firebase'
import type {FireAuthServerUser} from '@nuxtjs/firebase'
import { User, UserData } from '~/types/user';
import firestore from '~/plugins/firestore';
import { firebaseAuth, GoogleAuthProvider } from '~/plugins/firebase';

export interface AuthState {
    user : User;
    loading : boolean;
}

@Module({ stateFactory: true, name: 'auth', namespaced: true })
export default class AuthModule extends VuexModule implements AuthState {
    user : User = null;
    userData : UserData | null = null;
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
        console.log("SERVER AUTH STATE CHANGE ACTION")
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

        this.context.commit('SET_USER', (user));
        await this.refreshUserData();
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
        try
        { return await firebaseAuth.signInWithEmailAndPassword(email, password);
        } catch(error)
        {
            throw(error)
        }

    }

    @Action({rawError : true})
    public async signUpWithEmail({email, password, name} : {email : string, password: string, name:string})
    {
        // try
        // { return await firebaseAuth.createUserWithEmailAndPassword(email, password)
        //     // .then((userInfo) =>{ userInfo.user.updateProfile({displayName: name}).then(firebaseAuth.currentUser.reload()).then(() => {console.log(firebase.auth().currentUser.displayName)});
        // } catch(error)
        // {
        //     throw(error)
        // }

        await firebaseAuth.createUserWithEmailAndPassword(email, password).catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('in use')
            }
        
            else if (error.code === 'auth/invalid-email') {
                console.log('invalid email')
            }
            console.log(error);
          }).then((userInfo) =>{ userInfo.user.updateProfile({displayName: name})})
        
    }

    @Action({rawError : true})
    public async signOut()
    {
        await firebaseAuth.signOut();
        this.context.commit('SET_USER', (null));
    }

    @Mutation
    private SET_USER_DATA(userData : UserData | null)
    {
        this.userData = userData;
    }
    @Action({rawError : true})
    public async refreshUserData()
    {
        if(!this.user || !this.user.uid) {
            this.SET_USER_DATA(null);
            return;
        };

        const fetchedUserData = await firestore.collection("users").doc(this.user.uid).get();
        this.SET_USER_DATA(fetchedUserData.data() as UserData);
        return;
    }
}