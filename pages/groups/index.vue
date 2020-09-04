<template>
  <div> <!-- Yay we need a root because fun vue -->
    <!-- TITLE AND CREATE CARDS? -->
    <div class = "mb-10 pt-8" style = "width:60%">
      <div class = 'mb-3 text-black font-extrabold text-6xl text-open'>
        Groups
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed augue lorem, interdum a maximus ut, luctus vel justo. Maecenas sit amet massa purus. Quisque eu mattis nibh, in commodo turpis. Aenean turpis ante, porta non euismod at, maximus eu justo. Curabitur nec gravida libero. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus ac molestie neque. Etiam vitae rutrum nisi, eget feugiat est.
      </p>
    </div>

    <!--
    Right Buttons
    <vs-button circle flat success animation-type="vertical" class=" inline-block float-right mr-10 w-20">
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
    -->

    <!-- CARDS -->
    <div v-if="loaded" class="flex flex-row justify-around border-4 border-solid" id="groupCard">
      <GroupCard v-for="(item, index) in groups" :key="index" :group="item"></GroupCard>
    </div>
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