import Vue from 'vue'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
const VueVideoPlayer = require('vue-video-player/dist/ssr')
const VueCountdown = require('@chenfengyuan/vue-countdown');
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css'

const swiperOption = {
  slidesPerView: 5,
  spaceBetween: 50,
  // init: false,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  breakpoints: {
    1024: {
      slidesPerView: 3,
      spaceBetween: 40
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 20
    }
  }
}
Vue.use(VueAwesomeSwiper, swiperOption);

Vue.component("Countdown", VueCountdown);
Vue.use(VueVideoPlayer);
Vue.use(PerfectScrollbar);
var filter = function(text : string, length : number, clamp : string){
    clamp = clamp || '...';
    var node = document.createElement('div');
    node.innerHTML = text;
    var content = node.textContent;
    return content!.length > length ? content!.slice(0, length) + clamp : content;
};

Vue.filter('truncate', filter);

import {
    VueFlux,
    FluxCaption,
    FluxControls,
    FluxIndex,
    FluxPagination,
    FluxPreloader
  } from 'vue-flux'

Vue.component('vue-flux', VueFlux);
Vue.component('flux-caption', FluxCaption);
Vue.component('flux-controls', FluxControls);
Vue.component('flux-index', FluxIndex);
Vue.component('flux-pagination', FluxPagination);
Vue.component('flux-preloader', FluxPreloader);
