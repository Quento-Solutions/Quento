import { Component, Vue } from 'nuxt-property-decorator'
import { authStore } from '~/store'

@Component
export default class AuthenticationMixin extends Vue {
  errorMessage = ''
  errorCode: number | null = null

  get validEmail() {
    return (email: string) =>
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }
  get error()
  {
    return this.errorMessage;
  }

  set error(error : any)
  {
    if (error.message) this.errorMessage = error.message
    else this.errorMessage = error
    if (error.code) this.errorCode = error.code
    console.log(error.message)

  }
  resetError() {
    this.errorMessage = ''
    this.errorCode = null
  }

  delayedSendToHome(loading : any)
  {
    setTimeout(() => {
      loading.close();
      this.$router.push('/home');
    }, 500)
  }

  async LoginGoogle() {
    const loading = this.$vs.loading()
    this.resetError()
    try {
      await authStore.signInWithGoogle()
      this.delayedSendToHome(loading);
    } catch (error) {
      loading.close();
      this.error = error;
      return;
    }
  }

  async SignUp(email: string, name: string, password: string, confirm_password: string) {
    this.resetError()
    if (!email || !password || !confirm_password || !name) {
      this.errorMessage = 'All Fields Must Be Filled In'
      return
    }
    if (password != confirm_password) {
      this.errorMessage = 'Confirm Password Must Match'
      return
    }
    const loading = this.$vs.loading()
    try {
      await authStore.signUpWithEmail({ email, password, name });
      loading.close();
      this.$vs.notification({title:"accountCreated", color: "success"})
      this.$router.push("/auth/login");
      // Handle Sign Up Stuff Actually this should be in Actions but
    } catch (error) {
      loading.close();
      this.error = error;
      return;
    }
  }

  async LoginEmailPassword(email: string, password: string) {
    this.resetError()
    if (!email || !password) {
      this.errorMessage = 'All Fields Must Be Filled In'
      return
    }
    const loading = this.$vs.loading()
    try {
      await authStore.signInWithEmail({ email, password })
      this.delayedSendToHome(loading);
      // Handle Sign Up Stuff Actually this should be in Actions but
    } catch (error) {

      // For some reason if you do `this.error = error` before `loading.close();` with no return statement,
      // the loading never closes, I'm not sure why.
      
      loading.close();
      this.error = error;
      return;
    }
  }
}
