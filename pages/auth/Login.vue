<template>
<ScreenCard>
  <vs-row class="w-full" justify="center" style="height: 100%;">
    <vs-col w="10" class="p-6 h-full border-solid" style="border-style: solid;">
      <h1 class="text-title text-5xl">&nbsp; &nbsp; Welcome To Quento</h1>
      <VxCard
        class="mt-6 p-4 px-8"
        title="Login Or Sign Up"
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

        <vs-row justify="space-between" class="mt-8 justify-end">
          <vs-button
            gradient
            warn
            size="xl"
            class="text-title text-4xl mt-8 ml-6"
            @click="PushSignUpPage()"
            >Sign Up &nbsp;
            <i class="bx bx-user-plus text-2xl" />
          </vs-button>
          <vs-button
            gradient
            size="xl"
            class="text-title text-4xl mt-8 ml-6"
            @click="LoginGoogle()"
            >Sign In With Google &nbsp;
            <i class="bx bxl-google text-2xl" />
          </vs-button>
          <vs-button
            gradient
            success
            size="xl"
            class="text-title text-4xl mt-8 ml-6"
            @click="LoginEmailPassword(email, password)"
            >Sign In &nbsp;
            <i class="bx bx-right-arrow-circle text-2xl" />
          </vs-button>
        </vs-row>
      </VxCard>
    </vs-col>
  </vs-row>
</ScreenCard>
</template>

<script lang="ts">
import { Component, Prop, Vue, mixins } from 'nuxt-property-decorator'

import ScreenCard from '~/screens/ScreenCard.vue';
import VxCard from '~/components/VxCard.vue';

import Auth from '~/mixins/AuthenticationMixin';
import AOS from 'aos'

import {navigationStore} from '~/store';
@Component<Login>({
  components: { VxCard, ScreenCard },
  layout : 'auth',

})
export default class Login extends mixins(Auth) {

  PushSignUpPage()
  {
    // this.$router.go(1)
    this.$router.push({ path : '/auth/signup'});
  }
  email: string = ''
  password: string = ''
}
</script>
