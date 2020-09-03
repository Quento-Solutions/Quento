<template>
  <VxCard
    fitContent="true"
    id="list-card"
    :no-shadow="true"
    card-border="true"
    class="cursor-pointer previewClickable relative"
  >
    <!-- Card Header -->
    <template slot="no-body">
      <div
        class="vx-row w-full justify-between items-center flex-no-wrap p-2"
        style="flex-wrap : nowrap"
        @click="$emit('click')"
      >
        <!-- Profile Picture -->
        <div class="justify-start w-full m-0 vx-row items-center" style="flex-wrap: nowrap">
          <div>
            <VxTooltip>
              <vs-avatar class="icon" @click.stop="$router.push(`/user/view/${item.userId}`)">
                <img v-if="item.userPhotoUrl" :src="item.userPhotoUrl" />
                <template slot="text" v-else>{{ item.userDisplayName }}</template>
              </vs-avatar>
              <template #tooltip>{{ item.userDisplayName }}</template>
            </VxTooltip>
          </div>
          <div class="px-3 md:px-5" style="min-width:0">
            <!-- User name -->

            <slot name="title">
              <div class="md:text-xl text-ginger-b truncate text-sm">{{ item.title }}</div>
            </slot>
            <slot name="description">
              <div class="truncate text-sm">{{ item.contents }}</div>
            </slot>
          </div>
        </div>
      </div>
    </template>
    <!-- Category Pills -->
  </VxCard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { ListItem} from '~/types/interface'
@Component<NotesCard>({
  components: {},
  mounted() {}
})

export default class NotesCard extends Vue {
  @Prop({ required: true }) item!: ListItem;
  formatDate(date?: Date) {
    if (!date) return
    const dateString = date.toDateString()
    return dateString.slice(4, 10) + ',' + dateString.slice(10)
  }
}
</script>
<style lang="scss">
mark {
  font-size: inherit !important;
}
</style>
