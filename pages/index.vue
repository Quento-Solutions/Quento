<template>
<section style="overflow-x:hidden;position:relative;">
   <section>
      <div class="loadingPage" :class="loading ? '' : 'loaded'">
         <h1 class="loadingLogo text-ginger-b">QUENTO</h1>
      </div>
   </section>
   <div class="w-full overflow-x-hidden" >
      <div class="background">
      </div>
      <section>
         <div id="nav" data-aos="fade-down" data-aos-duration="1000" class="absolute top-0 left-0 flex items-center" style="transition-delay:4.5s;">
            <a href="" class="logo absolute text-white text-ginger-b" style="color:white;">Quento</a>      
            <div class="navRightContainer absolute">
               <button @click="$router.push('/auth/login')" class="contact text-white text-ginger" style="background-color:rgba(255, 255, 255,0.3);color:white;">Sign in</button>
               <button @click="$router.push('/auth/signup')" class="contact2 text-white text-ginger" style="color:white;">Sign Up</button>        
            </div>
            </div>
      </section>
      <section id="splash">
         <div class="mainContent absolute font-ginger-b font-white">
            <h1 data-aos="fade-up" data-aos-duration="1000" data-aos-delay="3000" style="color:white;">A collection of utilities created by <span style="color:#ff70ab;">students</span>, for <span style="color:#ff70ab;">students</span>.</h1>
            <a href="#beta" class="link1 text-ginger inline-block" data-aos="fade-right" data-aos-duration="1000" style="background:rgba(255,255,255,0.3);color:white;transition-delay:4.2s;">Learn More About the BETA</a>
            <a href="#beta" class="link2 text-ginger inline-block" data-aos="fade-right" data-aos-duration="1000" style="color:white;transition-delay:4.5s;">Contact us</a>
         </div>
         <div class="scrollDown absolute text-center" style="left:50%;transform:translate(-50%);" :class="pageLoaded ? 'animate-flicker' : ''">
            <h1 style="color:white;font-family:ginger-normal;">Scroll Down</h1>
            <img style="margin-left:50%;transform:translate(-50%);" src="../assets/images/down.png">
         </div>
      </section>
      <section id="aboutContent" style="background:#f6f9fc;display:flex;">
         <div class="leftDiv">
            <div class="leftContent">
               <div data-aos="fade-right" data-aos-duration="1200">
               <h1 style="color:#0a2540;font-family:ginger-bold;">If only… no longer</h1>
               <h2 style="color:#6b3deb;font-family:ginger-normal;font-weight:bold;">The solution you've been waiting for is here.</h2>
               <p class="text-ginger" style="color:#42547d;">Have you ever found yourself face-to-face with a task so daunting that you just exclaim,
                  “Darn, if only there were only an app for that!”<br><br>As the high school students of today, we too-often find ourselves caught in an awkward transition period; one between the slow-to-change world of academia and our current age of rapidly-evolving technology. 
               </p>
               <a href="auth/login.vue" class="border-none font-ginger inline-block" style="background-color:#6b3deb;color:white;">Start your experience</a>
               </div>
               <div data-aos="fade-right" data-aos-duration="1200">
               <h4 style="color:#6b3deb;font-family:ginger-normal;font-weight:bold;">Revolutionary platform</h4>
               <h3 style="color:#0a2540;font-family:ginger-normal;font-weight:bold;">A fully integrated suite of digital tools</h3>
               <p class="text-ginger" style="color:#42547d;">Quento is <span class="text-bold" style="color:#6b3deb;">open-source</span>, freely available, and built from the ground up by a passionate community. Acting in the same capacity as a <span class="text-bold" style="color:#6b3deb;">digital pencil case</span>, the platform serves to centralize a wide variety of <span class="text-bold" style="color:#6b3deb;">web tools</span> created by and for <span class="text-bold" style="color:#6b3deb;">Canadian high school students</span>.</p>
               </div>
            </div>
         </div>
         <div data-aos="fade-left" data-aos-duration="1200" class="rightDiv flex items-center justify-center">
            <img src="../assets/images/laptop.png" style="height:90%;"> 
         </div>
      </section>
      <section id="features">
         <div class="diagonal-background"></div>
         <div class="featuresContainer w-full h-full m-0 flex">
               <div class="td1">
                  <table class="cardsContainer relative" style="height:80%;">
                     <tr>
                        <td data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="0" style="padding:2vw;">
                           <div v-tilt="{reverse:'true', speed:1000,}" class="w-full h-full" style="transform-style:preserve-3d;">
                           <div class="card" style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);">
                              <div class="container3d">
                                 <h1 style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;">1</h1>
                                 <h3 style="color:white;font-family:ginger-normal;font-weight:bold;">Easily convert written notes into a digital format</h3>
                              </div>
                           </div>
                           </div>
                        </td>
                        <td data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200" style="padding:2vw;">
                           <div v-tilt="{reverse:'true', speed:1000,}" class="w-full h-full" style="transform-style:preserve-3d;">
                           <div class="card" style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);">
                              <div class="container3d">
                                 <h1 style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;">2</h1>
                                 <h3 style="color:white;font-family:ginger-normal;font-weight:bold;">Forward notifications from supported platforms<span style="color:gold;">*</span> as an SMS, Facebook, or Discord message</h3>
                                 <p style="color:white;font-family:ginger-normal;"><span style="color:gold">*</span> Managebac, Google Classroom, etc.</p>
                              </div>
                            </div>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200" style="padding:2vw;">
                           <div v-tilt="{reverse:'true', speed:1000,}" class="w-full h-full" style="transform-style:preserve-3d;">
                           <div class="card" style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);">
                              <div class="container3d">
                                 <h1 style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;">3</h1>
                                 <h3 style="color:white;font-family:ginger-normal;font-weight:bold;">Create and join groups where you can create class calendars and plot out lessons</h3>
                              </div>
                           </div>
                           </div>
                        </td>
                        <td data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="400" style="padding:2vw;">
                           <div v-tilt="{reverse:'true', speed:1000,}" class="w-full h-full" style="transform-style:preserve-3d;">
                           <div class="card" style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);">
                              <div class="container3d">
                                 <h1 style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;">4</h1>
                                 <h3 style="color:white;font-family:ginger-normal;font-weight:bold;">Suggest feature ideas and provide feedback</h3>
                              </div>
                           </div>
                           </div>
                        </td>
                     </tr>
                  </table>
               </div>
               <div class="td2">
                  <div data-aos="fade-left" data-aos-duration="1200" class="vision relative">
                     <h1 style="color:white;font-family:ginger-bold;font-weight:bold;">Our Vision</h1>
                     <p class="text-white text-ginger" >Faced with daily dilemmas such as “how should I take notes?” and “how do I stay on top of the ever-increasing workload?”, we established Quento Solutions as a platform to end these “darn!” moments once and for all. But how are we going to achieve this, you might ask? <br><br>Quento is currently in early stages of development. However, we need all the help that we can get. Scroll down below to check out how you can contribute and gain exclusive benefits as one of our earliest members and beta testers!</p>
                     <a href="#beta" class="inline-block font-ginger" style="color:white;opacity:0.95;background-color:rgba(255, 255, 255,0.3);">Learn how you can help</a>      
                  </div>
               </div>
         </div>
      </section>
      <section id="beta" class="flex w-full" style="background:#f6f9fc;">
         <div class="leftDiv">
            <div class="largeContainer">
               <div data-aos="fade-right" data-aos-duration="1000">
               <h1 style="color:#0a2540;font-family:ginger-bold;font-weight:bold;">I want to contribute as a Quento <span style="color:#6b3deb">beta tester</span>.</h1>
               <p style="color:#42547d;font-family:ginger-normal;">Great news! You can sign up for an account and <a href="https://docs.google.com/forms/d/e/1FAIpQLScrpPrTcpq41DJTXsmu1AvLOBXVHjG7vh2s_Q62M8oPx1ibmA/viewform?usp=sf_link" style="color:#6b3deb;font-weight:bold;text-decoration:underline;padding:0;margin:0;">subscribe to our newsletter</a> today through using the forms below. Once you’ve signed in, you’ll have access to the first module that we have completed: a forum where interested users can post the features they want added next and upvote/downvote fellow recommendations! As our development team grows and Quento comes along in its production stages, we’ll pick the highest ranking recommendations to create next.</p>
               <a href="auth/SignUp.vue" class="border-none inline-block" style="background-color:#6b3deb;color:white;font-family:ginger-normal;">Sign up for the beta</a>
               </div>
               <div data-aos="fade-right" data-aos-duration="1000">
               <h1 class="marginTop2" style="color:#0a2540;font-family:ginger-bold;font-weight:bold;"> I want to contribute to the <span style="color:#6b3deb">development</span> of Quento.</h1>
               <p style="color:#42547d;font-family:ginger-normal;">So you want to contribute to Quento development even further? Stellar, because our team needs more fellow youth like you! Please join the following Discord link and introduce yourself as well as the skills you bring to the table. Check our Github/Trello board and all open task postings to see if there is something that you can complete or a new feature you’d like to work on, and propose it in the Discord server! </p>
               <a href="https://github.com/Quento-Solutions" class="border-none inline-block" style="background-color:#6b3deb;color:white;font-family:ginger-normal;">Join the development team</a>
               </div>
            </div>
         </div>
         <div class="rightDiv" data-aos="fade-left" data-aos-duration="1000">
         <center>
            <div id="formSubmitted" :class="formSubmitted ? 'submitted' : ''">
               <img src="../assets/images/quento.png" style="width:100%;height:100%;">
            </div>
            <div id="formArea" :class="formSubmitted ? 'submitted' : ''">
            <h1 style="text-align:center;color:#6b3deb;font-family:ginger-normal;font-weight:bold;">Get in touch</h1>
            <form id="gform" enctype="text/plain" action="https://docs.google.com/forms/d/e/1FAIpQLSfRH7TjjLrd3SbBLeM4WJvDUruR0iJr61gQPHxkNr17ZXZ5nw/formResponse?usp=pp_url" target="hidden_iframe" @submit="handleFormSubmit">
               <center><input id="entry.527074164" name="entry.527074164" class="textInput" placeholder=" Name" type="text" required></center>
               <br>
               <center><input id="entry.186440784" name="entry.186440784" class="textInput" placeholder="  Email" type="email" required></center>
               <br>
               <center><textarea id="entry.42021065" name="entry.42021065" placeholder="  Message" required></textarea></center>
               <br>
               <center><input id="submitForm" type="submit" value="Send" :class="formSubmitted ? 'submitted' : ''"></center>
            </form>
               <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;" onload="if(submitted) {}"></iframe>
            </div>
            <div class="imageContainer flex items-center justify-center">
               <a href="https://github.com/Quento-Solutions"><img src="../assets/images/github.png"> </a>
               <a href="https://discord.gg/pfyFWus"><img src="../assets/images/discord.png" class="image2"> </a>
            </div>
                        </center>

         </div>
      </section>
      <section id="footerContainer">
         <div class="footer w-full items-center justify-center flex" style="background-image: linear-gradient(to right, #4a45f4, #df43c6);">
            <a style="position:absolute;color:white;opacity:0.95;font-family:ginger-light;">Quento &nbsp;<span>2020&nbsp;&nbsp;&nbsp;&nbsp;hello@quento.ca</span></a>
         </div>
      </section>
   </div>
