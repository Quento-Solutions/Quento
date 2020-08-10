<template>
  <div id="home-page">
    <vs-row justify="center">
      <vs-col class="vx-col w-full">
        <VxCard
          class="text-center greet-user py-8"
          title-color="#fff"
          content-color="#fff"
          :card-background="
            'linear-gradient(120deg, rgba(91, 85, 215, 1.0), rgba(197, 68, 252, 0.5)), url(' +
            require(`~/assets/images/homepageBackground.png`) +
            ')'"
        >
        <template slot="no-body">
          <div class="my-16 titleContainer">
            <div>
          <img
            src="~/assets/images/QuentoLogoMain.png"
            class="p-6 inline-flex rounded-full text-white center h-64"
            alt="Logo"/>
            </div>
            <div>
            <h1 class="mb-12 text-white text-title title">
            QUENTO 
          </h1>
          </div>
          </div>

          <!-- <feather-icon icon="AwardIcon" class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow" svgClasses="h-8 w-8"></feather-icon> -->
          <div class="vx-row justify-center px-8">

          <!-- <vs-avatar style="width : 5rem; height : 5rem;">
              <img src="https://vignette.wikia.nocookie.net/leagueoflegends/images/6/6a/LoR_Cheers_Emote.png/revision/latest/top-crop/width/300/height/300?cb=20200429081948"/>
            </vs-avatar> -->
          </div>
          
          <vs-row justify="center" class="vx-row mt-10">
            <div class="p-6 vx-row md:justify-end justify-center w-full md:w-1/2">
              <vs-button
                type="filled"
                color="#aba6e0"
                class="vx-col shadow-md  m-4 text-bold"
                style="font-weight : bold"
                size="xl"
                @click ="pushNewsletter()"
                >Subscribe To News Letter
                </vs-button>
            </div>
            <div w=6 class="p-6 vx-row md:w-1/2 w-full md:justify-start justify-center">
              <vs-button
                color="#aba6e0"
                class="vx-col shadow-md m-4 text-bold"
                style="font-weight : bold"
                size="xl"
                @click="PushSuggestionsPage()"
                >
                Suggest Features
              </vs-button>
            </div>
          </vs-row>
        </template>
        </VxCard>
      </vs-col>
    </vs-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { windowStore, authStore } from '~/store'

// import VxCard from '~/components/VxCard.vue'

@Component({
  layout: 'main',
  components: {  }
})
export default class Home extends Vue {
  pushComingSoon()
  {
    this.$router.push('/coming-soon');
  }
  PushSuggestionsPage()
  {
    this.$router.push("/suggestions");
  }
  pushNewsletter()
  {
    this.$router.push("/newsletters");
  }

}
</script>

<style scoped>
.title {
font-family:ginger-bold;
font-size:14rem;
}
.titleContainer {
  display:flex;
  justify-content: center;
}

@media only screen and (max-width: 1200px) {
.title {
font-family:ginger-bold;
font-size:10rem;
}
.titleContainer {
  flex-direction: column;
  align-items: center;

}
}

@media only screen and (max-width: 767px) {
.title {
font-family:ginger-bold;
font-size:15vw;
}
}
</style>
