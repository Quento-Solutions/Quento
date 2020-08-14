import type {NuxtConfig} from '@nuxt/types';
// import {sortRoutes}from '@nuxt/utils';
import { firebaseConfig } from './envars'
import path from 'path';
import fs from 'fs';

console.log(process.env.BASE_URL, process.env.host, process.env.port)

const config : NuxtConfig = {
  env: {
    baseUrl : process.env.BASE_URL || `${process.env.host}:${process.env.port}` || 'localhost:3000'
  },
  head: {
    title: 'Quento',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Welcome to Quento - a collection of utilities to enhance online learning created by students, for students.' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
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

    port : process.env.port || 3000,
    host : process.env.host || 'localhost',
  },
  router : {
    middleware : 'router-auth',
    routeNameSplitter: '/'
  },

  build: {
    transpile : ['vue-instantsearch', 'instantsearch.js/es']
  },
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
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit'
  ],
  plugins: [
    '@/plugins/vuesax',
    { src: '@/plugins/client_runtime', mode: 'client' },
    { src: '@/plugins/vue-video-player', ssr: false },
    '@/plugins/firebase',
    '@/plugins/firestore',
    '@/plugins/firebaseStorage',

    '@/plugins/fireauth',
    { src: "~/plugins/aos", ssr: false },
    '@/plugins/globalComponents',
   
  ],
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,

    injected : true
  },
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
