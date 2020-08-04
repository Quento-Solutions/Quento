<template>
  <nuxt-child></nuxt-child>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component<NotesGroup>({ components: {}, layout: 'main' })
export default class NotesGroup extends Vue {}
</script>
