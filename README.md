# Quento

## Description
Welcome to Quento, a collection of utilities created by students, for students. Quento is an open source web app created by high school students using Vue.js, with the sole purpose of creating and compiling useful software to a single location to help students better manage their education.  

## Build Setup
```
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

## Sitemap (Addresses from Quento\pages)

- Splash Screen (Splash.vue)
- Login Page (\auth\Login.vue)
- Signup Page (\auth\SignUp.vue)
  - Eula (\auth\Eula.vue)

- Home Page (Home.vue) 
- Notes Page (Notes.vue)
  - \notes\_id.vue
  - \notes\index.vue
  - ~\screens\notes\EditNotesModal.vue
  - ~\screens\notes\PostNotesModal.vue
  - ~\screens\notes\PreviewNotesModal.vue
  - ~\mixins\AnalyticsMixin
- Questions (questions.vue)
  - \questions\_id.vue
  - \questions\index.vue
  - ~\screens\questions\PostQuestionModal.vue
  - ~\screens/questions/PreviewQuestionModal.vue
- Newsletter Page/Blog (newletters.vue)
  - \newsletters\_id.vue
  - \newsletters\index.vue
  - ~\screens\newsletter\NewsletterModal.vue
  - ~\mixins\AnalyticsMixin
- Suggestions Page (Suggestions.vue)
  - ~\screens\SuggestionModal.vue


## Documentation/Dependencies
For detailed explanation on how things work, checkout the following docs:

Vue: [Vue.js](https://vuejs.org/v2/guide/)
Nuxt: [Nuxt.js](https://nuxtjs.org/guide/installation/)
Vuesax: [Vuesax](https://vuesax.com/docs/components/Input.html#default)
Tailwind: [Tailwind.css](https://tailwindcss.com/docs/installation)
