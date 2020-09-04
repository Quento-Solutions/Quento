<template>
  <div>
    <GroupModal></GroupModal>

    <nuxt-child></nuxt-child>
  </div>
</template>

<script lang="ts">
import { Vue, Component, mixins } from 'nuxt-property-decorator'
import { groupsStore } from '~/store'
import VxCard from '~/components/VxCard.vue'
import NewsletterModal from '~/screens/newsletter/NewsletterModal.vue'
import GroupModal from '~/screens/groupsModal.vue'
import PostNotesModal from '~/screens/notes/PostNotesModal.vue'
import Analytics from '~/mixins/AnalyticsMixin';
import groupsModal from '~/screens/groupsModal.vue';


@Component<GroupsPage>({
  layout: 'main',
  components: { VxCard, GroupModal, PostNotesModal},
  name : "GroupsPage"
})
export default class GroupsPage extends mixins(Analytics) 
{
 logPage = true;
}
</script>
