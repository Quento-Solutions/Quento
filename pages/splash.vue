<template>
<section style="overflow-x:hidden;position:relative;">
   <section>
      <div id="loadingPage" style="position:fixed;z-index:1000;background:white; transition:2s ease-in-out;width:100%;height:100%;text-align:center;transition-delay:1s;">
         <h1 style="background: linear-gradient(to right, #4a45f4, #df43c6);-webkit-background-clip: text;-webkit-text-fill-color: transparent;font-family:ginger-bold;font-size:10vw;margin-top:30vh">QUENTO</h1>
      </div>
   </section>
   <div class="w-full" style="overflow-x:hidden;">
      <div class="background">
      </div>
      <section>
         <div id="nav" data-aos="fade-down" data-aos-duration="1000" style="position:absolute;top:0;left:0; display:flex;alignItems:center;transition-delay:4.5s;">
            <a href="" class="logo" style="position:absolute;color:white;opacity:0.95;font-family:ginger-bold;">Quento</a>      
            <a href="auth/login.vue" class="contact" style="position:absolute;color:white;opacity:0.95;font-family:ginger-normal; background-color:rgba(255, 255, 255,0.3);">Sign in</a>      
         </div>
      </section>
      <section id="splash">
         <div class="mainContent" style="position:absolute;">
            <h1 data-aos="fade-up" data-aos-duration="1000" data-aos-delay="3000" style="color:white;font-weight:bold;font-family:ginger-bold;">A collection of utilities created by <span style="color:#ff5c9f;">students</span>, for <span style="color:#ff5c9f;">students</span>.</h1>
            <a href="#beta" class="link1" data-aos="fade-right" data-aos-duration="1000" style="transition-delay:4.2s;color:white;font-family:ginger-normal;font-weight:bold;display:inline-block;background:rgba(255,255,255,0.3);">Sign up for the BETA</a>
            <a href="#beta" class="link2" data-aos="fade-right" data-aos-duration="1000" style="transition-delay:4.5s;color:white;font-family:ginger-normal;font-weight:bold;display:inline-block;">Contact us</a>
         </div>
         <div class="animate-flicker scrollDown" style="position:absolute;left:50%;transform:translate(-50%);text-align:center;">
            <h1 style="color:white;font-family:ginger-normal;font-weight:bold;">Scroll Down</h1>
            <img style="margin-left:50%;transform:translate(-50%);" src="../assets/images/down.png">
         </div>
      </section>
      <section id="aboutContent" style="background:#f6f9fc;display:flex;">
         <div class="leftDiv">
            <div class="leftContent">
               <div data-aos="fade-right" data-aos-duration="1200">
               <h1 style="color:#0a2540;font-family:ginger-bold;font-weight:bold;">If only… no longer</h1>
               <h2 style="color:#6b3deb;font-family:ginger-normal;font-weight:bold;">The solution you've been waiting for is here.</h2>
               <p style="color:#42547d;font-family:ginger-normal;">Have you ever found yourself face-to-face with a task so daunting that you just exclaim,
                  “Darn, if only there were only an app for that!”<br><br>As the high school students of today, we too-often find ourselves caught in an awkward transition period; one between the slow-to-change world of academia and our current age of rapidly-evolving technology. 
               </p>
               <a href="auth/login.vue" style="background-color:#6b3deb;color:white;border:none;font-family:ginger-normal;display:inline-block;">Start your experience</a>
               </div>
               <div data-aos="fade-right" data-aos-duration="1200">
               <h4 style="color:#6b3deb;font-family:ginger-normal;font-weight:bold;">Revolutionary platform</h4>
               <h3 style="color:#0a2540;font-family:ginger-normal;font-weight:bold;">A fully integrated suite of digital tools</h3>
               <p style="color:#42547d;font-family:ginger-normal;">Quento is <span style="color:#6b3deb;font-weight:bold;">open-source</span>, freely available, and built from the ground up by a passionate community. Acting in the same capacity as a <span style="color:#6b3deb;font-weight:bold;">digital pencil case</span>, the platform serves to centralize a wide variety of <span style="color:#6b3deb;font-weight:bold;">web tools</span> created by and for <span style="color:#6b3deb;font-weight:bold;">Canadian high school students</span>.</p>
               </div>
            </div>
         </div>
         <div data-aos="fade-left" data-aos-duration="1200" class="rightDiv" style="display:flex;alignItems:center;justifyContent:center">
            <img src="../assets/images/laptop.png"> 
         </div>
      </section>
      <section id="features">
         <div class="diagonal-background"></div>
         <div class="featuresContainer" style="height:100%;width:100%;margin:0;display:flex;">
               <div class="td1">
                  <table class="cardsContainer" style="position:relative;width;100%;height:80%;">
                     <tr>
                        <td data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="0" style="padding:2vw;">
                           <div v-tilt="{reverse:'true', speed:1000,}" style="width:100%;height:100%;transform-style:preserve-3d;">
                           <div class="card" style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);">
                              <div class="bruh">
                                 <h1 style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;">1</h1>
                                 <h3 style="color:white;font-family:ginger-normal;font-weight:bold;">Easily convert written notes into a digital format</h3>
                              </div>
                           </div>
                           </div>
                        </td>
                        <td data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200" style="padding:2vw;">
                           <div v-tilt="{reverse:'true', speed:1000,}" style="width:100%;height:100%;transform-style:preserve-3d;">
                           <div class="card" style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);">
                              <div class="bruh">
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
                           <div v-tilt="{reverse:'true', speed:1000,}" style="width:100%;height:100%;transform-style:preserve-3d;">
                           <div class="card" style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);">
                              <div class="bruh">
                                 <h1 style="color:#b13edd;background:white;font-family:arial;font-weight:bold;text-align:center;">3</h1>
                                 <h3 style="color:white;font-family:ginger-normal;font-weight:bold;">Create and join groups where you can create class calendars and plot out lessons</h3>
                              </div>
                           </div>
                           </div>
                        </td>
                        <td data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="400" style="padding:2vw;">
                           <div v-tilt="{reverse:'true', speed:1000,}" style="width:100%;height:100%;transform-style:preserve-3d;">
                           <div class="card" style="background-image:linear-gradient(to top right, #df43c6, #8c3af0);">
                              <div class="bruh">
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
                  <div data-aos="fade-left" data-aos-duration="1200" class="vision" style="position:relative;">
                     <h1 style="color:white;font-family:ginger-bold;font-weight:bold;">Our Vision</h1>
                     <p style="color:white;font-family:ginger-normal;">Faced with daily dilemmas such as “how should I take notes?” and “how do I stay on top of the ever-increasing workload?”, we established Quento Solutions as a platform to end these “darn!” moments once and for all. But how are we going to achieve this, you might ask? <br><br>Quento is currently in early stages of development. However, we need all the help that we can get. Scroll down below to check out how you can contribute and gain exclusive benefits as one of our earliest members and beta testers!</p>
                     <a href="#beta" style="color:white;opacity:0.95;display:inline-block;font-family:ginger-normal;background-color:rgba(255, 255, 255,0.3);">Learn how you can help</a>      
                  </div>
               </div>
         </div>
      </section>
      <section id="beta" style="background:#f6f9fc;width;100vw;display:flex;">
         <div class="leftDiv">
            <div class="largeContainer">
               <div data-aos="fade-right" data-aos-duration="1000">
               <h1 style="color:#0a2540;font-family:ginger-bold;font-weight:bold;">I want to contribute as a Quento <span style="color:#6b3deb">beta tester</span>.</h1>
               <p style="color:#42547d;font-family:ginger-normal;">Great news! You can sign up for an account and <a href="https://docs.google.com/forms/d/e/1FAIpQLScrpPrTcpq41DJTXsmu1AvLOBXVHjG7vh2s_Q62M8oPx1ibmA/viewform?usp=sf_link" style="color:#6b3deb;font-weight:bold;text-decoration:underline;padding:0;margin:0;">subscribe to our newsletter</a> today through using the forms below. Once you’ve signed in, you’ll have access to the first module that we have completed: a forum where interested users can post the features they want added next and upvote/downvote fellow recommendations! As our development team grows and Quento comes along in its production stages, we’ll pick the highest ranking recommendations to create next.</p>
               <a href="auth/SignUp.vue" style="background-color:#6b3deb;color:white;border:none;font-family:ginger-normal;display:inline-block;">Sign up for the beta</a>
               </div>
               <div data-aos="fade-right" data-aos-duration="1000">
               <h1 class="marginTop2" style="color:#0a2540;font-family:ginger-bold;font-weight:bold;"> I want to contribute to the <span style="color:#6b3deb">development</span> of Quento.</h1>
               <p style="color:#42547d;font-family:ginger-normal;">So you want to contribute to Quento development even further? Stellar, because our team needs more fellow youth like you! Please join the following Discord link and introduce yourself as well as the skills you bring to the table. Check our Github/Trello board and all open task postings to see if there is something that you can complete or a new feature you’d like to work on, and propose it in the Discord server! </p>
               <a href="https://github.com/Quento-Solutions" style="background-color:#6b3deb;color:white;border:none;font-family:ginger-normal;display:inline-block;">Join the development team</a>
               </div>
            </div>
         </div>
         <div class="rightDiv" data-aos="fade-left" data-aos-duration="1000">
         <center>
            <div id="formSubmitted" style="position:absolute;transform: translateY(20%);opacity:0;transition: 1s ease-in-out;z-index:-1;">
               <img src="../assets/images/quento.png" style="width:100%;height:100%;">
            </div>
            <div id="formArea" style="z-index:10;transition: 1s ease-in-out;">
            <h1 style="text-align:center;color:#6b3deb;font-family:ginger-normal;font-weight:bold;">Get in touch</h1>
            <form id="gform" enctype="text/plain" action="https://docs.google.com/forms/d/e/1FAIpQLSfRH7TjjLrd3SbBLeM4WJvDUruR0iJr61gQPHxkNr17ZXZ5nw/formResponse?usp=pp_url" target="hidden_iframe" @submit="handleFormSubmit">
               <center><input id="entry.527074164" name="entry.527074164" style="font-family:ginger-normal, FontAwesome" class="textInput" placeholder=" Name" type="text" required></center>
               <br>
               <center><input id="entry.186440784" name="entry.186440784" style="font-family:ginger-normal, FontAwesome" class="textInput" placeholder="  Email" type="email" required></center>
               <br>
               <center><textarea id="entry.42021065" name="entry.42021065" style="font-family:ginger-normal, FontAwesome" placeholder="  Message" required></textarea></center>
               <br>
               <center><input style="font-family:ginger-normal, FontAwesome" id="submitForm" type="submit" value="Send"></center>
            </form>
               <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;" onload="if(submitted) {}"></iframe>
            </div>
            <div class="imageContainer" style="display:flex;alignItems:center;justifyContent:center;">
               <a href="https://github.com/Quento-Solutions"><img src="../assets/images/github.png"> </a>
               <a href="https://discord.gg/kJaede"><img src="../assets/images/discord.png" class="image2"> </a>
            </div>
                        </center>

         </div>
      </section>
      <section id="footerContainer">
         <div class="footer" style=" background-image: linear-gradient(to right, #4a45f4, #df43c6);display:flex;alignItems:center;width:100%;">
            <a style="position:absolute;color:white;opacity:0.95;font-family:ginger-light;">Quento <span>2020&nbsp;&nbsp;&nbsp;&nbsp;hello@quento.ca</span></a>
         </div>
      </section>
   </div>
</section>
</template>
    <script src="https://kit.fontawesome.com/ed68982581.js" crossorigin="anonymous"></script>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import VueTilt from 'vue-tilt.js'
Vue.use(VueTilt)


@Component<Splash>({
  components: {
  },
})

export default class Splash extends Vue {
handleFormSubmit() {
   document.getElementById('submitForm').style.display = 'none';
   document.getElementById('formArea').style.opacity = '0';
   document.getElementById('formSubmitted').style.transform = 'translateY(0)';
   document.getElementById('formSubmitted').style.zIndex = '20';
   document.getElementById('formSubmitted').style.opacity = '1';

}

   async mounted() {
  const AOS = await import('aos');
  AOS.init();
  console.log("LOADDEDEDEFD")
  document.getElementById('loadingPage').style.zIndex = '-1';
  document.getElementById('loadingPage').style.opacity = '0';
window.scrollTo(0,0);
 
}
    name="splash"
}
</script>

<style lang="scss" scoped>
@import "../assets/css/splash.css";

</style>
