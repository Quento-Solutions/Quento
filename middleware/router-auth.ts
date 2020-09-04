import type { Context } from '@nuxt/types'
import type { Route } from 'vue-router'

export default function ({ store, redirect, route }: Context) {
    // if(route.name == null) redirect ('/')

    const validUser = (store.state.auth.user != null && store.state.auth.user.emailVerified)
    console.log('\n')
    console.log("Going to " + route.name + (""?validUser:" not") + " as a valid user");

    // makes main page splash or home depending on if you are valid
    if (route.name == "index") {
        console.log("case 1")
        return !validUser ? redirect("/splash") : redirect("/home");
    }
    
    // go home if you are already valid and you are being sent to auth
    if ((validUser) && (route.name == null || route?.name?.split('/').some(record => record == 'auth'))) {
        console.log("case 2")
        return redirect('/home')
    }

    // makes invalid users either verify email(if haven't) or force login if path is inside app
    if(!validUser && (route.name == null || isAdminRoute(route)))
    {
        if(store.state.auth.user && !store.state.auth.user.emailVerified)
        {
            console.log("case 3a")
            return redirect("/auth/verify-email")
        }
        console.log("case 3b")
        const redirectPath = route.fullPath;
        // Records the proper link
        return redirect(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`)
    };
    console.log('\n')
}

function isAdminRoute(route: Route) {
    let adminSites = [
        "/Home", 
        "/Suggestions",
        "/notes", 
        "/questions", 
        "/newsletters", 
        "/user", 
        "/basepiece"
    ]
    return (route.matched.some(record => (adminSites.includes(record.path))))
}
