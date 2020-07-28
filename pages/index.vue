<template>
  <div>
    <div class="p-8 obelisk bg-cover bg-center" style="">
      <component :is="currentTabComponent"/>
    </div>
    <Sidebar />
    <FooterCard />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import AOS from 'aos'

import { Context, windowStore, navigationStore } from '~/store'

import { Button } from 'vuesax'
import Home from '~/screens/home.vue'
import SignUp from '~/screens/SignUp.vue';
import Login from '~/screens/Login.vue';
import FooterCard from '~/components/FooterCard.vue'
import Sidebar from '~/components/Sidebar.vue'
import Card from '~/components/VxCard.vue'

@Component({
  components: { Card, Button, Sidebar, FooterCard, Home, Login, SignUp },
  mounted() {
    window.addEventListener('resize', windowStore.handleResize)
    windowStore.handleResize()

    console.log({ windowHello: windowStore.windowHeight })

    AOS.init({
      duration: 1000
    })
  }
})
export default class extends Vue {

  // currentTabComponent = Login;
  get currentTabComponent()
  {
    switch(navigationStore.currentPage)
    {
      case "login":
        return Login;
      case "signup":
        return SignUp;
      default : 
        return Home;
    }
  }


  async asyncData({ $content, params }: Context) {
    const articles = await $content('articles', params.slug)
      .only(['title', 'description', 'img', 'slug', 'author'])
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      articles
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
  width: 120%;
  height: 120%;
  transform: translate(-7.5%, -7.5%);
  position: fixed;
  background-image: url('https://images.unsplash.com/photo-1585792180666-f7347c490ee2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1356&q=80');
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
