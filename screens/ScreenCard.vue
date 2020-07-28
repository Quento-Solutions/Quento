<template>
  <Card
    style="position: absolute; width: 53%; height: 57%; top: 17%; left: 23.7%;"
    data-aos="flip-up"
  >
    <template slot="no-body"><slot></slot></template>
  </Card>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Card from '~/components/VxCard.vue'
@Component({
    components : { Card }
})
export default class ScreenCard extends Vue {}
</script>


