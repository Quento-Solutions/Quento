<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    class="layout--main"
    :class="[navbarClasses, footerClasses, { 'app-page': isAppPage }]"
  >
    <!-- onboarding, but everywhere 🤯 -->
    <UserGuideModal></UserGuideModal>
    <UserInfoModal></UserInfoModal>
    <Sidebar @focus="handleFocus" @focusout="handleFocusOut" tabindex="0"></Sidebar>

    <div
      id="content-area"
      :class="[contentAreaClass, { 'show-overlay': bodyOverlay, 'show-lower-overlay' : lowerOverlay, 'sidebar-open' : sidebarOpen }]"
    >

      <!-- A blur of sorts for the background -->
      <div id="content-overlay" />

      <div class="content-wrapper"><!--  CONTENT WRAPPER -->
        
        <!-- NAVBAR -->
        <TopNav
          :navbarColor="navbarColor"
          :class="[
            { 'text-white': isNavbarDark && !isThemeDark },
            { 'text-base': !isNavbarDark && isThemeDark }
          ]"
        />

        <div class="router-view"  > <!-- Router View -->
          <div class="router-content" :class="{ 'mt-0': navbarType == 'hidden' }"> <!-- Router Content -->
            
            <!-- SPECIAL but not in a good way 😡-->
            <transition :name="routerTransition"> <!-- Add a transition -->
              <div class="router-header flex flex-wrap items-center mb-6" v-if="$route.meta.breadcrumb || $route.meta.pageTitle"><!-- Router Header? -->
                <div
                  class="content-area__heading"
                  :class="{
                    'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light':
                      $route.meta.breadcrumb
                  }"
                >
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div>

                <!-- BREADCRUMB -->
                <vx-breadcrumb
                  class="ml-4 md:block hidden"
                  v-if="$route.meta.breadcrumb"
                />

                <!-- DROPDOWN -->
                <h1>A dropdown</h1>
                <vs-dropdown
                  class="ml-auto md:block hidden cursor-pointer"
                  vs-trigger-click
                >
                  <vs-button
                    radius
                    icon="icon-settings"
                    icon-pack="feather"
                  ></vs-button>

                  <vs-dropdown-menu class="w-32">
                    <vs-dropdown-item>
                      <div class="flex items-center">
                        <feather-icon
                          icon="UserIcon"
                          class="inline-block mr-2"
                          svgClasses="w-4 h-4"
                        />
                        <span>Profile</span>
                      </div>
                    </vs-dropdown-item>

                    <vs-dropdown-item>
                      <div class="flex items-center">
                        <feather-icon
                          icon="CheckSquareIcon"
                          class="inline-block mr-2"
                          svgClasses="w-4 h-4"
                        />
                        <span>Tasks</span>
                      </div>
                    </vs-dropdown-item>

                    <vs-dropdown-item>
                      <div class="flex items-center">
                        <feather-icon
                          icon="MailIcon"
                          class="inline-block mr- 2"
                          svgClasses="w-4 h-4"
                        />
                        <span>Inbox</span>
                      </div>
                    </vs-dropdown-item>
                  </vs-dropdown-menu>
                </vs-dropdown>
                
              </div>
            </transition>

            <div class="content-area__content"> <!-- Content-area__content -->
              <transition :name="routerTransition" mode="out-in">
                <!-- AND NOW, ACTUAL CONTENT -->
                <nuxt />
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, mixins, Watch } from 'nuxt-property-decorator'

import Sidebar from '~/components/Sidebar.vue'
import TopNav from '~/components/TopNav.vue'
import UserGuideModal from '~/screens/UserGuideModal.vue'
import UserInfoModal from '~/screens/UserInformationModal.vue';

import themeConfig from '~/utils/themeConfig'
import sidebarItems from '~/utils/sidebarItems'
import analytics from '~/plugins/fireanalytics';

// import TheCustomizer from "@/layouts/components/customizer/TheCustomizer.vue"
import { windowStore } from '~/store'
import UserMixin from '~/mixins/UserMixin';
import { User } from '~/types/user';

