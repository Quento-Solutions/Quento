<template>
  <vs-row
    align="center"
    justify="space-around"
    class="footer-card px-6 py-2"
    style=""
  >
    <vs-tooltip v-for="(item, index) in contactInformation" :key="index">
      <vs-avatar
        class="bottomIcon"
        :color="item.backgroundColor"
        @click="pushWebsite(item.href)"
      >
        <i
          :class="item.iconClass"
          :style="`font-size: 2vw; color: ${item.color}`"
          v-if="item.iconClass"
        ></i>
        <img v-else :src="item.imageUrl" />
      </vs-avatar>
      <template #tooltip>
        {{ item.toolTipText }}
      </template>
    </vs-tooltip>
  </vs-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import VxCard from './VxCard.vue'

// :style="`border-width: 0.2rem; border-color: ${item.color}; border-style: solid`"

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
  components: {
    VxCard
  }
})
export default class FooterCard extends Vue {
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
      name: 'Quento',
      imageUrl: require(`~/assets/images/QuentoLogoMain.png`),
      toolTipText: 'Learn More About Quento',
      backgroundColor: '#7289DA',
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

  pushWebsite(website?: string) {
    if (website) window.open(website)
  }
}
</script>

<style lang="scss" scoped>
.footer-card {
  transform: translate(-50%, 0%);
  margin-top:1vw;
  margin-bottom:1vw;
  background-color: white;
  border-radius: 0.5rem;
  align-items: center;
  top: 87%;
  height: auto;
  left: 50%;
  width: auto;
  min-width: 60%;

  .bottomIcon {
    width: 3.5vw;
    height: 3.5vw;
  }

    @media only screen and (max-width: 1200px) {
      .bottomIcon {
    width: 5vw;
    height: 5vw;
  }
  .bottomIcon i{
    font-size: 3vw !important;
  }
    }
   @media only screen and (max-width: 850px) {
      .bottomIcon {
    width: 10vw;
    height: 10vw;
  }
  .bottomIcon i{
    font-size: 6vw !important;
  }
    }
}
</style>
