<template>
  <div id="home-page">
    <VxCard class="greet-user">
      <template slot="no-body">
        <div class="titleContainer vx-row w-full md:p-8 p-0">
          <!-- Featured Content -->
          <div class="w-full lg:w-1/3 col lg:px-1">
            <VxCard v-if="featuredNewsletter">
              <div
                class="flex flex-row md:flex-no-wrap flex-wrap w-full justify-center items-center"
              >
                <div class="flex flex-row flex-no-wrap justify-center items-center" style>
                  <VxTooltip>
                    <vs-avatar class="icon" style="flex-shrink: 0;">
                      <img
                        v-if="featuredNewsletter.authorPhotoUrl"
                        :src="featuredNewsletter.authorPhotoUrl"
                      />
                      <template #text v-else>{{ featuredNewsletter.authorDisplayName }}</template>
                    </vs-avatar>
                    <template #tooltip>{{ featuredNewsletter.authorDisplayName }}</template>
                  </VxTooltip>
                  <div class="vx-row flex-wrap pl-4" style="min-width: 0;">
                    <div class="w-full text-ginger font-semibold text-xl" style>Newsletter</div>
                    <div
                      class="w-full text-ginger font-light md:mt-1 mt-0 text-gray-700"
                      style
                    >Welcome to Quento! Read about our first big update</div>
                  </div>
                </div>

                <div
                  class="flex-shrink-0 w-full md:w-auto flex flex-row justify-center mt-4 md:mt-0"
                >
                  <vs-button
                    gradient
                    color="rgb(159, 122, 234)"
                    @click="$router.push(`/newsletters/${featuredNewsletter.id}`)"
                  >
                    <span class="text-ginger p-2 text-xl">Read&nbsp;Now</span>
                  </vs-button>
                </div>
              </div>
            </VxCard>
            <VxCard class="mt-4 overflow-hidden" :fitContent="true">
              <template #no-body>
                <a href="https://www.theauxilium.com/" target="_blank">
                  <div>
                    <div
                      class="justify-between items-center background-cover"
                      :style="AuxiliumImage"
                      style="height: 200px"
                    ></div>
                    <div class="p-4">
                      <h1 class="text-ginger-b">Auxilium Mentorship Program</h1>
                      <div
                        class="text-ginger p-4 text-gray-600"
                        style="line-height:1.5"
                      >{{AuxiliumText.substring(0,200)}}...</div>
                      <div class="float-right pb-4">
                        <a to="https://www.theauxilium.com/">Learn More</a>
                      </div>
                    </div>
                  </div>
                </a>
              </template>
            </VxCard>
            <VxCard class="mt-6 overflow-hidden" :fitContent="true">
              <template #no-body>
                <a href="https://www.youtube.com/channel/UCAP7VmyGvC0xS3jErySLQNQ" target="_blank">
                  <div
                    class="justify-between items-center background-cover"
                    :style="SBBImage"
                    style="height: 200px"
                  ></div>
                  <div class="p-4">
                    <h1 class="text-ginger-b">School But Better</h1>
                    <div
                      class="text-ginger p-4 text-gray-600"
                      style="line-height:1.5"
                    >{{SBBText}}</div>
                    <div class="float-right pb-4">
                      <a to="https://www.youtube.com/channel/UCAP7VmyGvC0xS3jErySLQNQ">Learn More</a>
                    </div>
                  </div>
                </a>
              </template>
            </VxCard>
          </div>

          <!-- Feed -->
          <div class="w-full lg:w-2/3 mt-6 lg:mt-0 lg:px-1 col" v-if="notesList">
            <div v-for="(item, index) in notesList" :key="index">
              <NotesCard :note="item.docData" :clickable="true" :preview="true" v-if="item.dataType ==='note'"/>
              <QuestionCard :question="item.docData" :clickable="true" :preview="true" v-if="item.dataType ==='question'"/>
            </div>
          </div>
        </div>
      </template>
    </VxCard>
  </div>
</template>

<script lang="ts">
import { Vue, Component, mixins } from 'nuxt-property-decorator'

import { windowStore, authStore, newslettersStore, feedsStore } from '~/store'
import NewsletterCard from '~/components/NewsletterCard.vue'
import NotesCard from '~/components/NotesCard.vue'
import QuestionCard from '~/components/QuestionCard.vue'


import Analytics from '~/mixins/AnalyticsMixin'

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
  components: { NewsletterCard, NotesCard, QuestionCard },
  async mounted() {
    newslettersStore.GetNewsletters()
    try {
      await feedsStore.GetMoreNotes(true)
    } catch(error)
    {
      this.$qto.error(error);
    }
  },
  name: 'Home'
})
export default class Home extends mixins(Analytics) {
  logPage = true

  get featuredNewsletter() {
    return newslettersStore?.newsletterList[0]
  }

  get AuxiliumImage() {
    return `background-image : url("${require('~/assets/images/Auxilium.png')}")`
  }
  AuxiliumText =
    'Quento is excited to announce that we will be featuring Auxilium’ s mentorship Program. Auxilium is a virtual peer mentorship program for students in Ottawa, Ontario (however, we are looking to expand in the future). Our team will match mentees to mentors depending on needs and strengths. Our mentors are qualified middle and high students who wish to give back to their community. High school mentors are also eligible for volunteer and CAS hours. They must have at least an 85% in their mentoring subjects. Mentee applications are opened to everyone in the Ottawa area. '

  SBBImage =
    'background-image : url("https://lh3.googleusercontent.com/-YN27kTK8hLk/X1LbR5gA7JI/AAAAAAAADbw/VpxYFnTRQSA9rraPIXzCgw19oiLcSntCwCK8BGAsYHg/s0/2020-09-04.png");'
  SBBText =
    `School is dumb - but you don't have to be.
We make videos to make school easier under the conditions of COVID-19.
Just videos, not necessarily good ones.`

  get notesList() {
    return feedsStore.ActiveItems
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
      toolTipText: 'Quento Github',
      backgroundColor: '#000000',
      color: 'white'
    },
    {
      name: 'Instagram',
      imageUrl: require(`~/assets/images/QuentoLogoMain.png`),
      href: 'https://www.instagram.com/quento.ca/',
      toolTipText: 'Learn More About Quento',
      iconClass: 'bx bxl-instagram',
      backgroundColor: '#e1306c',
      color: '#FFFFFF'
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
    }
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
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.containerImage {
  transform: translateY(-25%);
}
</style>
