<template>
  <div>
    <GroupsModal></GroupsModal>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script lang="ts">
import { Vue, Component, mixins } from 'nuxt-property-decorator'
import { groupsStore } from '~/store'
import Analytics from '~/mixins/AnalyticsMixin';
import GroupsModal from '~/screens/groups/NewGroupsModal.vue'

@Component<GroupsPage>({
  layout: 'standard',
  components: { GroupsModal},
  name : "GroupsPage"
})
export default class GroupsPage extends mixins(Analytics) 
{
 logPage = true;
}
</script>
