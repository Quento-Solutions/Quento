import { Store } from 'vuex'
import { initialiseStores,  authStore } from '~/utils/store-accessor'

const initializer = (store : Store<any>) => initialiseStores(store);
export const plugins = [initializer];
export * from '~/utils/store-accessor';

import type { Context as AppContext, } from "@nuxt/types";

export const actions = {
    async nuxtServerInit({}, ctx : AppContext) {
        console.log("NUXT SERVER INIT");
        console.log(ctx.res.locals);
        if(ctx.res && ctx.res.locals && ctx.res.locals.user)
        {
            initialiseStores(ctx.store);
            const { allClaims : claims, idToken : token, ...authUser } = ctx.res.locals.user;
            authStore.serverAuthStateChangeAction(ctx.res.locals.user) ;
        }
    }

}
export type Context = AppContext;

