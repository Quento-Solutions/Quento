<template>
  <div class="relative">
    <div class="vx-navbar-wrapper navbar-default p-0" style="z-index: 1;">
      <vs-navbar
        class="navbar-custom navbar-skelton navbar-reduced rounded-md shadow-md p-1"
    
        center-collapsed
      >
        <template #left> 
            <vs-avatar class="menuIcon icon" v-if="windowSmall" @click.stop="toggleSidenav()">
                <i class="bx bx-menu" :style="`font-size: 2rem;`"/>
            </vs-avatar>
        </template>
    

        <template #right>
          <vs-avatar
            class="notificationIcon icon"
            badge
            badge-position="top-right"
          >
            <i class="bx bx-bell" :style="`font-size: 2rem;`"></i>
            <template slot="badge">
              <div class="text">0</div>
            </template>
          </vs-avatar>

          <h3 class="text-title">{{userName}}</h3>

          <vs-navbar-group id="profile">
            <vs-avatar class="profileIcon icon" badge badge-color="success">
              <img v-if="photoURL" :src="photoURL" />
                <i v-else class="bx bx-user-circle" :style="`font-size: 2rem;`"/>

            </vs-avatar>
            <template #items>
              <vs-navbar-item>
                Profile
              </vs-navbar-item>
              <vs-navbar-item>
                Settings
              </vs-navbar-item>
              <vs-navbar-item warning @click="SignOut()" class="bg-danger rounded-md text-white" style="color : white"> 
                Sign Out
              </vs-navbar-item>
            </template>
          </vs-navbar-group>
        </template>
      </vs-navbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { windowStore, authStore } from '~/store'
@Component<TopNav>({
  components: {}
})
export default class TopNav extends Vue {

    get windowSmall() {
        return windowStore.isSmallScreen;
    }
    toggleSidenav()
    {
        windowStore.SetSidenavState(true);
    }
    get userName()
    {
        console.log(authStore.user);
        return authStore.user?.displayName
    }
    get photoURL()
    {
        return authStore.user?.photoURL;
    }
    async SignOut()
    {
       
       try {
           await authStore.signOut();
           this.$router.push('/')
       }
       catch (error)
       {

       }
    }
}
</script>

<style lang="scss">
.vx-navbar-wrapper {
  .navbar-custom {
    top: 3vh;
    border-radius: 1rem !important;
    width: 93%;
  }
  .notificationIcon {
    margin-right: 2rem;
  }
  .icon {
    width: 4rem;
    height: 4rem;
  }
  #profile {
    .vs-navbar__group__items {
      min-width: 0 !important;
      // max-width : 100%;
      width : 150%;
      transform: translate(-25%, 90%);
    }
  }
}
</style>
