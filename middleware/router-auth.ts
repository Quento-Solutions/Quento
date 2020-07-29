import type {Context, } from '@nuxt/types'
import type {Route} from 'vue-router'
export default function({store, redirect, route} : Context)
{
    console.log(route.name);
    store.state.auth.user != null && (route.name == 'Login' || route.name == null) ? redirect('/home') : '';
    store.state.auth.user == null && (isAdminRoute(route) || route.name == null) ? redirect('/login') : '';

}

function isAdminRoute(route : Route)
{
    if (route.matched.some(record => (record.path == "/home")))
    {
        return true
    }
}