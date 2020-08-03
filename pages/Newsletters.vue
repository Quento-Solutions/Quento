<template>
     <div class="vx-row justify-center px-8">
              <h1 class="mb-12 text-title text-5xl mr-2">
                Newsletter Articles
              </h1>
              <div class="w-full text-ginger mb-20">
                <h1 v-html="loaded? titles[0]:''" ></h1>
                <p v-html="loaded? $md.render(contents[0]):''" ></p>
              </div>
               <div class="w-full text-ginger mb-20">
                <h1 v-html="loaded? titles[1]:''" ></h1>
                <p v-html="loaded? $md.render(contents[1]):''" ></p>
              </div> 
              <div class="w-full text-ginger mb-20">
                <h1 v-html="loaded? titles[2]:''" ></h1>
                <p v-html="loaded? $md.render(contents[2]):''" ></p>
              </div>
              </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { newslettersStore } from '~/store'


@Component<Newsletters>({
    layout: 'main',
    async mounted()
  {
   this.GetNewsletters();
  }
})
export default class Newsletters extends Vue {
        loaded = false
        contents:string[] = []
        titles:string[] = []
    async GetNewsletters() {
      const self = this
    try {
       const newsletters = await newslettersStore.GetNewsletters().then(function(value){
         if (value) {
          for (let i = 0; i < value.length; i++){
          self.contents[i] = (value[i].content);
          self.titles[i] = (value[i].title);
          }
         }
       });
    } 
    catch (error)
    {
        console.log({error});
    }
    this.loaded = true;
    return;
    // console.log(this.note)
  }
}
</script>

<style lang="scss"></style>
