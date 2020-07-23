// import {NuxtConfig} from '@nuxt/types';

const config =  {
  env: {},
  head: {
    title: "template",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "{{ description }}" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },
  loading: { color: "#3B8070" },
  css: ["~/assets/css/main.css"],
  build: {},
  buildModules: [
    "@nuxt/typescript-build",
    '@nuxtjs/stylelint-module',
    "@nuxtjs/tailwindcss",
    'nuxt-composition-api'
  ],
  modules: [
    "@nuxt/content",
    "@nuxtjs/axios",
  ],
  content : {

  },
  axios: {}
}

export default config;