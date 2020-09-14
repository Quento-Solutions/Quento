<template>
  <VxCard class="my-2 p-0 mt-6">
    <div class="vx-row w-full">
      <!-- Title -->
      <div class="vx-row w-full justify-between">
        <!-- Profile Picture -->
        <AvatarBar
          :date="response.createdAt"
          :photoURL="response.userPhotoUrl"
          :username="response.userDisplayName"
          :userId="response.userId"
        ></AvatarBar>
      </div>
      <div class="vx-row w-full mt-4 lg:px-4" style>
        <div
          v-html="$md.render(response.contents)"
          id="notes-md"
          class="w-full text-ginger md-container"
        ></div>
      </div>
      <div class="w-full" style>
        <vs-avatar
          class="icon float-right"
          :color="userLiked ? 'danger' : '#f4f7f8'"
          badge-color="#7d33ff"
          @click.stop="toggleLike()"
        >
          <i class="bx bx-heart primary" :style="`color : ${userLiked ? 'white' : '#ff4757'}`"></i>
          <template #badge>{{ response.upVotes }}</template>
        </vs-avatar>
      </div>
    </div>
  </VxCard>
</template>

<script lang="ts">
import {Component, Vue, Prop, mixins} from 'nuxt-property-decorator'
import {Response} from '~/types/responses'
import {questionStore} from '~/store'
import UserMixin from '~/mixins/UserMixin'
import AvatarBar from '~/components/AvatarBar.vue'

@Component<ResponseCard>({components: {AvatarBar}})
export default class ResponseCard extends mixins(UserMixin) {
  @Prop({required: true}) response!: Response

  async toggleLike() {
    if (!this.response?.id || !this.response?.questionId) return
    const loading = this.$vs.loading()
    try {
      await questionStore.ToggleLikedResponse({
        questionId: this.response.questionId,
        responseId: this.response.id
      })
      if (this.userLiked) {
        this.response.upVotes++
      } else {
        this.response.upVotes--
      }
      this.$emit('toggle-like')
    } catch (error) {
      this.$qto.error(error);
    }
    loading.close()
  }

  get userLiked() {
    if (!this.response.id) return
    return this.UserData?.likedResponses?.includes(this.response.id)
  }
}
</script>
