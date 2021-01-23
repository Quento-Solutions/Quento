import type { Context } from '@nuxt/types'
import type { Route } from 'vue-router'

export default async function ({ store, redirect, route }: Context) {
    //REDIRECTION ONLY
    if(process.server || process.static){
        return
    }
    const validUser = (store.state.auth.user != null && store.state.auth.user.emailVerified)
    console.log("Going to " + route.name + (validUser ? "" :" not") + " as a valid user");

    // makes main page splash or home depending on if you are valid
    if (route.name == "index") {
        return validUser ? redirect("/home"): redirect("/splash");
    }
    
    // go home if you are already valid and you are being sent to auth
    if(validUser){
        if (route.name == null || route.name.split('/').some(record => record == 'auth')) {
            return redirect('/home')
        }
    }else{
        // makes invalid users either verify email(if haven't) or force login if path is inside app
        if(route.name == null || isAdminRoute(route)){
            if(store.state.auth.user && !store.state.auth.user.emailVerified){
                return redirect("/auth/verify-email")
            }
            const redirectPath = route.fullPath;
            // Records the proper link
            return redirect(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`)
        };
    }
}

function isAdminRoute(route: Route) {
    let adminSites = [
        "/Home", 
        "/Suggestions",
        "/notes", 
        "/questions", 
        "/newsletters", 
        "/user", 
        "/basepiece",
        "/groups",
        "/dashboard"
    ]
    return (route.matched.some(record => (adminSites.includes(record.path))))
}
