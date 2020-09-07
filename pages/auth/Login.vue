<template>
  <vs-row class="w-full" justify="center" style="height: 100%;">
    <vs-col
      w="10"
      class="h-full border-solid"
      justify="center"
      align="center"
      style="border-style: solid;"
    >
      <VxCard class="mt-6 p-4 px-2 lg:px-6 w-full md:w-2/3 lg:w-1/2 xl:w-5/12 relative">
        <div class="p-6">
          <h1 class="title">SIGN IN</h1>
          <vs-alert v-if="errorMessage" danger
            >Error : {{ errorMessage }}</vs-alert
          >
          <vs-button
            @click="LoginGoogle()"
            color="rgb(162,161,166)"
            type="filled"
            class="google"
            ><i class="bx bxl-google"></i>Sign in with google</vs-button
          >
          <vs-input
            v-model="email"
            label="Email"
            color="primary"
            placeholder="studentEmail@ocdsb.ca"
            class="block"
          >
            <template #icon>
              <i class="bx bx-user"></i>
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

        <vs-col justify="space-between" class="mt-8 justify-end">
          <vs-button
            class="mt-8 ml-6 login p-6"
            color="#6b3deb"
            type="filled"
            @click="LoginEmailPassword(email, password)"
            >Sign In
          </vs-button>
          <button @click="PushSignUpPage()" class="signup">
            Dont have an account yet?<br /><span style="color: #6b3deb;"
              >Sign Up</span
            >.
          </button>
        </vs-col>
        <FooterCard />
      </VxCard>
    </vs-col>
  </vs-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, mixins } from 'nuxt-property-decorator'

// import VxCard from '~/components/VxCard.vue'
import FooterCard from '~/components/FooterCard.vue'

import Auth from '~/mixins/AuthenticationMixin'
import { navigationStore } from '~/store'
@Component<Login>({
  components: { FooterCard },
  layout: 'auth'
})
export default class Login extends mixins(Auth) {
  PushSignUpPage() 
  {
    this.$router.push('/auth/Signup')
  }
  email: string = ''
  password: string = ''
}
</script>

<style scoped>
.card {
  width: 30vw;
  height: auto;
}
.title {
  font-family: ginger-bold;
  padding-bottom: 0.5vw;
  font-size: 2vw;
  color: #4e5557;
}
.google {
  margin-top: 0.5vw;
  background: #db4437;
  margin-bottom: 2vw;
  color: white;
  font-family: ginger-normal;
  font-size: 0.8vw;
}

.google i {
  font-size: 2vw;
  padding-right: 0.5vw;
}

.login {
  font-family: ginger-normal;
  font-size: 0.8vw;
  border-radius: 2vw;
  min-width: 30%;
}
.signup {
  font-family: ginger-normal;
  font-size: 1vw;
  border-radius: 2vw;
  margin-top: 2vw;
}
@media only screen and (max-width: 1200px) {
  .google {
    margin-bottom: 5vw;
    font-size: 1.7vw;
  }
  .google i {
    font-size: 2vw;
    padding-right: 1vw;
  }
  .login {
    font-size: 2vw;
    border-radius: 5vw;
  }
  .signup {
    font-size: 2vw;
    margin-top: 2vw;
  }
}

@media only screen and (max-width: 850px) {
  .card {
    width: 80vw;
  }
  .title {
    font-size: 5vw;
  }
  .google {
    margin-top: 1vw;
    font-size: 2.5vw;
  }
  .google i {
    font-size: 4vw;
    padding-right: 1vw;
  }
  .login {
    width: 60%;
    font-size: 2.5vw;
    border-radius: 5vw;
  }
  .signup {
    width: 60%;
    font-size: 2.5vw;
    margin-top: 2vw;
  }
}
@media only screen and (max-width: 520px) {
  .card {
    width: 80vw;
    padding: 0vw;
  }
  .title {
    font-size: 8vw;
    padding-bottom: 2vw;
  }
  .google {
    margin-top: 2vw;
    font-size: 3vw;
    margin-bottom: 10vw;
  }
  .google i {
    font-size: 6vw;
    padding-right: 1vw;
  }
  .login {
    font-size: 3vw;
  }
  .signup {
    width: 100%;
    font-size: 3vw;
  }
}
</style>
