<template>
  <div id="home-page">
    <vs-dialog v-model="active" id="suggestionsPopup" scroll>
      <template #header>
        <div class="pt-10">
          <h4 class="not-margin text-title text-4xl">
            Post A <b>Suggestion</b>
          </h4>
        </div>
      </template>

      <div class="con-form md:p-4 lg:p-8 p-2 flex flex-col justify-evenly overflow-x-hidden">
        <vs-input
          v-model="title"
          placeholder="You should sell chocolate"
          label="Title"
          class="block mb-6 w-6 mt-6"
          width="w-6"
        >
          <template #icon>
            <i class="bx bx-highlight" primary></i>
          </template>
        </vs-input>
        <VsTextarea
          v-model="contents"
          placeholder="Sourced from Switzerland, shipped and packaged in Columbia, distributed and sold in the U.S."
          class="block"
          height="20rem"
          label="Feature Suggestion"
        >
        </VsTextarea>
      </div>

      <template #footer>
        <div class="footer-dialog vx-row justify-center pb-8 px-12">
          <vs-button class="md:w-1/2 p-8 w-full" style="padding : 8" size="xl" success :disabled="formErrors" @click="PostSuggestion()">
            Post
          </vs-button>
        </div>
      </template>
    </vs-dialog>
    <vs-row justify="center">
      <vs-col class="vx-col w-full">
        <VxCard
          class="text-center greet-user p-8"
          title-color="#000"
          title="Suggestions"
          content-color="black"
        >
          <template slot="no-body">


            <!-- <feather-icon icon="AwardIcon" class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow" svgClasses="h-8 w-8"></feather-icon> -->
            <div class="vx-row justify-center px-8">
              <h1 class="mb-12 text-title text-5xl mr-2">
                Welcome To The Club
              </h1>
              <vs-avatar style="width: 5rem; height: 5rem;">
                <img
                  src="https://vignette.wikia.nocookie.net/leagueoflegends/images/6/6a/LoR_Cheers_Emote.png/revision/latest/top-crop/width/300/height/300?cb=20200429081948"
                />
              </vs-avatar>
            </div>

            <vs-row justify="center" class="vx-row mt-10">
              <div
                class="p-6 vx-row md:justify-end justify-center w-full md:w-1/2"
              >
                <vs-button
                  type="filled"
                  color="warning"
                  class="vx-col shadow-md m-4 text-bold"
                  style="font-weight: bold;"
                  @click="GetSuggestions()"
                  >Subscribe To News Letter
                </vs-button>
              </div>
              <div
                w="6"
                class="p-6 vx-row md:w-1/2 w-full md:justify-start justify-center"
              >
                <vs-button
                  color="success"
                  class="vx-col shadow-md m-4 text-bold"
                  style="font-weight: bold;"
                  @click="active = !active"
                >
                  Suggest Features
                </vs-button>
              </div>
            </vs-row>
          </template>
        </VxCard>
      </vs-col>
    </vs-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { windowStore, authStore, suggestionsStore } from '~/store'
import VsTextarea from '~/components/VsTextarea.vue'

import VxCard from '~/components/VxCard.vue'

@Component({
  layout: 'main',
  components: { VxCard, VsTextarea }
})
export default class Suggestions extends Vue {

  active = false

  title = ""
  contents = '';
  GetSuggestions() {
    suggestionsStore.GetSuggestions()
  }

  async PostSuggestion()
  {
    if(this.formErrors) return;

    const loading  = this.$vs.loading();
    const payload = { title : this.title, contents : this.contents };
    try 
    {
        await suggestionsStore.PostSuggestion(payload);
        this.$vs.notification({
            color : "success",
            title : "Suggestion Posted!",
            text: "Thank you for your insights, we will notify you once it is implemented!"
        })
        this.active = false;
        loading.close();
    }
    catch(error)
    {
        this.$vs.notification({
            color : 'danger',
            title : "An Error Occurred While Posting Your Suggestion"
        })
        this.active = false;
        loading.close();

    }
  }

    get formErrors()
    {
        return !this.contents || !this.title
    }
  pushComingSoon() {
    this.$router.push('/coming-soon')
  }
}
</script>

<style lang="scss">
#suggestionsPopup {
  .vs-dialog {
    min-width: 40vw !important;
    min-height: 60vh !important;
  }
}
</style>
