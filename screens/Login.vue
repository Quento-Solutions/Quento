<template>
<ScreenCard>
  <vs-row class="absolute w-full" justify="center" style="height: 100%;">
    <vs-col w="10" class="p-6 h-full border-solid" style="border-style: solid;">
      <h1 class="text-title text-5xl">&nbsp; &nbsp; Welcome To Wani Nani</h1>
      <VxCard
        class="mt-6 p-4 px-8"
        actionButtons="true"
        collapseAction="true"
        removeAction="true"
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
            <template v-if="validEmail" #message-success>
              Email Valid
            </template>
            <template v-if="!validEmail && email !== ''" #message-danger>
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
            @click="pushSignUpPage()"
            >Sign Up &nbsp;
            <i class="bx bx-user-plus text-2xl" />
          </vs-button>
          <vs-button
            gradient
            size="xl"
            class="text-title text-4xl mt-8 ml-6"
            @click="loginWithGoogle()"
            >Sign In With Google &nbsp;
            <i class="bx bxl-google text-2xl" />
          </vs-button>
          <vs-button
            gradient
            success
            size="xl"
            class="text-title text-4xl mt-8 ml-6"
            @click="Login()"
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
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import ScreenCard from './ScreenCard.vue';
import VxCard from '~/components/VxCard.vue';

import {navigationStore, authStore} from '~/store';
@Component<Login>({
  components: { VxCard, ScreenCard }
})
export default class Login extends Vue {

  errorMessage = "";
  errorCode : number | null = null;
  pushSignUpPage()
  {
    navigationStore.changePage('signup');
  }

  resetError()
  {
    this.errorMessage = "";
    this.errorCode = null;
  }

  async Login()
  {
    this.resetError();
    if(!this.email || !this.password)
    {
      this.errorMessage = "All Fields Must Be Filled In";
      return;
    }

    const loading = this.$vs.loading();
    try {
      console.log(this.password);
      await authStore.signInWithEmail({...this});
      navigationStore.changePage('home');
      // Handle Sign Up Stuff Actually this should be in Actions but
    }
    catch (error)
    {
      if(error.message) this.errorMessage = error.message
      else this.errorMessage = error;
      if(error.code) this.errorCode = error.code; 
    }
    loading.close();
  }

  async loginWithGoogle() {
    const loading = this.$vs.loading();
    this.resetError();
    try {
      await authStore.signInWithGoogle();
      navigationStore.changePage('home');
    }
    catch (error)
    {
      if(error.message) this.errorMessage = error.message
      else this.errorMessage = error;
      if(error.code) this.errorCode = error.code; 
    }
    loading.close()
  }

  email: string = ''
  password: string = ''
  get validEmail() {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)
  }
}
</script>
