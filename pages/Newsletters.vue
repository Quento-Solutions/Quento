<template>
  <div class="vx-row justify-center px-8">
    <h1 class="mb-12 text-title text-5xl mr-2">Newsletter Articles</h1>
    <vs-button warn @click="toggleNotesModal(true)" class="w-full">
        <i class="bx bxs-plus-square text-4xl" />
        <div class="text-2xl font-ginger-b">
          &nbsp; Post New Note 
        </div>
      </vs-button>
    <div v-if="loaded">
      <VxCard v-for="(item, index) in newsletters" :key="index" class="mb-6 w-24 min-w-full">
        <div class="w-full text-ginger mb-20">
          <h1 class="text-center">{{item.title}}</h1>
          <span class="mb-5">Author: {{item.Author}}</span>
          <div v-html="$md.render(item.content)" class="md-container"></div>
        </div>
        <!-- <div class="w-full text-ginger mb-20">
        <h1 v-html="loaded? news[].title:''"></h1>
        <p v-html="loaded? $md.render(news[1].content):''"></p>
      </div>
      <div class="w-full text-ginger mb-20">
        <h1 v-html="loaded? news[2].title:''"></h1>
        <p v-html="loaded? $md.render(news[2].content):''"></p>
        </div>-->
      </VxCard>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { newslettersStore } from '~/store'
import VxCard from '~/components/VxCard.vue'

@Component<NewslettersPage>({
  layout: 'main',
  components: { VxCard },
  async mounted() {
    this.GetNewsletters()
  }
})
export default class NewslettersPage extends Vue {
  numberOfArticles = 3
  loaded = false

  toggleNotesModal(val: boolean) {
    console.log("banana")
    newslettersStore.ToggleNotesModule(val)
  }
  get newsletters() {
    return newslettersStore.newsletterList
  }

  async GetNewsletters() {
    const self = this
    const loading = this.$vs.loading()
    try {
      await newslettersStore.GetNewsletters()
    } catch (error) {
      console.log({ error })
    }
    loading.close()

    this.loaded = true
    return
    // console.log(this.note)
  }
}
</script>

<style lang="scss">
.md-container {
  font-family: 'Quicksand', sans-serif !important;
  word-wrap: break-word;

  img {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'ginger-bold', 'Trebuchet MS', 'Lucida Sans Unicode',
      'Lucida Grande', 'Lucida Sans', Arial, sans-serif !important;
    font-weight: 200 !important;
    margin-bottom: 2rem !important;
  }
  p {
    margin-bottom: 2rem !important;
    font-weight: 500 !important;
  }

  blockquote {
    margin-left: -10px !important;
    padding-left: 23px !important;
    box-shadow: rgb(41, 41, 41) 3px 0px 0px 0px inset !important;
    p {
      font-style: italic !important;
    }
  }
  pre > code {
    margin-bottom: 2rem !important;
    background-color: #eeeeee;
    border-radius: 0.5rem;
    padding: 1rem;
  }
  ul,
  ol {
    li {
      font-weight: 500 !important;
    }
    margin-left: 2rem;
    margin-bottom: 1rem;
    list-style-type: symbols();
    p {
      margin-bottom: 0.5rem !important;
    }
    ol {
      list-style-type: lower-roman;
    }

    ul,
    ol {
      ol {
        list-style-type: lower-alpha;
      }
    }
  }
}
</style>
