import type { Context } from '@nuxt/types'
import type { Route } from 'vue-router'

export default function ({ store, redirect, route }: Context) {
    // if(route.name == null) redirect ('/')
    const validUser = (store.state.auth.user != null && store.state.auth.user.emailVerified)
    console.log(route.name);
    if (route.name == "index") {
        return !validUser ? redirect("/splash") : redirect("/home");
    }

    if ((validUser) && (route.name == null || route?.name?.split('/').some(record => record == 'auth'))) {
        return redirect('/home')
    }
    if(!validUser && (route.name == null || isAdminRoute(route)))
    {
        if(store.state.auth.user && !store.state.auth.user.emailVerified)
        {
            return redirect("/auth/verify-email")
        }
        const redirectPath = route.fullPath;
        // Records the proper link
        return redirect(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`)
    };
}

function isAdminRoute(route: Route) {
    if (route.matched.some(record => (record.path == "/Home" || record.path == "/Suggestions" || record.path == "/notes" || record.path == "/questions" || record.path == "/newsletters" || record.path == "/user" || record.path=="/groups"))) {
        return true
    }
    return false
}
