<template>
  <section style="overflow-x:hidden;position:relative;">
    <section>
      <div class="loadingPage" :class="loading ? '' : 'loaded'">
        <h1 class="loadingLogo text-ginger-b">QUENTO</h1>
      </div>
    </section>
    <div class="w-full overflow-x-hidden">
      <section class="splashContainer">
        <div class="background"></div>
        <section>
          <div
            id="nav"
            data-aos="fade-down"
            data-aos-duration="1000"
            class="absolute top-0 left-0 flex items-center"
            style="transition-delay:4.5s;"
          >
            <a href="#" class="logo absolute text-white text-ginger-b" style="color:white;">
              <img src="../assets/images/quento_logo_white.png" />
            </a>
            <div class="navRightContainer absolute">
              <button @click="$router.push('/auth/login')" class="contact text-ginger">Sign in</button>
              <a href="#beta" class="contact2 text-ginger" style="display:inline-block;">Contact Us</a>
            </div>
          </div>
        </section>
        <section id="splash">
          <div class="mainContent absolute font-ginger-b font-white">
            <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="3000">
              <h1 style="color:white;">
                School is hard.
                <br />Learning doesn't have to be.
              </h1>
              <h2
                style="color:white;"
                class="mt-4"
              >Quento’s suite of tools helps you streamline your studying like never before.</h2>
            </div>
            <button
              class="link2 text-ginger inline-block"
              data-aos="fade-right"
              data-aos-duration="1000"
              style="transition-delay:4.2s;"
              @click="$router.push('/auth/signup')"
            >Sign up for the BETA</button>
            <button
              data-aos="fade-right"
              data-aos-duration="1000"
              style="background:rgba(255,255,255,0.3);color:white;transition-delay:4.2s;"
              class="link1 text-ginger"
            >
              <a href="https://discord.com/invite/vHhtD38" style="color:white;">
                <img src="../assets/images/discord_logo.png" />Join us on Discord
              </a>
            </button>
          </div>
          <div
            class="scrollDown absolute text-center"
            style="left:50%;transform:translate(-50%);"
            :class="pageLoaded ? 'animate-flicker' : ''"
          >
            <h1 style="color:white;font-family:ginger-normal;">Scroll Down</h1>
            <img style="margin-left:50%;transform:translate(-50%);" src="../assets/images/down.png" />
          </div>
        </section>
      </section>
    </div>
    <section id="aboutContent" style="background:#f6f9fc;display:flex;flex-direction:column;">
      <div class="w-full firstSection" style="display:flex;flex-direction:row;">
        <div class="w-1/3 textContent left" style>
          <h1 style="color:#0a2540;font-family:ginger-bold;">Schoolwork just got a lot easier</h1>
          <p class="text-ginger" style="color:#42547d;">
            Be it transcribing handwriting, sharing course notes or requesting mentorship, Quento has got your learning needs covered.
            <br />
            <br />
            <span>
              <i class="bx bx-brain"></i>Optical character recognition digitizes your pen-and-paper notes in a flash so you can experience the best of both worlds.
            </span>
            <br />
            <span>
              <i class="bx bx-paper-plane"></i>Out sick or think you missed something? Check out our extensive course note repository!
            </span>
            <br />
            <span>
              <i class="bx bx-group"></i>Join Quento’s student community by sharing your course notes, posting video recaps, and providing good advice.
            </span>
            <br />
          </p>
          <a
            href="auth/login.vue"
            class="border-none font-ginger inline-block"
            style="background-color:#9c44db;color:white;"
          >Start your experience</a>
        </div>
        <div class="w-2/3" style="display:flex;;align-items:flex-end;justify-content:center;">
          <img src="../assets/images/Computer Graphic Quento.png" style="height:80%;" />
        </div>
      </div>
      <div class="w-full secondSection" style="display:flex;flex-direction:row;">
        <div class="w-1/2" style="display:flex;;align-items:center;justify-content:center;">
          <img src="../assets/images/Phone Graphic Quento 2.png" style="height:80%;" />
        </div>
        <div class="w-1/2 textContent right" style>
          <h1 style="color:#0a2540;font-family:ginger-bold;">Put the ‘u’ in education</h1>
          <p class="text-ginger" style="color:#42547d;">
            Stay on top of your schedule and never miss out by having your academic deadlines, club announcements, and other notifications texted right to your phone!
            <br />
            <br />
            <span>
              <i class="bx bxs-school"></i>Join your school’s club groups and access a daily newsletter containing the latest scoop on both school-wide and club-specific issues.
            </span>
            <br />
            <span>
              <i class="bx bx-file"></i>Sign in to your educational platforms of choice and manage how you keep track of things.
            </span>
            <br />
            <span>
              <i class="bx bx-message-rounded-detail"></i>Get your Quento and academic notifications sent to you on your preferred platform (Discord, Instagram, or SMS).
            </span>
            <br />
          </p>
          <a
            href="auth/login.vue"
            class="border-none font-ginger inline-block"
            style="background-color:#9c44db;color:white;"
          >Start your experience</a>
        </div>
      </div>
    </section>
    <section id="features">
      <div class="featuresContainer w-full h-full m-0 flex">
        <div class="td1">
          <div class="vision relative">
            <h1 style="font-family:ginger-bold;font-weight:bold;">How it all works</h1>
            <p
              class="text-ginger"
            >We’ve designed Quento to be convenient and easy to use. Simply follow the four simple steps below, and you’ll be well on your way to a more enjoyable student experience!</p>
            <a
              href="#beta"
              class="inline-block font-ginger"
              style="color:white;opacity:0.95;background-color:rgba(255, 255, 255,0.3);"
            >Learn how you can help</a>
          </div>
        </div>
        <div class="td2">
          <table class="cardsContainer relative">
            <tr>
              <td style="padding:2vw;">
                <div
                  v-tilt="{reverse:'true', speed:1000, max:15,}"
                  class="w-full h-full"
                  style="transform-style:preserve-3d;"
                >
                  <div
                    class="card"
                    style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);"
                  >
                    <div class="container3d">
                      <h1
                        style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;"
                      >1</h1>
                      <h3
                        style="color:white;font-family:ginger-normal;font-weight:bold;"
                      >Sign up with your email address or get in with one click using your Google account.</h3>
                    </div>
                  </div>
                </div>
              </td>
              <td style="padding:2vw;">
                <div
                  v-tilt="{reverse:'true', speed:1000, max:15,}"
                  class="w-full h-full"
                  style="transform-style:preserve-3d;"
                >
                  <div
                    class="card"
                    style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);"
                  >
                    <div class="container3d">
                      <h1
                        style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;"
                      >2</h1>
                      <h3
                        style="color:white;font-family:ginger-normal;font-weight:bold;"
                      >Use Quento’s wide range of tools to make your life easier.</h3>
                    </div>
                  </div>
                </div>
              </td>
              <td style="padding:2vw;">
                <div
                  v-tilt="{reverse:'true', speed:1000, max:15,}"
                  class="w-full h-full"
                  style="transform-style:preserve-3d;"
                >
                  <div
                    class="card"
                    style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);"
                  >
                    <div class="container3d">
                      <h1
                        style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;"
                      >3</h1>
                      <h3
                        style="color:white;font-family:ginger-normal;font-weight:bold;"
                      >Opt-in to the subscription services that you want.</h3>
                    </div>
                  </div>
                </div>
              </td>
              <td style="padding:2vw;">
                <div
                  v-tilt="{reverse:'true', speed:1000, max:15,}"
                  class="w-full h-full"
                  style="transform-style:preserve-3d;"
                >
                  <div
                    class="card"
                    style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);"
                  >
                    <div class="container3d">
                      <h1
                        style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;"
                      >4</h1>
                      <h3
                        style="color:white;font-family:ginger-normal;font-weight:bold;"
                      >Have an amazing idea or find a bug? Check out the suggestions board and help us improve the Quento experience!</h3>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </section>
    <section id="beta" class="flex w-full" style="background:#f6f9fc;">
      <div class="circleBackground"></div>
      <div class="leftDiv">
        <div class="largeContainer">
          <h1>Join us</h1>Quento is currently in its beta stage and we need YOUR help to make the platform the best it can be. We are actively searching for beta testers and student developers to make Quento’s vision a reality.
          <br />
          <br />
          <div class="joinUsContainer">
            <div class="contribute" style="width:45%;">
              <b>Become a beta tester</b>
              <br />
              <br />