@Component<MainLayout>({
  components: {
    Sidebar,
    TopNav,
    UserGuideModal,
    UserInfoModal
  },
  watch: {
    isThemeDark(val) {
      if (this.navbarColor == '#fff' && val) {
        this.updateNavbarColor('#10163a')
      } else {
        this.updateNavbarColor('#fff')
      }
    }
  },
  mounted() {
    this.CheckUserLoggedIn(this.AuthUser, null);
    analytics?.setAnalyticsCollectionEnabled(true);
    window.addEventListener('resize', windowStore.handleResize)
    windowStore.handleResize()
  },
  created() {
    this.setSidebarWidth()
    if (this.navbarColor == '#fff' && this.isThemeDark) {
      this.updateNavbarColor('#10163a')
    } else {
      this.updateNavbarColor(this.navbarColor)
    }
  },
})
export default class MainLayout extends mixins(UserMixin) {
  @Watch("AuthUser")
  CheckUserLoggedIn(user : User, oldUser : User)
  {
    if(!user)
    {
      return this.$router.push("/auth/login");
    }
    if(!user.emailVerified)
    {
      return this.$router.push("/auth/verify-email")
    }
  }

  navbarType = themeConfig.navbarType || 'floating'
  navbarColor = themeConfig.navbarColor || '#fff'
  footerType = themeConfig.footerType || 'static'
  routerTransition = themeConfig.routerTransition || 'none'
  isNavbarDark = false
  routeTitle = 'this.$route.meta.pageTitle'
  sidebarItems = sidebarItems
  disableCustomizer = themeConfig.disableCustomizer
  windowWidth = 1080 //width of windows
  hideScrollToTop = themeConfig.hideScrollToTop
  disableThemeTour = themeConfig.disableThemeTour

  get lowerOverlay()
  {
    return windowStore.overlayVisible;
  }
  handleFocus()
  {
  }
  handleFocusOut()
  {
  }

  get sidebarOpen()
  {
    return !windowStore.isSmallScreen
  }
  get isAppPage() {
    // if(this.$route.path.includes('/apps/')) return true
    // else return false
    return false
  }
  get isThemeDark() {
    return false
  }
  get sidebarWidth() {
    return 'this.$store.state.sidebarWidth'
  }
  get bodyOverlay() {
    return windowStore.isSmallScreen && windowStore.sidenavIsOpen
  }
  get contentAreaClass() {
    if (this.sidebarWidth == 'default') return 'content-area-default'
    else if (this.sidebarWidth == 'reduced') return 'content-area-reduced'
    else if (this.sidebarWidth) return 'content-area-full'
  }
  get navbarClasses() {
    return {
      'navbar-hidden': this.navbarType == 'hidden',
      'navbar-sticky': this.navbarType == 'sticky',
      'navbar-static': this.navbarType == 'static',
      'navbar-floating': this.navbarType == 'floating'
    }
  }
  get footerClasses() {
    return {
      'footer-hidden': this.footerType == 'hidden',
      'footer-sticky': this.footerType == 'sticky',
      'footer-static': this.footerType == 'static'
    }
  }
  changeRouteTitle(title: string) {
    this.routeTitle = title
  }
  updateNavbarColor(val: string) {
    this.navbarColor = val
    if (val == '#fff') this.isNavbarDark = false
    else this.isNavbarDark = true
  }
  handleWindowResize(event: any) {
    this.windowWidth = event.currentTarget.innerWidth
    this.setSidebarWidth()
  }
  setSidebarWidth() {
    if (this.windowWidth < 1200) {
      // this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
      // this.$store.dispatch('updateSidebarWidth', 'no-sidebar')
      this.disableThemeTour = true
    } else if (this.windowWidth < 1200) {
      // this.$store.dispatch('updateSidebarWidth', 'reduced')
    } else {
      // this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
    }
  }
  toggleHideScrollToTop(val: any) {
    this.hideScrollToTop = val
  }
}
</script>

<style lang="scss" scoped>
#content-area
{
  .router-content
  {
    margin-top : 70px !important;

  }
  width : 100vw;
  &.sidebar-open 
  {
    float : right;
    width : calc(100vw - 50px);
  }
}
</style>
