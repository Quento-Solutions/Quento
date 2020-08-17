<template>
  <div id="home-page">
    <vs-row justify="center">
      <vs-col class="vx-col w-full">
        <VxCard class="greet-user" content-color="#fff">
          <template slot="no-body">
            <div class="titleContainer vx-row w-full p-8">
              <div class="vx-col w-full lg:w-1/4 sm:w-1/2" style="">
                <img
                  src="~/assets/images/quento_bird.png"
                  class="p-6 inline-flex center w-full"
                  alt="Logo"
                />
              </div>

              <div
                class="vx-col w-full md:w-1/2 p-8 flex flex-col justify-around"
                style=""
              >
                <div class="text-title text-6xl text-black" style="">
                  Title Content
                </div>
                <div class="text-title text-4xl text-black my-10" style="">
                  Title Content
                </div>
                <div class="vx-row w-full justify-around" style="">
                  <vs-tooltip
                    v-for="(item, index) in contactInformation"
                    :key="index"
                  >
                    <vs-avatar
                      class="bottomIcon rounded-full cursor-pointer"
                      style="width: 5vmax; height: 5vmax;"
                      :color="item.backgroundColor"
                      @click="pushWebsite(item.href)"
                    >
                      <i
                        :class="item.iconClass"
                        :style="`font-size: 4vmax; color: ${item.color}`"
                        v-if="item.iconClass"
                      ></i>
                      <img v-else :src="item.imageUrl" />
                    </vs-avatar>
                    <template #tooltip>
                      {{ item.toolTipText }}
                    </template>
                  </vs-tooltip>
                </div>
              </div>

              <!-- Newsletter -->
              <div class="vx-col w-full lg:w-1/4 flex flex-col justify-around" style="">
              <div class="w-full text-ginger-b text-black text-4xl my-6" style="">
                Newsletter
              </div>
                <NewsletterCard :newsletter="featuredNewsletter" v-if="featuredNewsletter"></NewsletterCard>
              </div>

              <!-- Videos -->
              <div
                class="text-ginger-b w-full p-4 text-3xl text-black"
                style=""
              >
                Featured
              </div>
              <div class="vx-row w-full p-2 md:p-6" style="">
                <swiper
                  :options="swiperOption"
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  :key="$vs.rtl"
                  style="width: 100%; height: 100%;"
                >
                
                  <swiper-slide
                    v-for="(item, index) in featuredContent"
                    :key="index"
                  >
                    <div class="" style="padding-bottom: 56.25%;">
                      <iframe
                        style="
                          width: 100%;
                          height: 100%;
                          position: absolute;
                          left: 0px;
                          top: 0px;
                        "
                        frameborder="0"
                        width="100%"
                        class="rounded-md"
                        :src="item.videoUrl"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </div>
                  </swiper-slide>
                  <div class="swiper-pagination" slot="pagination"></div>
                  <div class="swiper-button-prev" slot="button-prev"></div>
                  <div class="swiper-button-next" slot="button-next"></div>
                </swiper>
              </div>
            </div>
          </template>
        </VxCard>
      </vs-col>
    </vs-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { windowStore, authStore, newslettersStore } from '~/store'
import NewsletterCard from '~/components/NewsletterCard.vue'

export interface ContactInformation {
  name: string
  href?: string
  imageUrl: string
  iconClass?: string
  toolTipText?: string

  backgroundColor?: string
  color?: string
  border?: boolean
}

@Component({
  layout: 'main',
  components: { NewsletterCard },
  mounted()
  {
    newslettersStore.GetNewsletters();
  }
})
export default class Home extends Vue {

  get featuredNewsletter()
  {
    return newslettersStore?.newsletterList[0];
  }

  pushComingSoon() {
    this.$router.push('/coming-soon')
  }
  PushSuggestionsPage() {
    this.$router.push('/suggestions')
  }
  contactInformation: ContactInformation[] = [
    {
      name: 'Github',
      href: 'https://github.com/Quento-Solutions/Quento',
      imageUrl: require(`~/assets/images/github-logo.png`),
      iconClass: 'bx bxl-github',
      toolTipText: 'https://github.com/Quento-Solutions/Quento',
      backgroundColor: '#000000',
      color: 'white'
    },
    {
      name: 'Instagram',
      imageUrl: require(`~/assets/images/QuentoLogoMain.png`),
      toolTipText: 'Learn More About Quento',
      iconClass: 'bx bxl-instagram',
      backgroundColor: '#e1306c',
      color: '#FFFFFF',
      href: '/splash'
    },
    {
      name: 'Discord',
      imageUrl: require(`~/assets/images/github-logo.png`),
      iconClass: 'bx bxl-discord',
      toolTipText: 'Quento Discord Invite',
      backgroundColor: '#7289DA',
      color: '#FFFFFF',
      border: true,
      href: 'https://discord.gg/pfyFWus'
    }
  ]
  swiperOption = {
    slidesPerView: 3,
    spaceBetween: 50,
    allowTouchMove: false,
    lazy: true,
    // init: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      1024: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 20
      }
    }
  }
  featuredContent = [
    {
      name: 'Why is Physics so Hard?',
      videoUrl: 'https://www.youtube.com/embed/qKa9ooHHcNw'
    },
    {
      name: 'Onlines School Explained',
      videoUrl: 'https://www.youtube.com/embed/tsNHpmlAfO4'
    },
    {
      name: 'Chemistry Fundamentals',
      videoUrl: 'https://www.youtube.com/embed/7YJvx6dlq6M'
    },

  ]

  pushWebsite(website?: string) {
    if (website) window.open(website)
  }
}
</script>

<style scoped>
.title {
  font-family: ginger-bold;
  font-size: 14rem;
}
.titleContainer {
  display: flex;
  justify-content: center;
  line-height: 1.125;
}

@media only screen and (max-width: 1200px) {
  .title {
    font-family: ginger-bold;
    font-size: 10rem;
  }
  .titleContainer {
    flex-direction: column;
    align-items: center;
  }
}

@media only screen and (max-width: 767px) {
  .title {
    font-family: ginger-bold;
    font-size: 15vw;
  }
}
</style>
