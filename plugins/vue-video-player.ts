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