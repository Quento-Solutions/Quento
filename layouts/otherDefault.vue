<template>
  <div>
      <Sidebar/>
    <nuxt/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator'

import Sidebar from '~/components/Sidebar.vue'

@Component({ components : {
    Sidebar
}})
export default class Yee extends Vue 
{

}

</script>