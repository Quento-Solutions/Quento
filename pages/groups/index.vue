<template>
  <div class="vx-row w-full ml-8" id="newsletter-container">
    <span class="h-15 w-full mr-8 mb-4">
      <div class = 'text-white mb-4 text-ginger-b text-4xl w-full p-4'>
        YOUR GROUPS
      </div>
      <vs-button circle flat success animation-type="vertical" class="float-right mr-10 w-20">
        <div class="text-lg text-xs font-ginger-b">Join</div>
        <template #animate>
          <i class="bx bx-plus text-2xl"></i>
        </template>
      </vs-button>
      <vs-button circle flat success animation-type="vertical" class="float-right mr-10 w-20">
        <div class="text-lg text-xs font-ginger-b">Create</div>
        <template #animate>
          <i class="bx bx-plus text-2xl"></i>
        </template>
      </vs-button>
    </span>

    <div v-if="loaded" class="w-full lg:w-1/2" id="groupCard">
      <GroupCard v-for="(item, index) in groups" :key="index" :group="item"></GroupCard>
    </div>
    <!-- <vs-button warn @click="toggleNotesModal(true)" class="w-full">
      <div class="text-2xl font-ginger-b">
        &nbsp; Post New Note
      </div>
    </vs-button>-->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { groupsStore } from '~/store'
import NewsletterModal from '~/screens/newsletter/NewsletterModal.vue'
import NewsletterCard from '~/components/NewsletterCard.vue'
import GroupCard from '~/components/GroupCard.vue'

@Component<GroupsPage>({
  components: { GroupCard },
  mounted() {
    console.log('abanana')
    this.GetGroups()
  }
})
export default class GroupsPage extends Vue {
  numberOfArticles = 3
  loaded = false

  backgroundGradient(imageUrl: string) {
    return `background-image : linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`
  }

  //   toggleNotesModal(val: boolean) {
  //     groupsStore.SET_POST_MODAL_OPEN(val)
  //   }
  get groups() {
    return groupsStore.groupList
  }

  async GetGroups() {
    const loading = this.$vs.loading()
    try {
      await groupsStore.GetGroups()
    } catch (error) {
      console.log({ error })
    }
    loading.close()

    this.loaded = true
    return
  }
}
</script>

<style lang="scss">
#groupCard {
  display: grid;
  grid-template-columns: repeat(3, 500px);
  grid-gap: 10px;
}
</style>