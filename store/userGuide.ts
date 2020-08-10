import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import { firestore as FirestoreModule } from 'firebase/app'

@Module({ stateFactory: true, name: 'userGuide', namespaced: true })
export default class UserGuideModule extends VuexModule {
    UserGuideClosed = false;

    @Mutation
    public SET_GUIDE_CLOSED(val : boolean)
    {
        this.UserGuideClosed = val;
    }
    
}