<template>
  <div class="vx-row justify-center w-full" id="newsletter-container">
    <VxCard class="mb-6 w-24 min-w-full">
      <template slot="no-body">
        <div
          class="text-white flex flex-col justify-center items-center background-cover py-10"
          :style="
            backgroundGradient(
              'https://cdn.discordapp.com/attachments/738198413987938464/744678215406321674/mountains-moon-trees-minimalism-hd.jpg'
            )
          "
        >
          <div class="w-full vx-row justify-center">
            <img
              :src="require('~/assets/images/quentotypeface.png')"
              class="lg:w-1/3 w-5/6 md:w-1/2 xl:w-1/4 center"
            />
          </div>
          <div class="text-white text-title text-6xl">Quento Blog</div>
        </div>
      </template>
    </VxCard>
    <NewsletterModal></NewsletterModal>

    <div v-if="loaded" class="w-full lg:w-1/2">
     <NewsletterCard v-for="(item, index) in newsletters" :key="index" :newsletter="item"></NewsletterCard>
    </div>
    <vs-button warn @click="toggleNotesModal(true)" class="w-full">
      <div class="text-2xl font-ginger-b">
        &nbsp; Post New Note
      </div>
    </vs-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { newslettersStore } from '~/store'
import NewsletterModal from '~/screens/newsletter/NewsletterModal.vue'
import NewsletterCard from '~/components/NewsletterCard.vue';

@Component<NewslettersPage>({
  components: { NewsletterModal, NewsletterCard },
  mounted() {
    this.GetNewsletters()
  }
})
export default class NewslettersPage extends Vue {
  numberOfArticles = 3
  loaded = false

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`
  }

  toggleNotesModal(val: boolean) {
    newslettersStore.SET_POST_MODAL_OPEN(val)
  }
  get newsletters() {
    return newslettersStore.newsletterList
  }

  async GetNewsletters() {
    const loading = this.$vs.loading()
    try {
      await newslettersStore.GetNewsletters()
    } catch (error) {
      console.log({ error })
    }
    loading.close()

    this.loaded = true
    return
  }
}
</script>

<style lang="scss">
</style>
