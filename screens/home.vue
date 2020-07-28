<template>
<ScreenCard>
  <vs-row class="absolute w-full">
    <vs-col w="6" class="p-6 h-full border-solid" style="border-style: solid;">
      <h1 class="text-title text-5xl">&nbsp; &nbsp; Hi, I'm {{username}}</h1>
      <VxCard class="mt-6 p-4 px-8" actionButtons=true collapseAction=true removeAction=true title="A Little About Me">
        <p class="font-display introduction-p">
          &nbsp; &nbsp;{{ introductionText }}
        </p>
      <vs-row justify="flex-end" class="mt-8 justify-end">
        <vs-button gradient size="xl" class="text-title text-4xl mt-8 ml-6"  @click="firebaseLogin()">Take A Look Around &nbsp;
            <i class="bx bx-right-arrow-circle text-2xl"/>
        </vs-button>
      </vs-row>
      </VxCard>

    </vs-col> 

    <vs-col w="6" h="12" class="h-full">
      <div
        class="content-components overflow-hidden w-full"
        style="position: relative; height: 70vh;"
      >
        <VxCard
          class="overlay-card overflow-hidden card1 content-card"
          style="width: 400px; height: 300px; top: 20px;"
          contentFit="true"
        >
          <template slot="no-body">
            <img
              :src="require(`~/assets/images/cropped.jpg`)"
              alt="user-profile-cover"
              class="responsive rounded-md h-full w-full object-cover"
            />
          </template>
        </VxCard>
        <VxCard
          class="overlay-card overflow-hidden card2 content-card"
          noShadow="true"
          bodySizeStyles="padding: 0"
          style="
            background-color: rgba(0, 0, 0, 0);
            top: 30px;
            left: 450px;
            width: 100px;
            height: 100px;
          "
        >
          <template slot="no-body">
            <vs-avatar
              style="height: 90%; width: 90%; margin-left: 5%; margin-top: 5%;"
              badge
              badge-color="success"
            >
              <img
                :src="require(`~/assets/images/Profile.jpg`)"
                alt="user-profile-cover"
              />
            </vs-avatar>
          </template>
        </VxCard>

        <VxCard
          class="overlay-card overflow-hidden card4 content-card"
          bodyStyles="padding: 0.5rem;"
          style="height: 250px; width: 450px; top: 350px; left: 70px;"
          fitContent="true"
        >
          <template slot="no-body">
            <img
              :src="require(`~/assets/images/whiteboard.jpg`)"
              alt="whiteboard"
              class="responsive rounded-md h-full w-full object-cover"
            />
          </template>
        </VxCard>
        <VxCard
          class="overflow-hidden content-card card3"
          fitContent="true"
          style="top: 170px; left: 425px; width: 150px; height: 100px;"
        >
          <template slot="no-body">
            <div
              ref="player"
              class="media-video-player card-video video-player-box h-full"
              v-video-player:snowPlayer="playerOptions"
            />
          </template>
        </VxCard>
      </div>
    </vs-col>
  </vs-row>
</ScreenCard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import type { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'

import ScreenCard from './ScreenCard.vue';
import { getModule } from 'vuex-module-decorators';
import {authStore} from "~/store";
import VxCard from '~/components/VxCard.vue'

@Component<Home>({
  components: {
    VxCard, ScreenCard
  },
  mounted() {
    this.snowPlayer.play()
  }
})
export default class Home extends Vue {

  get username()
  {
    return authStore.user?.email;
  }
  async firebaseLogin() {
    authStore.signInWithGoogle();
  }
  introductionText =
    'Hi! My name is Jeffrey Li and I am a hard working life long learner looking to broaden my horizons. My main areas of interest are mathematics and physics, solving software challenges as well as UI/UX design, playing piano and music as a whole and mechanical build.'
  playerOptions: VideoJsPlayerOptions = {
    height: 200,
    fluid: true,
    width: 450,
    autoplay: true,
    muted: true,
    loop: true,
    controls: false,
    language: 'en',
    // playbackRates: [0.7, 1.0, 1.5, 2.0],
    sources: [
      { type: 'video/mp4', src: require('~/assets/video/snowyNight.mp4') }
    ]
    // poster: 'https://goo.gl/xcCsDd',
  }
  snowPlayer!: VideoJsPlayer
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/_main.scss';

.introduction-p {
  line-height: 2;
}
.content-components {
  @include keyframes(cardBounce) {
    0% {
      transform: translate(0px);
    }
    30% {
      transform: translate(0, -10px);
    }
    50% {
      transform: translate(0, 4px);
    }
    70% {
      transform: translate(0, -15px);
    }
    100% {
      transform: translate(0px);
    }
  }
  .content-card {
    position: absolute !important;
    // filter: drop-shadow(15px 15px 1px #528bce);
  }
  .card1 {
    @include animation('cardBounce 11s infinite');
  }
  .card2 {
    @include animation('cardBounce 8s infinite');
  }
  .card3 {
    @include animation('cardBounce 13s infinite');
  }
  .card4 {
    @include animation('cardBounce 9s infinite');
  }
  .video-player-box {
    // min-height : 200px;
  }
}
</style>
