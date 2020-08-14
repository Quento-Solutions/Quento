<template>
  <VxCard>
    <div class="vx-row w-full">
      <div class="vx-row w-full justify-between " style="flex-wrap: nowrap">
        <!-- Profile Picture -->
        <div class="justify-start w-1/2 m-0">
          <div class="vx-row w-full justify-start items-center overflow-hidden">
            <div class="vx-col">
              <vs-tooltip class="inline-block">
                <vs-avatar class="icon">
                  <img
                    v-if="response.userPhotoUrl"
                    :src="response.userPhotoUrl"
                  />
                  <template #text v-else>
                    {{ response.userDisplayName }}
                  </template>
                </vs-avatar>
                <template #tooltip>
                  {{ response.userDisplayName }}
                </template>
              </vs-tooltip>
            </div>
            <div class="vx-col">
              <!-- User name -->
              <div class="text-xl text-ginger-b">
                <div class="">
                  {{ response.userDisplayName }}
                </div>
              </div>
              <div class="truncate">
                  {{ response.createdAt.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
        <vs-avatar
          class="icon"
          :color="false ? 'danger' : '#f4f7f8'"
          badge-color="#7d33ff"
        >
          <i
            class="bx bx-heart primary"
            :style="`color : ${false ? 'white' : '#ff4757'}`"
          ></i>
          <template #badge>
            {{ response.upVotes }}
          </template>
        </vs-avatar>
      </div>
      <div class="vx-row w-full p-4" style="">
        <div
          v-html="$md.render(response.contents)"
          id="notes-md"
          class="w-full text-ginger p-2 md-container"
        ></div>
      </div>
    </div>
  </VxCard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Response } from '~/types/responses'

@Component<ResponseCard>({ components: {} })
export default class ResponseCard extends Vue {
  @Prop({ required: true }) response!: Response
}
</script>
