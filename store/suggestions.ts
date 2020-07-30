import { Module, VuexModule, MutationAction, Action, Mutation,  } from "vuex-module-decorators";
import firestore from "~/plugins/firestore"
        
import {authStore} from './index';        

@Module({ stateFactory : true, name : "suggestions", namespaced : true})
export default class SuggestionsModule extends VuexModule {


    @Mutation 
    private SET_SUGGESTIONS()
    {

    }
    
    @Action
    public async GetSuggestions(page : number = 0)
    {
        const suggestionsRefs = await firestore.collection("suggestions").get();
        const suggestions = suggestionsRefs.docs.map(doc => doc.data());
        console.log({suggestions});
    }


    @Action
    public async PostSuggestion({title, contents} : {title : string, contents : string})
    {
        const createdAt = new Date();
        const {uid, displayName} = authStore.user!;

        const docData = {
            title, contents, createdAt, upVotes : 0, userDisplayName : displayName, uid
        }
        const docRef = await firestore.collection('suggestions').add(docData);

    }
}