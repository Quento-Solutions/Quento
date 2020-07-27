// import {NuxtConfig} from '@nuxt/types';

const config =  {
  env: {},
  head: {
    title: "Jeffrey Li",
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
  css: ["~/assets/css/main.css", "vuesax/dist/vuesax.css", 'aos/dist/aos.css', 'boxicons/css/boxicons.min.css', "video.js/dist/video-js.css"],
  
  build: {},
  buildModules: [
    "@nuxt/typescript-build",
    // '@nuxtjs/stylelint-module',
    "@nuxtjs/tailwindcss",
    'nuxt-composition-api'
  ],
  modules: [
    "@nuxt/content",
    "@nuxtjs/axios",
    "@nuxtjs/style-resources"
  ],
  plugins: [
    "@/plugins/vuesax",
    { src : "@/plugins/client_runtime", mode : "client"},
    {src : "@/plugins/vue-video-player", ssr : false}
  ],
  content : {

  },
  styleResources : {
    scss : ['./assets/scss/*.scss']
  },
  axios: {}
}

export default config;