import Vue from 'vue'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
const VueVideoPlayer = require('vue-video-player/dist/ssr')
const VueCountdown = require('@chenfengyuan/vue-countdown');

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