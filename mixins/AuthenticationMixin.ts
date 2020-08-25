import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { authStore } from '~/store'
import type {User, UserData} from '~/types/user'

@Component<AuthenticationMixin>({
  mounted()
  {
    if(this.AuthUser && this.AuthUser.emailVerified) this.sendToHome();
  }
})
export default class AuthenticationMixin extends Vue {
  errorMessage = ''
  errorCode: number | null = null;
  loading : { close : () => void} | null = null;

  
  stopLoading()
  {

    if(this.loading && this.loading.close)
    {
      this.loading.close();
      this.loading = null;
    }
  }

  startLoading()
  {
    if(!this.loading)
    {
      this.loading= this.$vs.loading();
    }
  }

  get AuthUser()
  {
    return authStore.user;
  }

  @Watch("AuthUser")
  onAuthUserChange(val : User, oldVal : any)
  {
    // If Auth User changes and the user is valid, will automatically redirect to homepage
    if(val)
    {
      this.stopLoading();
      if(val.emailVerified)
      {
        this.sendToHome();
      }
    }
  }

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

  sendToHome()
  {
    // Will redirect to the proper link, not just home every single time
    const redirectPath = (typeof this.$route.query.redirect === "string") ? decodeURIComponent(this.$route.query.redirect) : "/home"; 
    this.$router.push(redirectPath);
  }

  async LoginGoogle() 
  {
    this.startLoading();
    this.resetError()
    try {
      await authStore.signInWithGoogle()
    } catch (error) {
      this.stopLoading();
      this.error = error;
      return;
    }
  }

  async SignUp(email: string, displayName: string, password: string, confirm_password: string) {
    this.resetError()
    if (!email || !password || !confirm_password || !displayName) {
      this.errorMessage = 'All Fields Must Be Filled In'
      return
    }
    if (password != confirm_password) {
      this.errorMessage = 'Confirm Password Must Match'
      return
    }
    this.startLoading()
    try {
      await authStore.signUpWithEmail({ email, password, displayName });
      this.$vs.notification({title: "Account Created Successfully", color: "success"});
      // Handle Sign Up Stuff Actually this should be in Actions but
    } catch (error) {
      this.$vs.notification({color: 'danger', title: "Email Invalid/In Use"});
      this.stopLoading();
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
    this.startLoading()
    try {
      await authStore.signInWithEmail({ email, password })
      // Handle Sign Up Stuff Actually this should be in Actions but
    } catch (error) {

      // For some reason if you do `this.error = error` before `loading.close();` with no return statement,
      // the loading never closes, I'm not sure why.
      this.stopLoading();
      this.error = error;
      return;
    }
  }
}
