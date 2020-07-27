import  AOS from 'aos';
import 'aos/dist/aos.css';
import * as Nuxt from "@nuxt/types";
AOS.init();

if (process.client)
{
    window.onNuxtReady(() => {

    })
}