As a beta tester, you’ll be tasked with using the platform’s features while they are in development and reporting any issues that you face. You’ll also have the opportunity to directly suggest ideas to our development teams through our Discord server. To contribute, signup for a Quento account, join our Discord server, and report any bugs that you find in the #issues channel.
            </div>
            <div class="contribute section2" style="width:45%;margin-left:5%">
              <b>Contribute as a developer</b>
              <br />
              <br />We’re always in need of new members on our development team. Whether you’re ready to squash some pesky bugs or help make a new exciting idea a reality, we welcome you with open arms.
              <br />
              <br />
When you’re ready, submit your application using the form to your right; it should include your full name, email address, and Discord handle as well as what you’d like to work on as well and any relevant programming skills.
            </div>
          </div>
        </div>
      </div>
      <div class="rightDiv">
        <center>
          <div id="formSubmitted" :class="formSubmitted ? 'submitted' : ''">
            <img src="../assets/images/quento.png" style="width:100%;height:100%;" />
          </div>
          <div id="formArea" :class="formSubmitted ? 'submitted' : ''">
            <form
              id="gform"
              enctype="text/plain"
              action="https://docs.google.com/forms/d/e/1FAIpQLSfRH7TjjLrd3SbBLeM4WJvDUruR0iJr61gQPHxkNr17ZXZ5nw/formResponse?usp=pp_url"
              target="hidden_iframe"
              @submit="handleFormSubmit"
            >
              <center>
                <input
                  id="entry.527074164"
                  name="entry.527074164"
                  class="textInput"
                  placeholder=" Name"
                  type="text"
                  required
                />
              </center>
              <br />
              <center>
                <input
                  id="entry.186440784"
                  name="entry.186440784"
                  class="textInput"
                  placeholder="  Email"
                  type="email"
                  required
                />
              </center>
              <br />
              <center>
                <textarea
                  id="entry.42021065"
                  name="entry.42021065"
                  placeholder="  Message"
                  required
                ></textarea>
              </center>
              <br />
              <center>
                <input
                  id="submitForm"
                  type="submit"
                  value="Send"
                  :class="formSubmitted ? 'submitted' : ''"
                />
              </center>
            </form>
            <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;"></iframe>
          </div>
          <!-- <div class="imageContainer flex items-center justify-center">
               <a href="https://github.com/Quento-Solutions"><img src="../assets/images/github.png"> </a>
               <a href="https://discord.gg/pfyFWus"><img src="../assets/images/discord.png" class="image2"> </a>
          </div>-->
        </center>
      </div>
    </section>
    <section id="footerContainer">
      <div>
        <h1>For students, by students</h1>
        <p>
          Every day, youth around the world face the many challenges that come with being a student— from teaching yourself something the teacher glossed over to losing track of what’s due, we totally get what it’s like.
          <br />
          <br />No worries, Quento’s got your back. As students ourselves, we’ve designed our toolkit to allow you to improve your academic performance while staying on top of your school’s latest happenings. Every single feature of our platform has been built with YOU in mind. What are you waiting for? Join the revolution today!
          <br />
          <br />
        </p>
        <button @click="footerClicked()">Join Quento</button>
      </div>
    </section>
  </section>
