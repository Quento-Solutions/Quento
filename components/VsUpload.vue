<template>
  <div class="con-upload vx-row">
    <view-upload
      v-if="viewActive"
      :src="viewSrc" />

    <div class="con-img-upload vx-row">
      <!-- <transition-group v-for="(img,index) in getFilesFilter" :key="index" name="upload"> -->
      <div
        v-for="(img,index) in getFilesFilter"
        :class="{
          'fileError':img.error,
          'removeItem':itemRemove.includes(index)
        }"
        :key="index"
        class="img-upload">
        <vs-button
          class="btn-x-file"
          type="button"
          @click="removeFile(index)">
          <i
            translate="no"
            class="bx bx-x">
          </i>
        </vs-button>
        <button
          v-if="showUploadButton"
          :class="{
            'on-progress':img.percent,
            'ready-progress':img.percent >= 100
          }"
          :style="{
            height: `${img.percent}%`
          }"
          class="btn-upload-file"
          @click="upload(index)">
          <i
            translate="no"
            class="material-icons notranslate">
            {{ img.percent >= 100?img.error?'report_problem':'cloud_done':'cloud_upload' }}
          </i>
          <span>{{ img.percent }} %</span>
        </button>
        <img
          v-if="img.src"
          :style="{
            maxWidth:img.orientation == 'h'?'100%':'none',
            maxHeight:img.orientation == 'w'?'100%':'none'
          }"
          :key="index"
          :src="img.src"
          @touchend="viewImage(img.src,$event)"
          @click="viewImage(img.src,$event)">
        <h4
          v-if="!img.src"
          class="text-archive">
          <i
            translate="no"
            class="material-icons notranslate">
            description
          </i>
          <span>
            {{ img.name }}
          </span>
        </h4>
      </div>
      <!-- </transition-group > -->


      <div
        :class="{
          'on-progress-all-upload':percent != 0,
          'is-ready-all-upload':percent >= 100,
          'disabled-upload':$attrs.hasOwnProperty('disabled') || limit?(srcs.length - itemRemove.length) >= Number(limit):false
        }"
        class="con-input-upload">
        <input
          ref="fileInput"
          v-bind="$attrs"
          :disabled="$attrs.disabled || limit?(srcs.length - itemRemove.length) >= Number(limit):false"
          type="file"
          @change="getFiles">
        <span class="text-input">
          {{ text }}
        </span>
        <span
          :style="{
            width:`${percent}%`
          }"
          class="input-progress">

        </span>
        <vs-button
          v-if="showUploadButton"
          :disabled="filesx.length == 0"
          type="button"
          title="Upload"
          class="btn-upload-all vs-upload--button-upload" 
          @click="upload('all')">
          <i
            class="material-icons notranslate"></i>
        </vs-button>
      </div>
    </div>
  </div>
