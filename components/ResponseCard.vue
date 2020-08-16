<template>
  <VxCard class="my-2">
    <div class="vx-row w-full">
      <div class="vx-row w-full justify-between" style="flex-wrap: nowrap;">
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
          :color="userLiked ? 'danger' : '#f4f7f8'"
          badge-color="#7d33ff"
          @click.stop="toggleLike()"
        >
          <i
            class="bx bx-heart primary"
            :style="`color : ${userLiked ? 'white' : '#ff4757'}`"
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
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import { Response } from '~/types/responses'
import { questionStore } from '~/store'
import UserMixin from '~/mixins/UserMixin'

@Component<ResponseCard>({ components: {} })
export default class ResponseCard extends mixins(UserMixin) {
  @Prop({ required: true }) response!: Response

  async toggleLike() {
    if (!this.response?.id || !this.response?.questionId) return
    const loading = this.$vs.loading()
    try {
      await questionStore.ToggleLikedResponse({
        questionId: this.response.questionId,
        responseId: this.response.id
      })
      if(this.userLiked) {
          this.response.upVotes++;
          }
      else {this.response.upVotes--;}
      this.$emit('toggle-like')
    } catch (error) {
      this.$vs.notification({
        color: 'danger',
        message: error.message
      })
      console.log({ error })
    }
    loading.close()
  }

  get userLiked() {
      console.log(this.UserData?.likedResponses, this.response.id);
    if (!this.response.id) return;
    return this.UserData?.likedResponses?.includes(this.response.id)
  }
}
</script>
