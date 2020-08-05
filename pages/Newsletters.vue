<template>
  <div class="vx-row justify-center px-8">
    <h1 class="mb-12 text-title text-5xl mr-2">Newsletter Articles</h1>
    <VxCard v-for="n in numberOfArticles" >
      {{n}}
      <div class="w-full text-ginger mb-20">
        <h1 v-html="loaded? news[n-1].title:''"></h1>
        <p v-html="loaded? $md.render(news[n-1].content):''"></p>
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
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { newslettersStore } from '~/store'
import VxCard from '~/components/VxCard.vue'

@Component<Newsletters>({
  layout: 'main',
  components: { VxCard },
  async mounted() {
    this.GetNewsletters()
  }
})
export default class Newsletters extends Vue {
  numberOfArticles = 3
  loaded = false
  // contents:string[] = []
  // titles:string[] = []
  news = []
  async GetNewsletters() {
    const self = this
    try {
      const newsletters = await newslettersStore
        .GetNewsletters()
        .then(function (value) {
          if (value) {
            for (let i = 0; i < value.length; i++) {
              // self.contents[i] = (value[i].content);
              // self.titles[i] = (value[i].title);
              self.news[i] = {
                title: value[i].title,
                content: value[i].content
              }
              self.numberOfArticles = value.length;
              // banana.push(d)
              console.log(self.news[0])
            }
          }
        })
    } catch (error) {
      console.log({ error })
    }
    this.loaded = true
    return
    // console.log(this.note)
  }
}
</script>

<style lang="scss"></style>
