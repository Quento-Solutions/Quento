<template>
  <div class="relative disable-scrollbars overflow-x-hidden" style="width : 100vw; height : 100vh;">
    <div class="p-8 obelisk bg-cover bg" style="">
      <component :is="currentTabComponent"/>
      <FooterCard />

    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import AOS from 'aos'

import { Context, windowStore, navigationStore } from '~/store'

import Home from "~/screens/Home.vue";

import SignUp from '~/screens/SignUp.vue';
import Login from '~/screens/Login.vue';
import FooterCard from '~/components/FooterCard.vue'
import Blank from '~/screens/Blank.vue';

@Component({
  components: { FooterCard, Home, Login, SignUp, Blank },
  mounted() {
    AOS.init({
      duration: 1000
    })
  },

})
export default class extends Vue { 


  // currentTabComponent = Login;
  get currentTabComponent()
  {
    // return Blank;

    switch(navigationStore.currentPage)
    {
      case "login":
        return Login;
      case "signup":
        return SignUp;
      default : 
        return Login;
    }
  }



  get windowDimensions() {
    return navigationStore.currentPage
  }
  active = 'components'
  formatDate(date: Date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en', options)
  }
}
</script>

<style lang="scss">
.obelisk {
  width: 120vw;
  height: calc(100vw/var(--bg-aspect-ratio));
  position : absolute;
  background-position: center top;
  transform: translate( -8% , -20%);
  background-image: url('https://images.unsplash.com/photo-1585792180666-f7347c490ee2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1356&q=80');
}

.disable-scrollbars {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
}

.article-card {
  border-radius: 8px;
}
.article-card a {
  background-color: #fff;
  border-radius: 8px;
}
.article-card img div {
  border-radius: 8px 0 0 8px;
}

</style>
