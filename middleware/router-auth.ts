import type {Context, } from '@nuxt/types'
import type {Route} from 'vue-router'
export default function({store, redirect, route} : Context)
{
    route.matched
    console.log({route : route.name, user : store.state.auth.user?.displayName} )

    if(store.state.auth.user != null && (route?.name?.split('/').some(record => record == 'auth') || route.name == null))
    {
        redirect('/home')
    }
    if(store.state.auth.user == null && (isAdminRoute(route) || route.name == null)) {
        redirect('/auth/login')
    };

}

function isAdminRoute(route : Route)
{
    if (route.matched.some(record => (record.path == "/Home" || record.path == "/Suggestions")))
    {
        return true
    }
}