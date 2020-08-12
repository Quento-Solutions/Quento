<template>
  <nuxt-child></nuxt-child>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component<UserGroup>({ components: {}, layout: 'main' })
export default class UserGroup extends Vue {}
</script>
