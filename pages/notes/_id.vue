<template>
  <div class="vx-row w-full justify-center" style="">
    <div class="vx-row w-full md:w-2/3 p-4" style="">
      <div class="vx-col w-full display-none md:inline-flex" style="">
        <div class="vx-row mb-4 w-full bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
      </div>
        <NotesCard :note="note" v-if="note">
        </NotesCard>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import NotesCard from '~/components/NotesCard.vue';
import {Note} from '~/types/notes'


const html = `# Quento

## Description
Welcome to Quento, a collection of utilities created by students, for students. Quento is an open source web app created by high school students using Vue.js, with the sole purpose of creating and compiling useful software to a single location to help students better manage their education.  

## Build Setup
\`\`\`
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
\`\`\`
`


@Component<NotesContentPage>({
  components: { NotesCard },
  layout: 'main',
  mounted() {
    this.fetchNotes();
  }
})
export default class NotesContentPage extends Vue {

    note : Note | null = null;
  fetchNotes() {
      this.note = Note.fromFirebase({
      title:
        'KubeCon + CloudNativeCon Virtual - August 17-20, 2020 - Connect from Anywhere',
      uid: '192hs983',
      userDisplayName: 'Raheem Al-Ahmed ',
      images: ['https://cdn-demo.algolia.com/bestbuy-0118/5477500_sb.jpg', 'https://images.unsplash.com/photo-1596450902102-0875071b55ca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1353&q=80','https://images.unsplash.com/photo-1596449212953-4ca53eca4822?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80' ],

      userPhotoUrl:
        'https://lh3.googleusercontent.com/a-/AOh14Ggj2FcgQxSBMwipYEazz4XFF3LqGlZZboUwHHKY',
      createdAt: new Date(),

      contents: html,
      upVotes: 0,
      views: 0,
      subject : 'Physics',
      grade : 11,
    }, "ujfioje92");

  }
  goBack()
  {
      this.$router.back();
  }
}
</script>