</section>
</template>
    <script src="https://kit.fontawesome.com/ed68982581.js" crossorigin="anonymous"></script>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import VueTilt from 'vue-tilt.js';
Vue.use(VueTilt);
import AOS from 'aos'

@Component<Splash>({
  components: {
  },
  async mounted()
  {
   AOS.init();
   this.loading = false;
   window.scrollTo(0,0);
   setTimeout(this.handlePageLoad, 4000);
  }
})

export default class Splash extends Vue {


   formSubmitted = false;
   loading = true;
   pageLoaded = false;
   handleFormSubmit() {
      this.$vs.notification({
         color : 'white',

         title : 'You Information Was Submitted Successfully'
      })
      this.formSubmitted = true;
   }
   handlePageLoad() {
      this.pageLoaded = true;
   }

    name="splash"
}
</script>

<style lang="scss" scoped>
@import "../assets/css/splash.css";
@import '../assets/css/fonts.css';


#formSubmitted
{
   position:absolute;transform: translateY(20%);opacity:0;transition: 1s ease-in-out;z-index:-1;
}
#formSubmitted.submitted
   { 
      transform : translateY(0) !important;
      z-index:20 !important;
      opacity:1 !important;
   }

#submitForm 
{
   font-family:ginger-normal, FontAwesome;
}
#submitForm.submitted
{
   display:none !important;
}
#formArea 
{
   z-index:10;transition: 1s ease-in-out; 
}
#formArea.submitted{
   opacity:0 !important;
   }

.loadingPage 
{
   position:fixed;z-index:1000;background:white; transition:2s ease-in-out;width:100%;height:100%;text-align:center;transition-delay:1s;
}
.loadingPage.loaded

{
   z-index : -1 !important;
   opacity :0 !important;
}
</style>
