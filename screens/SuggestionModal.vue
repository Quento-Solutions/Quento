<template>
  <vs-dialog v-model="active" id="suggestionsPopup" class="content-popup" scroll overflow-hidden>
    <template #header>
      <div class="pt-10">
        <h4 class="not-margin text-title text-4xl">
          Post A
          <b>Suggestion</b>
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
      ></VsTextarea>
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center pb-8 px-12">
        <vs-button
          class="md:w-1/2 p-8 w-full"
          style="padding: 8;"
          size="xl"
          success
          :disabled="formErrors"
          @click="PostSuggestion()"
        >Post</vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'

import {suggestionsStore} from '~/store'
import VsTextarea from '~/components/VsTextarea.vue'

@Component<SuggestionModal>({
  components: {
    VsTextarea
  }
})
export default class SuggestionModal extends Vue {
  @Prop({default: false}) value!: boolean

  get active() {
    return this.value
  }
  set active(value: boolean) {
    this.$emit('input', value)
  }
  title = ''
  contents = ''

  async PostSuggestion() {
    if (this.formErrors) {
      this.$vs.notification({
        color: 'danger',
        title: 'Fill Out All Fields!'
      })
      return
    }

    const loading = this.$vs.loading()
    const payload = {title: this.title, contents: this.contents}
    try {
      await suggestionsStore.PostSuggestion(payload)
      this.$vs.notification({
        color: 'success',
        title: 'Suggestion Posted!',
        text:
          'Thank you for your insights, we will notify you once it is implemented!'
      })
      await suggestionsStore.GetSuggestions()
    } catch (error) {
      this.$qto.error(error)
    }
    this.state = false

    loading.close()
  }

  set state(value: boolean) {
    this.title = this.contents = ''
    this.active = false
  }
  get state() {
    return this.active
  }

  get formErrors() {
    return !this.contents || !this.title
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