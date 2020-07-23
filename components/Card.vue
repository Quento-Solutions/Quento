<template>
  <NuxtLink
    :to="{ name: 'blog-slug', params: { slug: article.slug } }"
    class="flex transition-shadow duration-150 ease-in-out shadow-sm hover:shadow-md xxlmax:flex-col rounded-md overflow-hidden"
  >
    <img
      v-if="article.img"
      class="h-48 xxlmin:w-1/2 xxlmax:w-full object-cover"
      :src="article.img"
    />

    <div
      class="p-6 flex flex-col justify-between xxlmin:w-1/2 xxlmax:w-full"
    >
      <h2 class="font-bold">{{ article.title }}</h2>
      <p class="font-bold text-gray-600 text-sm">
        {{ article.description }}
      </p>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from "nuxt-property-decorator"
import type { Article } from "~/types";

@Component({})
export default class Card extends Vue {
  @Prop() article!: Article
}
</script>

<style scoped>
.card {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana,
    sans-serif;
  padding: 1rem;
  margin: 0.25rem;
  border: 0.25rem solid gainsboro;
}
</style>
