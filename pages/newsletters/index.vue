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
      <VxCard
        v-for="(item, index) in newsletters"
        :key="index"
        class="mb-6 w-24 min-w-full"
      >
        <template slot="no-body">
          <nuxt-link :to="`/newsletters/${item.id}`">
            <div
              class="text-white flex flex-col justify-between items-center background-cover p-10 h-full"
              :style="backgroundGradient(item.backgroundImageUrl)"
              style="min-height: 20vw;"
            >
              <div
                class="text-white mb-4 text-ginger-b text-4xl w-full"
                style="line-height: 1.125;"
              >
                {{ item.title }}
              </div>
              <div class="vx-row w-full" style="">
                <vs-avatar class="icon">
                  <img v-if="item.authorPhotoUrl" :src="item.authorPhotoUrl" />
                  <template #text v-else>
                    {{ item.authorDisplayName }}
                  </template>
                </vs-avatar>
                <div class="vx-row w-3/4 flex-wrap pl-4">
                  <div
                    class="w-full text-ginger truncate font-semibold"
                    style=""
                  >
                    {{ item.authorDisplayName }}
                  </div>
                  <div class="w-full text-ginger truncate font-light" style="">
                    {{ item.createdAt.toDateString() }}
                  </div>
                </div>
              </div>
            </div>
          </nuxt-link>
        </template>
      </VxCard>
    </div>
    <!-- <vs-button warn @click="toggleNotesModal(true)" class="w-full">
      <div class="text-2xl font-ginger-b">
        &nbsp; Post New Note
      </div>
    </vs-button> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { newslettersStore } from '~/store'
import VxCard from '~/components/VxCard.vue'
import NewsletterModal from '~/screens/newsletter/NewsletterModal.vue'

@Component<NewslettersPage>({
  components: { VxCard, NewsletterModal },
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
