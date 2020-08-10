<template>
  <div class="vx-row justify-center px-8">
    <h1 class="mb-12 text-title text-5xl mr-2">Newsletter Articles</h1>
    <div v-if="loaded">
    <VxCard v-for="(item, index) in newsletters" :key="index" class="mb-6">
      <div class="w-full text-ginger mb-20">
        <h1>{{item.title}}</h1>
        <div v-html="$md.render(item.content)" class="markdown-content"></div>
      </div>
      <!-- <div class="w-full text-ginger mb-20">
        <h1 v-html="loaded? news[].title:''"></h1>
        <p v-html="loaded? $md.render(news[1].content):''"></p>
      </div>
      <div class="w-full text-ginger mb-20">
        <h1 v-html="loaded? news[2].title:''"></h1>
        <p v-html="loaded? $md.render(news[2].content):''"></p>
      </div> -->
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

  get newsletters()
  {
    return newslettersStore.newsletterList;
  }

  async GetNewsletters() {
    const self = this
    const loading = this.$vs.loading();
    try {
      await newslettersStore.GetNewsletters();
    } catch (error) {
      console.log({ error })
    }
    loading.close();

    this.loaded = true
    return
    // console.log(this.note)
  }
}
</script>

<style lang="scss">

.markdown-content{

  color : pink !important;
}


</style>
