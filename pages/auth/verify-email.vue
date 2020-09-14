<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter justify-center items-center"
    style="background-size: cover"
    :style="`background-image: url('${require('~/assets/images/faq.jpg')}')`"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-2/5 m-4">
      <VxCard>
        <div class="vx-row mb-4 w-full lg:w-1/2 xs:bg-white rounded-md p-2">
          <vs-avatar class="icon-small float-right" @click="goBack()">
            <i class="bx bx-arrow-back" style="font-size: 1.25rem;" />
          </vs-avatar>
        </div>

        <div class="vx-card__title mb-6">
          <h2 class="text-center" v-if="AuthUser && AuthUser.displayName">
            Hi
            <b>{{AuthUser.displayName}}!</b>
          </h2>
          <h2 class="text-center">Please Check Your Email for a Verification Link</h2>
        </div>
        <img src="~assets/images/rocket.png" alt="coming-soon" class="mx-auto mb-2" width="150" />
        <!-- <p>Thank you for checking out our app. We are under construction, we will be here soon with our new awesome app. </p> -->
        <div class="count-down"></div>
        <div class="subscription vx-row justify-center items-center">
          <vs-input
            type="email"
            label-placeholder="Email"
            class="w-full my-4 block"
            readonly
            :value="userEmail"
          />
          <div class="p-4 w-full">
            Created an account and haven't received an email? Check your spam and junk folders or
            <a
              @click="showResendEmail = true"
              class="cursor-pointer"
            >resend the verification email.</a>
          </div>

          <vs-button
            class="w-full md:w-2/3 lg:w-1/2"
            @click="sendVerificationEmail()"
            :disabled="!AuthUser"
            v-if="showResendEmail"
          >
            <div class="text-xl p-2" style>Send</div>
          </vs-button>
        </div>
      </VxCard>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, mixins, Watch} from 'nuxt-property-decorator'
import UserMixin from '~/mixins/UserMixin'
import {User} from '~/types/user'
import {authStore} from '~/store'

@Component<VerifyEmail>({
  components: {},
  mounted() {
    this.AuthUserChange(this.AuthUser, null)
  }
})
export default class VerifyEmail extends mixins(UserMixin) {
  async goBack() {
    if (this.AuthUser) {
      const loading = this.$vs.loading()
      await authStore.signOut()
      loading.close()
    }
    this.$router.push('/auth/login')
  }

  @Watch('AuthUser')
  async AuthUserChange(val: User, oldVal: User) {
    if (val?.emailVerified) {
      const verified = this.$route.query.verified
      if (verified) {
        const loading = this.$vs.loading({
          type: 'scale',
          text: 'Updating User Info'
        })
        try {
          await authStore.updateUserData({
            displayName: val.displayName
          })
        } catch (error) {
          this.$qto.error(error)
        }
        loading.close()
      }
      this.$router.push('/home')
    }
  }

  showResendEmail = false
  get userEmail() {
    return this.AuthUser?.email || ''
  }
  async sendVerificationEmail() {
    await authStore.sendVerifyEmail()
    this.$vs.notification({
      title: 'Email Sent',
      color: 'success'
    })
    this.showResendEmail = false
  }
}
</script>