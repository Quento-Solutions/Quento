<template>
  <div id="newsletter-content-container">
    <div class="vx-row justify-center w-full" v-if="group">
      <VxCard class="mb-6 w-24 min-w-full">
        <template slot="no-body">
          <div
            class="text-white flex flex-col background-cover p-4 w-full"
            :style="backgroundGradient(group.backgroundImageUrl)"
            style="min-height: 20vw;"
          >
            <div class="vx-row mb-4 w-full lg:w-1/2 rounded-md p-2">
              <vs-avatar class="icon-small float-right" @click="goBack()">
                <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
              </vs-avatar>
            </div>
            <div
              class="text-white text-title text-6xl font-medium"
              style="line-height: 1.125;"
            >{{ group.title }}</div>
          </div>
        </template>
      </VxCard>
      <!-- <div class="vx-col">
        <div class="vx-row justify-center w-full">
          <div class="vx-row mb-4 w-full lg:w-1/2 xs:bg-white rounded-md p-2">
            <vs-avatar class="icon-small float-right" @click="goBack()">
              <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
            </vs-avatar>
          </div>
        </div>
        <div class="vx-row justify-center w-full">
          <div class="vx-row w-full bg-white rounded-md lg:w-1/2">
            <div class="md-container p-4 md:p-6 lg:p-8" v-html="$md.render(newsletter.contents)"></div>
          </div>
        </div>
      </div>-->
    </div>

    <vs-alert color="danger" v-if="docNotFound">
      <template #title>Something Went Wrong</template>
      <b>Sorry!</b> Something went wrong when fetching the Newsletter. Please Try
      Again.
    </vs-alert>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'
import firestore from '~/plugins/firestore'
import {Group, Group_t_F} from '~/types/groups'

@Component<GroupsSummary>({
  components: {},
  mounted() {
    this.fetchGroup()
  }
})
export default class GroupsSummary extends Vue {
  groupId: string | null = null
  docNotFound = false
  group: Group | null = null

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}')`
  }
  async fetchGroup() {
    //   this.group!.bac
    const loading = this.$vs.loading()
    this.groupId = this.$route.params.id
    if (!this.groupId) {
      this.$router.push('/groups')
      return
    }
    try {
      const doc = await firestore.doc(`groups/${this.groupId}`).get()
      const groupData = doc.data() as Group_t_F
      if (!groupData) {
        this.docNotFound = true
        loading.close()
        return
      }
      this.group = Group.fromFirebase(groupData, doc.id)
      loading.close()
      return
    } catch (error) {
      console.log({error})
      loading.close()
    }
  }
}
</script>