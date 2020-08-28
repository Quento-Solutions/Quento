<template>
  <div class="vx-row w-full justify-between items-center flex-no-wrap" style="flex-wrap : nowrap">
    <!-- Profile Picture -->
    <div class="justify-start w-5/6 m-0 vx-row items-center" style="flex-wrap: nowrap">
      <div>
        <vs-avatar class="icon" @click.stop="$router.push(`/user/view/${userId}`)">
          <img v-if="photoURL" :src="photoURL" />
          <template slot="text" v-else>{{ username }}</template>
        </vs-avatar>
      </div>
      <div style="max-width: 70%" class="pl-3 md:pl-5">
        <!-- User name -->
        <div class="md:text-xl text-ginger-b truncate text-sm">{{ username }}</div>
        <div class="truncate text-sm">{{ formatDate(date) }}</div>
      </div>
    </div>

    <!-- Action Button -->
    <div v-if="hasActions">
      <vs-navbar-group id="menu-dots" @click.stop.prevent="() => false">
        <vs-avatar
          class="profileIcon icon"
          :badge="badge"
          badge-color="success"
          @click.stop.prevent="() => false"
        >
          <i class="bx bx-dots-horizontal" style="font-size: 1.25rem;" />
        </vs-avatar>
        <template #items>
          <slot name="items"></slot>
        </template>
      </vs-navbar-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component<AvatarBar>({ components: {} })
export default class AvatarBar extends Vue {
  @Prop({ default: '' }) username!: string
  @Prop({ type: Date, required: false }) date!: Date | null
  @Prop({ required: false }) photoURL!: string
  @Prop({ default: false }) badge!: boolean
  @Prop({ required: true }) userId!: string

  get hasActions() {
    return this.$slots.items
  }

  formatDate(date?: Date) {
    if (!date) return
    const dateString = date.toDateString()
    return dateString.slice(4, 10) + ',' + dateString.slice(10)
  }
}
</script>

<style lang="scss">
#menu-dots {
  .vs-navbar__group__item {
    padding: 0 !important;
  }
  .vs-navbar__group__items {
    left: auto !important;
    right: 0 !important;
  }
}
</style>