<template>
  <nuxt-child></nuxt-child>
</template>
<script lang="ts">
import {Component, Vue, Prop, mixins} from 'nuxt-property-decorator'

import AnalyticsMixin from '~/mixins/AnalyticsMixin'

@Component<NotesGroup>({
  components: {},
  layout: 'main',
  name: 'NotesGroup'
})
export default class NotesGroup extends mixins(AnalyticsMixin) {
  logPage = true
}
</script>
