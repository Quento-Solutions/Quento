import Vue from 'vue'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
const VueVideoPlayer = require('vue-video-player/dist/ssr')
const VueCountdown = require('@chenfengyuan/vue-countdown');

Vue.component("Countdown", VueCountdown);
Vue.use(VueVideoPlayer);
Vue.use(PerfectScrollbar);