<template>
  <nuxt-child></nuxt-child>
</template>

<script lang="ts">
  import { Vue, Component, mixins } from 'nuxt-property-decorator'
  import { groupsStore } from '~/store'
  import VxCard from '~/components/VxCard.vue'
  import NewsletterModal from '~/screens/newsletter/NewsletterModal.vue'
  import PostNotesModal from '~/screens/notes/PostNotesModal.vue'
  import groupsModal from '~/screens/groupsModal.vue';

  import Analytics from '~/mixins/AnalyticsMixin';


  @Component<GroupsPage>({
    layout: 'main',
    components: { VxCard, groupsModal, PostNotesModal},
    name : "GroupsPage"
  })
  export default class GroupsPage extends mixins(Analytics) 
  {
  logPage = true;
  }
</script>
