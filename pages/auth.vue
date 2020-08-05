<template>
  <nuxt-child />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component<AuthGroup>({ components: {}, layout: 'auth' })
export default class AuthGroup extends Vue {}
</script>
