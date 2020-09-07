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

### Folders

- Assets
  - CSS/SCSS Files
  - Fonts
    - One Folder per font
      - all font files
      - a font style sheet
  - Images, the ones that are unique to each page
  - SVG files
  - Utils(not to be confused with ~\utils), idk either its a big mystery to me.

- Components
  - Elements within pages, like notes, groups, questions, etc.
- Layouts
  - Boilerplates
- Middleware
  - a very special plugin that won't go into the plugins folder
- Mixins
- Pages
  - All the pages of the site, in VUE
  - Each page has a folder with \_id.vue and index.vue 
- Plugins(self explainatory)
- Screens
  - The popups basically
  - All grouped by page
- Static
  - Sitewide images
- Store
  -Typescript files to locally store short term dynamic data, analogous to RAM
- Tests 🤷🏻‍♂️
- Types 
  - All the typescript files
- Utils (not to be confused with ~\assets\utils)

## An open letter to whoever needs to build a new page
Here is the default layout of the page (also at localhost:3000/basepiece or quento.ca/basepiece)
Enjoy!
```html
div Layout Main
  userGuideModal
  userInfoModal
  Sidebar
  div contentArea
    div contentOverlay
    div contentWrapper
      Navbar
      div Router View
        div Router Content
          transition thingy
          div content-area__content (ie. the content of the area of the content of the page, go naming departement)
            another transition
              (YOUR CONTENT HERE)
          /div
        /div
      /div
    /div
  /div
/div
/div
/div
/div
/div
/div
/div
(etc.)
```

## Documentation/Dependencies
For detailed explanation on how things work, checkout the following docs:

Vue: [Vue.js](https://vuejs.org/v2/guide/)
Nuxt: [Nuxt.js](https://nuxtjs.org/guide/installation/)
Vuesax: [Vuesax](https://vuesax.com/docs/components/Input.html#default)
Tailwind: [Tailwind.css](https://tailwindcss.com/docs/installation)
