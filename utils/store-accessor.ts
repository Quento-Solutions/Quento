import { Store, ModuleTree} from 'vuex'
import { getModule } from "vuex-module-decorators";
import window from "~/store/window";
import navigation from '~/store/navigation';
import auth from '~/store/auth';
import suggestions from '~/store/suggestions'
import notes from '~/store/notes';
import userGuide from '~/store/userGuide';
import questions from '~/store/questions';

let windowStore : window;
let navigationStore : navigation;
let authStore : auth;
let suggestionsStore : suggestions;
let notesStore : notes;
let userGuideStore : userGuide;
let questionStore : questions;

function initialiseStores(store : Store<any>) : void {
    windowStore = getModule(window, store);
    navigationStore = getModule(navigation, store);
    authStore = getModule(auth, store);
    suggestionsStore = getModule(suggestions, store)
    notesStore = getModule(notes, store);
    userGuideStore = getModule(userGuide, store);
    questionStore = getModule(questions, store);
}

export { initialiseStores, windowStore, navigationStore, authStore, suggestionsStore, notesStore, userGuideStore, questionStore }