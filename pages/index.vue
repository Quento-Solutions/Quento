<template>
  <div class="flex lg:h-screen w-screen overflow-hidden xs:flex-col lg:flex-row">
    <div class="relative lg:w-1/2 xs:w-full xs:h-84 lg:h-full post-left overflow-y-scroll custom-scroll">
      <img
        src="https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
        :alt="articles[0].alt"
        class="fixed h-full w-1/2 object-cover"
        style="z-index: -1"
      />
      <div class="overlay"></div>
      <div class="p-8 text-white">
        <NuxtLink to="/"><Logo /></NuxtLink>
        <div class="mt-16 -mb-3 flex uppercase text-sm">
          <p>Website By Jeffrey Li</p>
        </div>
        <h1 class="text-6xl font-bold">Stress Reduction Strategies</h1>
      <div class="w-2/3 text-white p-8" style="  background-color: rgba(0,0,0,0.5); top: 25%; left : 10%">
        <p class="">{{introductionText}}</p>
      </div>
      </div>

    </div>
    <div class="relative xs:py-8 xs:px-8 lg:py-32 lg:px-16 lg:w-1/2 xs:w-full h-full overflow-y-scroll markdown-body post-right custom-scroll">
    <TheHeader />
      <h1 class="font-bold text-4xl p-4 text-white" style="background-color: rgba(0,0,0,0.5);">Strategies</h1>
      <ul class="flex flex-wrap mt-4">
        <li
          v-for="article of articles"
          :key="article.slug"
          class="w-full px-2 xs:mb-6 md:mb-12 article-card"
        >
          <Card :article="article"/> 
        </li>
      </ul>

    </div>
  </div>
</template>


<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import {Context} from '~/store';
import Card from "~/components/Card.vue";

@Component({
  components : { Card }
})
export default class extends Vue {
  async asyncData({ $content, params } : Context) {
    const articles = await $content('articles', params.slug)
      .only(['title', 'description', 'img', 'slug', 'author'])
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      articles
    }
  }
  formatDate(date : Date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en', options)
  };

  introductionText = `  Stress is something that we all experience in one way or
  another, and can stem from a variety of sources. Be it from the workplace, finances, deadlines or relationships, 
  too much stress can have negative impacts on your health and wellbeing, in addition to your performance at work. 
  However, we don't have to just let stress build up and up in our lives until it feels like its too much - 
  this website presents steps and strategies that we can use to lower the impact of stress in our lives.
  `;
}
</script>

<style class="postcss">
.article-card {
  border-radius: 8px;
}
.article-card a {
  background-color: #fff;
  border-radius: 8px;
}
.article-card img div {
  border-radius: 8px 0 0 8px;
}
</style>