<template>
  <vs-row align="center" justify="space-around" class="footer-card px-6 py-2" style="">
    <vs-tooltip v-for="(item, index) in contactInformation" :key="index">
        <vs-avatar  size="64" :color="item.backgroundColor" @click="pushWebsite(item.href)" >
            <i :class="item.iconClass" :style='`font-size: 2rem; color: ${item.color}`' ></i>
        </vs-avatar>
        <template #tooltip>
            {{item.toolTipText}}
        </template>
    </vs-tooltip>
  </vs-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import VxCard from './VxCard.vue'

// :style="`border-width: 0.2rem; border-color: ${item.color}; border-style: solid`"

export interface ContactInformation 
{
    name : string;
    href ?: string;
    imageUrl : string;
    iconClass ?: string;
    toolTipText ?: string;

    backgroundColor ?: string;
    color ?: string;
    border ?: boolean;
}

@Component({
  components: {
    VxCard
  }
})
export default class FooterCard extends Vue {

    contactInformation : ContactInformation[] = [
        {
            name : "Github",
            href : "https://github.com/DrCheddar",
            imageUrl : require(`~/assets/images/github-logo.png`),
            iconClass : "bx bxl-github",
            toolTipText : 'https://github.com/DrCheddar',
            backgroundColor : "#000000",
            color : "white"
        },
        {
            name : "Discord",
            imageUrl : require(`~/assets/images/github-logo.png`),
            iconClass : "bx bxl-discord",
            toolTipText : "drcheddar#4883",
            backgroundColor : "#7289DA",
            color : "#FFFFFF",
            border : true,
        },

    ]

    pushWebsite(website ?: string) 
    {
        console.log(website);
        if(website) window.open(website);
    }
}
</script>

<style lang="scss" scoped>
.footer-card {
  transform: translate(-50%, 0%);
  position: fixed;
  background-color: white;
  border-radius: 0.5rem;
  align-items: center;
  top: 86%;
  height: auto;
  left: 50%;
  width: auto;
  min-width: 20%;
}
</style>
