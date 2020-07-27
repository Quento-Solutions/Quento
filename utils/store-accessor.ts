import { Store } from 'vuex'
import { getModule } from "vuex-module-decorators";
import window from "~/store/window";
import navigation from '~/store/navigation';

let windowStore : window;
let navigationStore : navigation;

function initialiseStores(store : Store<any>) : void {
    windowStore = getModule(window, store);
    navigationStore = getModule(navigation, store);
}

export { initialiseStores, windowStore, navigationStore }