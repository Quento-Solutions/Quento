<template>
  <div
    :class="{'withHover': actionable, 'fixedHeight': fixedHeight }"
    class="con-vs-card">
    <header
      v-if="hasSlot('header')"
      class="vs-card--header">
      <slot name="header"></slot>
    </header>

    <div
      v-if="hasSlot('media')"
      class="vs-card--media">
      <slot name="media"></slot>
    </div>

    <div
      v-if="hasSlot('default')"
      :class="{'fixedHeight': fixedHeight }"
      class="vs-card--content">
      <slot></slot>
    </div>

    <div
      v-if="hasSlot('extra-content')"
      class="vs-card-extra--content">
      <slot name="extra-content"></slot>
    </div>

    <footer
      v-if="hasSlot('footer')"
      :class="{'fixedHeight': fixedHeight }"
      class="vs-card--footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from "nuxt-property-decorator"

@Component<Card>({})
export default class Card extends Vue {
  @Prop({default : false}) actionable!: boolean;
  @Prop({default : false}) fixedHeight !: boolean;

  hasSlot(slot : string) {
    return this.$slots[slot] != undefined;
  }
}
</script>

<style scoped>
.card {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana,
    sans-serif;
  padding: 1rem;
  margin: 0.25rem;
  border: 0.25rem solid gainsboro;
}
</style>
