<template>

</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import functions from '~/plugins/firebaseFunctions'
import {authStore} from '~/store';
@Component<DiscordAuth>({
  components: {},
  mounted() {
    this.LinkDiscord()
  },
  layout: 'main'
})
export default class DiscordAuth extends Vue {
  async LinkDiscord() {
    const { code } = this.$route.query
    if (!code) return this.$router.push('/home')

    const loading = this.$vs.loading({
        text : "Linking Discord, Please Wait"
    })
    const redirect_uri = window.location.origin + window.location.pathname
    const scope = 'identify'
    try {
      const request = await functions.httpsCallable('discordOauth')({
        redirect_uri,
        code,
        scope
      })
      console.log({ request })
      this.$vs.notification({
        title : "Success, Discord Linked!",
        message : 'Use the `/profile` command in the Quento Discord',
        color : "success"
      })
      this.$router.push("/user/profile");
    } catch (error) {
      console.log({ error }, error.message)
    }
    loading.close();
  }
}
</script>
