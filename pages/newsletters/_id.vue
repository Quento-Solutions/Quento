<template>
  <div id="newsletter-content-container">
    <div class="vx-row justify-center w-full" v-if="newsletter">
      <VxCard class="mb-6 w-24 min-w-full">
        <template slot="no-body">
          <div
            class="text-white flex flex-col justify-center items-center background-cover p-10 w-full"
            :style="backgroundGradient(newsletter.backgroundImageUrl)"
            style="min-height: 30vw;"
          >
            <div
              class="text-white text-title text-6xl font-medium"
              style="line-height: 1.125;"
            >
              {{ newsletter.title }}
            </div>
            <div class="vx-row w-full justify-center p-6" style="">
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
        </template>
      </VxCard>
      <div class="vx-col">
         <div class="vx-row justify-center w-full">
        <div class="vx-row mb-4 w-full lg:w-1/2 xs:bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>
         </div>
        <div class="vx-row justify-center w-full">
      <div class="vx-row w-full bg-white rounded-md lg:w-1/2" >
        <div
          class="md-container p-4 md:p-6 lg:p-8"
          v-html="$md.render(newsletter.contents)"
        ></div>
      </div>
        </div>
      </div>
    </div>

    <vs-alert color="danger" v-if="docNotFound">
      <template #title>
        Something Went Wrong
      </template>
      <b>Sorry!</b> Something went wrong when fetching the Newsletter. Please Try
      Again.
    </vs-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Newsletter, Newsletter_t_F } from '~/types/newsletters'
import firestore from '~/plugins/firestore'

@Component<NewsletterContentPage>({
  components: {},
  mounted() {
    this.FetchNewsletter()
  }
})
export default class NewsletterContentPage extends Vue {
  newsletterId: string | null = null
  newsletter: Newsletter | null = null
  docNotFound = false

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}')`
  }

  async FetchNewsletter() {
    this.newsletterId = this.$route.params.id
    if (!this.newsletterId) return this.$router.push('/notes')
    const loading = this.$vs.loading()
    try {
      const doc = await firestore.doc(`newsletters/${this.newsletterId}`).get()
      const newsletterData = doc.data() as Newsletter_t_F
      if (!newsletterData) {
        this.docNotFound = true
        loading.close()
        return
      }
      this.newsletter = Newsletter.fromFirebase(newsletterData, doc.id)
      loading.close()
      return
    } catch (error) {
      console.log({ error })
      loading.close()
    }
  }
  goBack() {
    this.$router.push('/newsletters')
  }
}
</script>
