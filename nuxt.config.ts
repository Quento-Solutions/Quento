import type {NuxtConfig} from '@nuxt/types';
import { firebaseConfig } from './envars'

const config : NuxtConfig = {
  env: {},
  head: {
    title: 'We Need A Title',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '{{ description }}' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: { color: '#3B8070' },
  css: [
    '~/assets/css/main.css',
    'vuesax/dist/vuesax.css',
    'aos/dist/aos.css',
    'boxicons/css/boxicons.min.css',
    'video.js/dist/video-js.css',
    'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css',
    "~/assets/scss/main.scss",
  ],
  server:
  {
    port : 4000
  },
  router : {
    middleware : 'router-auth'
  },

  build: {},
  buildModules: [
    '@nuxt/typescript-build',
    // '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
    'nuxt-composition-api'
  ],
  modules: [
    '@nuxt/content',
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/firebase',
    '@nuxtjs/pwa'
  ],
  plugins: [
    '@/plugins/vuesax',
    { src: '@/plugins/client_runtime', mode: 'client' },
    { src: '@/plugins/vue-video-player', ssr: false },
    '@/plugins/firebase',
    '@/plugins/firestore',
    '@/plugins/fireauth',
   
  ],
  pwa : {
    meta : false,
    icon : false,
    workbox: {
      importScripts: [
        // ...
        '/firebase-auth-sw.js'
      ],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: false
    }
  },
  content: {},
  firebase: {
    config: firebaseConfig,
    services: {
      auth: {
        ssr : true
        },
      firestore: true,
      functions: true,
      storage: true,
      analytics: true
      // Just as example. Can be any other service.
    }
  },
  styleResources: {
    scss: ['./assets/scss/*.scss']
  },
  axios: {}
}

export default config
