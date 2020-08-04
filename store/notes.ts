import {
  Module,
  VuexModule,
  MutationAction,
  Action,
  Mutation
} from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import type { firestore as store } from 'firebase'
import { firestore as YEE } from 'firebase/app'
import { authStore } from './index'

import { Suggestion, Suggestion_t_F } from '~/types/suggestions'
import firebase from '~/plugins/firebase'
type QueryType = store.Query<store.DocumentData>

@Module({ stateFactory: true, name: 'notes', namespaced: true })
export default class NotesModule extends VuexModule {
    PreviewModalOpen = false;
    NotesModuleOpen = false;

    @Mutation
    private TOGGLE_NOTES_MODULE(val : boolean)
    {
        this.NotesModuleOpen = val;
    }

    @Action({rawError : true})
    public ToggleNotesModule( val : boolean )
    {
        this.TOGGLE_NOTES_MODULE(val);
    }

    @Mutation
    private TOGGLE_PREVIEW_MODAL(val : boolean)
    {
        this.PreviewModalOpen = val;
    }

    @Action({rawError : true})
    public TogglePreviewModal( val : boolean )
    {
        this.TOGGLE_PREVIEW_MODAL(val);
    }
}