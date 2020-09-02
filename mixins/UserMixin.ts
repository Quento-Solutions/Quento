import { Component, Vue } from 'nuxt-property-decorator'
import { authStore } from '~/store'

@Component
export default class UserMixin extends Vue {
  get AuthUser() {
    return authStore.user
  }
  get loggedIn() {
    return !(authStore.user === null)
  }
  get UserData() {
    return authStore.userData
  }
  async refreshUserData() {
    return await authStore.refreshUserData()
  }
}
