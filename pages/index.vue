<template>
  <div class="flex lg:h-screen w-screen lg:overflow-hidden xs:flex-col lg:flex-row">
    <div class="relative lg:w-1/2 xs:w-full xs:h-84 lg:h-full post-left">
      <img
        src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2551&q=80"
        :alt="articles[0].alt"
        class="absolute h-full w-full object-cover"
      />
      <div class="overlay"></div>
      <div class="absolute top-32 left-32 text-white">
        <NuxtLink to="/"><Logo /></NuxtLink>
        <div class="mt-16 -mb-3 flex uppercase text-sm">
          <p class="mr-3">
            {{ formatDate(articles[0].updatedAt) }}
          </p>
          <span class="mr-3">•</span>
          <p>{{ articles[0].author.name }}</p>
        </div>
        <h1 class="text-6xl font-bold">{{ articles[0].title }}</h1>
      </div>
      <div class="flex absolute top-3rem right-3rem">
        <NuxtLink
          to="/"
          class="mr-8 self-center text-white font-bold hover:underline"
        >
          All articles
        </NuxtLink>
        <AppSearchInput />
      </div>
    </div>
    <div class="relative xs:py-8 xs:px-8 lg:py-32 lg:px-16 lg:w-1/2 xs:w-full h-full overflow-y-scroll markdown-body post-right custom-scroll">
    <TheHeader />
      <h1 class="font-bold text-4xl">Blog Posts</h1>
      <ul class="flex flex-wrap">
        <li
          v-for="article of articles"
          :key="article.slug"
          class="w-full px-2 xs:mb-6 md:mb-12 article-card"
        >
          <Card :article="article"/> 
        </li>
      </ul>
      <footer class="flex justify-center border-gray-500 border-t-2">
        <p class="mt-4">
          Created by
          <a
            href="https://twitter.com/debs_obrien"
            class="font-bold hover:underline"
            >Debbie O'Brien</a
          >
          at NuxtJS. See the
          <a
            href="https://nuxtjs.org/blog/creating-blog-with-nuxt-content"
            class="font-bold hover:underline"
            >tutorial</a
          >
          for how to build it.
        </p>
      </footer>
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
  }
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