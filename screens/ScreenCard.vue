<template>
  <Card style="" class="screen-card absolute" data-aos="flip-up" fitContent="true">
      <template slot="no-body">
        <perfect-scrollbar :options="scrollbarOptions" watchOptions class='scroll-area' style="width: 100%;  height : 100%">
            <slot></slot>
        </perfect-scrollbar>
      </template>
  </Card>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { windowStore } from '~/store'

import type {} from 'perfect-scrollbar';
import Card from '~/components/VxCard.vue'
@Component({
  components: { Card }
})
export default class ScreenCard extends Vue {

  scrollbarOptions = {
    wheelPropagation : false,
  }

}
</script>

<style lang="scss" scoped>
.screen-card {
  // overflow-y: scroll;
  width: 53%;
  height: 57%;
  top: 27.5%;
  left: 23.7%;
}


</style>
