import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { firestore as FirestoreModule } from 'firebase/app'
import {authStore} from '~/store';
@Module({ stateFactory: true, name: 'userGuide', namespaced: true })
export default class UserGuideModule extends VuexModule {
    UserGuideClosed = false;

    public get showUserGuide()
    {
        return !(this.UserGuideClosed || authStore.userData?.userGuideClosed)
    }
    @Mutation
    public SET_GUIDE_CLOSED(val : boolean)
    {
        this.UserGuideClosed = val;
    }
    
    @Action({rawError : true})
    public async SetUserGuideClosed(value : boolean)
    {
        await firestore.collection('users').doc(authStore.CurrentUser?.uid).update({
            userGuideClosed : value
        });
        return await authStore.refreshUserData();
    }
}