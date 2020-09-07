<template></template>

<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'
import functions from '~/plugins/firebaseFunctions'

@Component<JoinGroups>({components: {}, mounted() {this.joinGroup()}})
export default class JoinGroups extends Vue {
  async joinGroup() {
    const {token} = this.$route.query
    if (!token) return this.$router.push('/groups')

    const loading = this.$vs.loading({
      text: 'Joining Group'
    })

    try {
      const request = await functions.httpsCallable('JoinGroup')({token})
      if (request.data.status !== 200) throw request.data
      const groupId = request.data.groupId;
      this.$router.push(`/groups/g/${groupId}`)
      this.$vs.notification({
        title: 'Joined Group',
        color: 'success'
      })
    } catch (error) {
      console.log({error}, error.message)
    }
    loading.close()
  }
}
</script>