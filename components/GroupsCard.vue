<template>
  <VxCard v-if="group" class="mb-6 w-24 min-w-full" @click="PushGroupsPage()">
    <template slot="no-body">
      <nuxt-link :to="`/groups/${group.id}`">
        <div
          class="text-white flex flex-col justify-between items-center background-cover md:p-10 p-4 h-full"
          :style="backgroundGradient(group.backgroundImageUrl)"
          style="min-height: 25vw;"
        >
          <div
            class="text-white mb-4 text-ginger-b text-4xl w-full p-4"
            style="line-height: 1.125;"
          >
            {{ group.title }}
          </div>
          <div class="vx-row w-full py-6" style="">
            <vs-avatar class="icon">
              <img
                v-if="group.authorPhotoUrl"
                :src="group.authorPhotoUrl"
              />
              <template #text v-else>
                {{ group.authorDisplayName }}
              </template>
            </vs-avatar>
            <div class="vx-row flex-wrap pl-4" style="max-width: 75%;">
              <div class="w-full text-ginger truncate font-semibold" style="">
                {{ group.authorDisplayName }}
              </div>
              <div class="w-full text-ginger truncate font-light" style="">
                {{ group.createdAt.toDateString() }}
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
    </template>
  </VxCard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Group } from '~/types/groups'

@Component<GroupCard>({ components: {} })
export default class GroupCard extends Vue {
  @Prop({ required: true }) group!: Group

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`
  }
  PushGroupsPage()
  {
    this.$router.push(`/groups/g/${this.group?.id}`)
  }
}
</script>