</template>
<script>
  import viewUpload from './viewUpload'
  var lastTap = 0;
  export default {
    name: 'VsUpload',
    components:{
      viewUpload
    },
    inheritAttrs:false,
    props:{
      fileName:{
        default:null,
        type:String
      },
      text:{
        default:'Upload File',
        type:String
      },
      textMax:{
        default:'Maximum of files reached',
        type:String
      },
      limit:{
        default:null,
        type:[Number,String]
      },
      action:{
        default:null,
        type:String
      },
      headers:{
        default:null,
        type:Object
      },
      data: {
        default: null,
        type: Object
      },
      automatic:{
        default: false,
        type: Boolean
      },
      showUploadButton: {
        default: true,
        type: Boolean
      },
      singleUpload: {
        default: false,
        type: Boolean
      }
    },
    data:()=>({
      inputValue:null,
      type:null,
      srcs:[],
      filesx:[],
      itemRemove:[],
      percent:0,
      viewActive:false,
      viewSrc:null,
    }),
    computed:{
      getFilesFilter() {
        let files = this.srcs.filter((item) => {
          return !item.remove
        })
        return files
      },
      postFiles(){
        let postFiles = Array.prototype.slice.call(this.filesx);
        postFiles = postFiles.filter((item)=>{
          return !item.hasOwnProperty('remove')
        })
        return postFiles.length
      },
    },
    watch:{
      percent(){
        if(this.percent >= 100) {
          this.srcs.forEach((file)=>{
            file.percent = 100
          })
          setTimeout(()=>{
            this.percent = 0
          },1000)
        }
      }
    },
    methods:{
      viewImage(src,evt){
        var timeout;
        var eventx = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch)) ? 'touchstart' : 'click';
        if(eventx == 'click'){
          this.viewActive = true
          this.viewSrc = src
        } else {
          if(evt.type == 'touchend'){
            var currentTime = new Date().getTime();
            var tapLength = currentTime - lastTap;
            clearTimeout(timeout);
            if (tapLength < 500 && tapLength > 0) {
              this.viewActive = true
              this.viewSrc = src
              event.preventDefault();
            }
            lastTap = currentTime;
          }
        }
      },
      removeFile(index){
        this.itemRemove.push(index)
        this.$emit('on-delete', this.filesx[index])
        setTimeout(()=>{
            this.srcs[index].remove=true
          this.filesx[index].remove = true
        },301)
      },
      getFiles(e) {
        this.$emit('update:vsFile', e.target.value)
        let _this = this
        function uploadImage(e) {
          let orientation = 'h'
          var image = new Image();
          image.src = e.target.result;
          image.onload = function() {
            if(this.width > this.height){
              orientation = 'w'
            }
            switchImage(this,orientation);
          }
        }
        function switchImage(image,orientation) {
          _this.srcs.push({
            src:image.src,
            orientation:orientation,
            type:_this.typex,
            percent:null,
            error:false,
            remove:null
          })
        }
        var files = e.target.files;
        let count = (this.srcs.length - this.itemRemove.length)
        for (const file in files) {
          if (files.hasOwnProperty(file)) {
            if(this.limit) {
              count ++
              if( count > Number(this.limit) ) {
                break
              }
            }
            var reader  = new FileReader();
            const filex = files[file];
            if (/image.*/.test(filex.type)) {
              this.typex = 'image'
              this.filesx.push(filex)
              reader.onload = uploadImage;
              reader.readAsDataURL(filex);
            } else if (/video.*/.test(filex.type)) {
              this.typex = 'video'
              this.filesx.push(filex)
              _this.srcs.push({
                src:null,
                name:filex.name,
                type:'video',
                percent:null,
                error:false,
                remove:null
              })
            } else {
              this.filesx.push(filex)
              _this.srcs.push({
                src:null,
                name:filex.name,
                percent:null,
                error:false,
                remove:null
              })
            }
            this.$emit('change', e.target.value, this.filesx)
          }
        }
        const input = this.$refs.fileInput
        input.type = 'text'
        input.type = 'file'
        if (this.automatic) {
          this.upload('all')
        }
      },
      upload(index) {
        const formData = new FormData();
        let postFiles = Array.prototype.slice.call(this.filesx);
        if(typeof index == 'number'){
          postFiles = [postFiles[index]]
        } else if (index == 'all'){
          postFiles = postFiles.filter((item)=>{
            return !item.hasOwnProperty('remove')
          })
        }
        const data = this.data || {};
        for (var key in data) {
          formData.append(key, data[key]);
        }
        if(this.singleUpload) {
          postFiles.forEach((filex)=>{
            const formData = new FormData();
            for (var key in data) {
              formData.append(key, data[key]);
            }
            formData.append(this.fileName, filex, filex.name)
            this.uploadx(index, formData)
          })
        } else {
          postFiles.forEach((filex)=>{
            formData.append(this.fileName, filex, filex.name)
          })
          this.uploadx(index, formData)
        }
      },
      uploadx(index, formData){
        let self = this
        const xhr = new XMLHttpRequest();
        xhr.onerror = function error(e) {
          self.$emit('on-error',e)
          if(typeof index == 'number'){
            self.srcs[index].error = true
          }
        };
        xhr.onload = function onload(e) {
          if (xhr.status < 200 || xhr.status >= 300) {
            self.$emit('on-error',e)
            if(typeof index == 'number'){
              self.srcs[index].error = true
            }
          } else {
            self.$emit('on-success',e)
          }
        }
        if (xhr.upload) {
          xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
              let percent = e.loaded / e.total * 100;
              if(typeof index == 'number'){
                self.srcs[index].percent = Math.trunc(percent)
              } else {
                self.percent = Math.trunc(percent)
              }
            }
          };
        }
        xhr.withCredentials = true;
        xhr.open('POST', this.action, true);
        const headers = this.headers || {};
        for (let head in headers) {
          if (headers.hasOwnProperty(head) && headers[head] !== null) {
            xhr.setRequestHeader(head, headers[head]);
          }
        }
        xhr.send(formData)
      },
    }
  }
</script>

<style>
.con-img-upload, .con-img-upload .img-upload {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
}
.con-img-upload {
    width: 100%;
    background: #fff;
    margin-top: 5px;
    padding-right: 5px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-column-gap: 5px;
    -moz-column-gap: 5px;
    column-gap: 5px;
}
.con-input-upload {
    background: #f5f5f5;
    width: 200px;
    height: 200px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 8px;
    position: relative;
    -webkit-transition: all .25s ease;
    transition: all .25s ease;
    border: 1px dashed rgba(0,0,0,.1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 15px;
}
.vuesax-app-is-ltr .con-input-upload {
    float: left;
}
.con-input-upload input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    left: 0;
    top: 0;
    cursor: pointer;
}

.con-input-upload .text-input {
    min-width: 200px;
    display: block;
    text-align: center;
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    font-weight: 700;
}
* {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
}

.con-input-upload .input-progress {
    height: 100%;
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 29%;
    background: rgba(var(--vs-primary),1);
    border-radius: 10px;
}
.vs-upload--button-upload:disabled {
    opacity: .4;
    pointer-events: none;
}
.vs-upload--button-upload {
    position: absolute;
    border: 0;
    padding: 4px;
        padding-right: 4px;
        padding-left: 4px;
    border-radius: 0 0 5px 5px;
    padding-left: 6px;
    padding-right: 6px;
    font-size: .8rem;
    z-index: 500;
    cursor: pointer;
    margin: 0;
    color: rgba(var(--vs-primary),1);
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    -webkit-box-shadow: 0 0 0 0 rgba(0,0,0,.05);
    box-shadow: 0 0 0 0 rgba(0,0,0,.05);
    background: rgba(0,0,0,.03);
    bottom: 0;
    width: 100%;
}

