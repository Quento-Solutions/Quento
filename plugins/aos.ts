import AOS from 'aos'
import 'aos/dist/aos.css'
import 'aos/dist/aos.css'
import type { Plugin } from '@nuxt/types'
const a: Plugin = ({ app }) => {
  app.AOS = AOS.init({
    // disableMutationObserver : true,
  }) // or any other options you need
}

export default a

if (process.client) {
  window.onNuxtReady(() => {})
}
