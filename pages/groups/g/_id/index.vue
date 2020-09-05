<template>
  <div id="newsletter-content-container">
    <div class="vx-row justify-center w-full" v-if="group">
      <VxCard class="mb-6 w-24 min-w-full">
        <template slot="no-body">
          <div
            class="text-white flex flex-col background-cover p-4 md:p-8 w-full"
            :style="backgroundGradient(group.backgroundImageUrl)"
            style="min-height: 20vw;"
          >
            <input
              class="text-white text-title text-6xl font-medium"
              style="line-height: 1.125;"
              :readonly="true"
              v-model="group.title"
            />
          </div>
        </template>
      </VxCard>
      <div class="w-full vx-row bg-white rounded-md">
        <div class="vx-row mb-4 w-full justify-around p-2 border-b-2 border-black">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
          <vs-button-group>
            <vs-button transparent :active="active=='Summary'">
              <div class="text-xl px-2 text-ginger">Summary</div>
            </vs-button>
            <vs-button transparent :active="active=='Notes'">
              <div class="text-xl px-2 text-ginger">Notes</div>
            </vs-button>
            <vs-button transparent :active="active=='Questions'">
              <div class="text-xl px-2 text-ginger">Questions</div>
            </vs-button>
          </vs-button-group>
        </div>
        <!-- Summary -->

        <div class="w-full md:w-2/3 p-4 md:px-8">

          <h1 class="text-title">Description</h1>
          <div class="mt-4">{{group.description}}</div>
        </div>

        <!-- Member List -->
        <div class="vx-row justify-center w-full md:w-1/3">
          <div class="vx-row w-full bg-white rounded-md lg:w-1/2">
            <div class="p-4 md:p-6 lg:p-8"></div>
          </div>
        </div>
      </div>
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

  active: 'Questions' | 'Summary' | 'Notes' = 'Summary'

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