.vuesax-app-is-ltr .con-img-upload .img-upload {
    float: left;
}
.con-img-upload .img-upload {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: rgba(0,80,0,.5);
    background: #fff;
    -webkit-box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
    box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 200px;
    height: 200px;
    margin: 5px;
    cursor: pointer;
}
.con-img-upload, .con-img-upload .img-upload {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
}
.vuesax-app-is-ltr .con-img-upload .img-upload .btn-x-file {
    right: 5px;
}
.con-img-upload .img-upload .btn-x-file {
    display: block;
    position: absolute;
    top: 5px;
    padding: 0;
    margin: 0;
    -webkit-transform: translate(20%,-20%);
    transform: translate(20%,-20%);
    background: transparent;
    z-index: 300;
    opacity: 0;
    border: 0;
    cursor: pointer;
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    border-radius: 10px;
}
.con-img-upload .img-upload .btn-x-file i {
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    position: relative;
    padding: 4px;
    font-size: 1.4rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 5px;
    background: rgba(0,0,0,.1);
    color: #fff;
    text-shadow: 0 3px 10px rgba(0,0,0,.5);
}
.material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -moz-font-feature-settings: 'liga';
    -moz-osx-font-smoothing: grayscale;
}
.view-upload {
    position: fixed;
    left: 0;
    z-index: 15000000000;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.3);
    top: 0;
    padding: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}
.view-upload img {
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    border-radius: 10px;
    position: relative;
    display: block;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    -webkit-animation: imageRebound .7s ease !important;
    animation: imageRebound .7s ease !important;
    -webkit-box-shadow: 0 8px 30px 0 rgba(0,0,0,.25);
    box-shadow: 0 8px 30px 0 rgba(0,0,0,.25);
    background: #fff;
}
.con-img-upload, .con-img-upload .img-upload {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
}
.con-img-upload {
    width: 100%;
    background: #fff;
    margin-top: 5px;
    padding-right: 5px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-column-gap: 5px;
    -moz-column-gap: 5px;
    column-gap: 5px;
}
.con-upload {
    width: 100%;
    position: relative;
}
.con-img-upload .img-upload .btn-upload-file.ready-progress {
    border-top: 0 solid rgba(var(--vs-success),1);
    background: rgba(var(--vs-success),.5);
}
.con-img-upload .img-upload .btn-upload-file.on-progress {
    width: 100%;
    height: 20px;
    background: rgba(var(--vs-success),1);
    border-top: 1px solid rgba(var(--vs-success),1);
    bottom: 0;
    -webkit-transform: translate(0);
    transform: translate(0);
    left: 0;
    opacity: 1 !important;
    overflow: hidden;
    border-radius: 0;
    pointer-events: none;
}
.con-img-upload .img-upload:hover .btn-upload-file {
    opacity: 1;
    -webkit-transform: translate(-50%,65%);
    transform: translate(-50%,65%);
}
.con-img-upload .img-upload.fileError .btn-upload-file {
    background: rgba(var(--vs-danger),.3) !important;
}
.con-img-upload .img-upload .btn-x-file i {
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    position: relative;
    padding: 4px;
    font-size: 1.4rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 5px;
    background: rgba(0,0,0,.1);
    color: #fff;
    text-shadow: 0 3px 10px rgba(0,0,0,.5);
}
.material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -moz-font-feature-settings: 'liga';
    -moz-osx-font-smoothing: grayscale;
}
.vuesax-app-is-ltr .con-img-upload .img-upload .btn-x-file {

    right: 5px;

}
.con-img-upload .img-upload:hover .btn-x-file {

    opacity: 1;
    -webkit-transform: translate(0);
    transform: translate(0);

}
.con-img-upload .img-upload .btn-x-file {

    display: block;
    position: absolute;
    top: 5px;
    padding: 0;
    margin: 0;
    -webkit-transform: translate(20%,-20%);
    transform: translate(20%,-20%);
    background: transparent;
    z-index: 300;
    opacity: 0;
    border: 0;
    cursor: pointer;
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    border-radius: 10px;

}
.con-img-upload .img-upload.removeItem {
    -webkit-transition: all .3s ease,height .2s ease .2s;
    transition: all .3s ease,height .2s ease .2s;
    opacity: 0 !important;
    width: 0 !important;
    visibility: hidden;
    margin: 0 !important;
    height: 0 !important;
}
.con-img-upload .img-upload.removeItem {
    -webkit-transition: all .3s ease,height .2s ease .2s;
    transition: all .3s ease,height .2s ease .2s;
    opacity: 0 !important;
    width: 0 !important;
    visibility: hidden;
    margin: 0 !important;
    height: 0 !important;
}
</style>