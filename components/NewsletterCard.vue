<template>
  <VxCard v-if="newsletter" class="mb-6 w-24 min-w-full">
    <template slot="no-body">
      <nuxt-link :to="`/newsletters/${newsletter.id}`">
        <div
          class="text-white flex flex-col justify-between items-center background-cover md:p-10 p-4 h-full"
          :style="backgroundGradient(newsletter.backgroundImageUrl)"
          style="min-height: 20vw;"
        >
          <div
            class="text-white mb-4 text-ginger-b text-4xl w-full p-4"
            style="line-height: 1.125;"
          >
            {{ newsletter.title }}
          </div>
          <div class="vx-row w-full py-6" style="">
            <vs-avatar class="icon">
              <img
                v-if="newsletter.authorPhotoUrl"
                :src="newsletter.authorPhotoUrl"
              />
              <template #text v-else>
                {{ newsletter.authorDisplayName }}
              </template>
            </vs-avatar>
            <div class="vx-row flex-wrap pl-4" style="max-width: 75%;">
              <div class="w-full text-ginger truncate font-semibold" style="">
                {{ newsletter.authorDisplayName }}
              </div>
              <div class="w-full text-ginger truncate font-light" style="">
                {{ newsletter.createdAt.toDateString() }}
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
    </template>
  </VxCard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Newsletter } from '~/types/newsletters'

@Component<NewsletterCard>({ components: {} })
export default class NewsletterCard extends Vue {
  @Prop({ required: true }) newsletter!: Newsletter

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`
  }
}
</script>
