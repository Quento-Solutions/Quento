<template>
  <nuxt-child></nuxt-child>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component<NotificationsGroup>({
  layout: 'main',
})
export default class NotificationsGroup extends Vue 
{
 
}
</script>