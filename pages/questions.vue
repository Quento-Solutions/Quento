<template>
  <div>
    <nuxt-child></nuxt-child>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component<QuestionsGroup>({ components: {}, layout: 'main' })
export default class QuestionsGroup extends Vue {

}
</script>
