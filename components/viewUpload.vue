<template>
  <transition name="view-upload">
    <div
      ref="view"
      class="view-upload"
      @click="closeView">
      <img
        :src="src"
        alt="image">
    </div>
  </transition>
</template>
<script>
const utils = {
  insertBody(elx, parent){
    let bodyx = parent ? parent : document.body
    bodyx.insertBefore(elx, bodyx.firstChild)
  },
  removeBody(element, parent) {
    let bodyx = parent ? parent : document.body
    bodyx.removeChild(element);
  },
  changePosition(elx,content,conditional){
    let topx = 0
    let leftx = 0
    let widthx = 0
    let scrollTopx = window.pageYOffset || document.documentElement.scrollTop;
    if(elx.getBoundingClientRect().top + 300 >= window.innerHeight) {
      setTimeout( ()=> {
        if(conditional){
          topx = (elx.getBoundingClientRect().top - content.clientHeight) + scrollTopx
        } else {
          topx = (elx.getBoundingClientRect().top - content.clientHeight + elx.clientHeight) + scrollTopx
        }
      }, 1);

    } else {
      topx = conditional?(elx.getBoundingClientRect().top + elx.clientHeight) + scrollTopx + 5:elx.getBoundingClientRect().top + scrollTopx
    }

    leftx = elx.getBoundingClientRect().left
    widthx = elx.offsetWidth

    let cords = {
      left: `${leftx}px`,
      top: `${topx}px`,
      width: `${widthx}px`
    }

    return cords
  },
};
  export default {
    name:'ViewUpload',
    props:{
      active:{
        default:false,
        type:Boolean
      },
      src:{
        default:null,
        type:String
      }
    },
    mounted(){
      utils.insertBody(this.$refs.view)
    },
    upload(){
      utils.insertBody(this.$refs.view)
    },
    methods:{
      closeView(evt){
        if(evt.target.tagName != 'IMG'){
          this.$parent.viewActive = false
        }
      }
    }
  }
</script>