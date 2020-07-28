<template>
    <ScreenCard>
    </ScreenCard>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import {windowStore} from '~/store'

import ScreenCard from './ScreenCard.vue'
@Component({
    components : { ScreenCard }
})
export default class Blank extends Vue {
  get titleText()
  {
    const b = windowStore.windowHeight;
    const a = windowStore.constrainingDimension
    return `${b} ${a}`
  }
}
</script>


