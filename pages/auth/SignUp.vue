<template>
<ScreenCard>
  <vs-row class="absolute w-full" justify="center" style="height: 100%;">
    <vs-col w="10" class="p-6 h-full border-solid" style="border-style: solid;">
      <VxCard
        class="mt-4 p-4 px-8"
        title="Sign Up To Quento"
      >
      <vs-alert v-if="errorMessage" danger>Error : {{errorMessage}}</vs-alert>

        <div class="p-6">
          <vs-input
            v-model="email"
            label="Email"
            color="primary"
            placeholder="yeboi@ocdsb.ca"
            class="block"
          >
            <template #icon>
              <i class="bx bx-user"></i>
            </template>
            <template v-if="validEmail(email)" #message-success>
              Email Valid
            </template>
            <template v-if="!validEmail(email) && email !== ''" #message-danger>
              Email Invalid
            </template>
          </vs-input>
        </div>
        <div class="p-6">
          <vs-input
            v-model="password"
            type="password"
            label="Password"
            class="block w-6"
          >
            <template #icon>
              <i class="bx bx-lock-open-alt"></i>
            </template>
          </vs-input>
        </div>

        <div class="p-6">
          <vs-input
            v-model="confirm_password"
            type="password"
            label="Confirm Password"
            class="block w-6"
          >
            <template #icon>
              <i class="bx bx-hash"></i>
            </template>
            <template v-if="password != confirm_password && confirm_password !== ''" #message-danger>
              Passwords Must Match
            </template>
          </vs-input>
        </div>

        <vs-row justify="space-between" class="mt-8 justify-end">
          <vs-button
            gradient
            warn
            size="xl"
            class="text-title mt-8"
            @click="PushLoginPage()"
            >Login Instead&nbsp;
            <i class="bx bx-log-in text-2xl" />
          </vs-button>
          <vs-button
            gradient
            size="xl"
            class="text-title mt-8"
            @click="LoginGoogle()"
            >Sign In With Google &nbsp;
            <i class="bx bxl-google text-2xl" />
          </vs-button>
          <vs-button
            gradient
            success
            size="xl"
            class="text-title mt-8"
            @click="SignUp(email,password,confirm_password)"
            >Sign Up &nbsp;
            <i class="bx bx-right-arrow-circle text-2xl" />
          </vs-button>
        </vs-row>
      </VxCard>
    </vs-col>
  </vs-row>
</ScreenCard>
</template>

<script lang="ts">
import { Component, Prop, Vue, mixins} from 'nuxt-property-decorator'

import ScreenCard from '~/screens/ScreenCard.vue';
import VxCard from '~/components/VxCard.vue'

import Auth from '~/mixins/AuthenticationMixin'

import {navigationStore, authStore} from '~/store'
@Component<SignUp>({
  components: { VxCard, ScreenCard },

  layout : 'auth'
})
export default class SignUp extends mixins(Auth) {
  email: string = '';
  password: string = '';
  confirm_password : string = '';

  PushLoginPage()
  {
    this.$router.replace('/auth/login')
  } 
}
</script>

<style lang="scss" >

</style>