</template>
    <script src="https://kit.fontawesome.com/ed68982581.js" crossorigin="anonymous"></script>

<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import VueTilt from 'vue-tilt.js'
Vue.use(VueTilt)
import AOS from 'aos'
import AnalyticsMixin from '~/mixins/AnalyticsMixin'

@Component<Splash>({
  components: {},
  async mounted() {
    AOS.init()
    this.loading = false
    window.scrollTo(0, 0)
    setTimeout(this.handlePageLoad, 4000)
  },
  name: 'Splash'
})
export default class Splash extends mixins(AnalyticsMixin) {
  logPage = true
  footerClicked() {
    this.$router.push('/auth/Login')
  }

  formSubmitted = false
  loading = true
  pageLoaded = true
  handleFormSubmit() {
    this.$vs.notification({
      color: 'white',

      title: 'You Information Was Submitted Successfully'
    })
    this.formSubmitted = true
  }
  handlePageLoad() {
    this.pageLoaded = true
  }

  name = 'splash'
}
</script>

<style lang="scss" scoped>
@import '../assets/css/splash.css';
@import '../assets/css/fonts.css';

#formSubmitted {
  position: absolute;
  transform: translateY(20%);
  opacity: 0;
  transition: 1s ease-in-out;
  z-index: -1;
}
#formSubmitted.submitted {
  transform: translateY(0) !important;
  z-index: 20 !important;
  opacity: 1 !important;
}

#submitForm {
  font-family: ginger-normal, FontAwesome;
}
#submitForm.submitted {
  display: none !important;
}
#formArea {
  z-index: 10;
  transition: 1s ease-in-out;
}
#formArea.submitted {
  opacity: 0 !important;
}

.loadingPage {
  position: fixed;
  z-index: 1000;
  background: white;
  transition: 2s ease-in-out;
  width: 100%;
  height: 100%;
  text-align: center;
  transition-delay: 1s;
}
.loadingPage.loaded {
  z-index: -1 !important;
  opacity: 0 !important;
}
</style>
