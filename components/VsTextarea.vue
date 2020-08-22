<template>
  <div class="vs-input-parent" :style="style">
    <div class="vs-input-content vs-input-content--has-label w-full flex-col justify-start">
      <label class="label" id="label">{{label}}</label>
      <textarea
        :value="value"
        v-bind="$attrs"
        v-on="listeners"
        class="vs-textarea border-none w-full h-full"
      />
      <label class="vs-input__label"></label>
      <div class="vs-input__afects"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from 'nuxt-property-decorator'
import _color from '~/assets/utils/color'

@Component<VsTextarea>({ components: {} })
export default class VsTextarea extends Vue {
  @Prop() value!: string
  @Prop({ required: false }) label?: string
  @Prop({ default: 'primary' }) color!: string
  @Prop({ required: false }) readonly height?: string
  @Prop({ required: false }) readonly width?: string
  isFocus = false

  get style() {
    let style = {
      height: this.height,
      width: this.width
    }
    return style
  }
  get listeners() {
    return {
      ...this.$listeners,
      input: (evt: any) => {
        this.$emit('input', evt.target.value)
      },
      focus: () => {
        this.focus()
      },
      blur: () => {
        this.blur()
      }
    }
  }
  focus() {
    this.isFocus = true
    this.$emit('focus')
  }
  blur() {
    this.isFocus = false
    this.$emit('blur')
  }
}
</script>


<style lang="scss">
.vs-input-parent {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-item-align: center;
  align-self: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  padding-bottom: 0;
}
.vs-textarea {
  resize: none;
  border: none !important;
  background: rgba(var(--vs-gray-2), 1);
  color: rgba(var(--vs-text), 1);
  border: 2px solid transparent !important;
  background: rgba(244, 247, 248, 1);
  padding: 7px 13px;
  border-radius: inherit;
  transition: all 0.25s ease;
  padding-left: 10px;
  margin: none;
}

.vs-input-content {
  height: 90%;
}

#label {
  float: left;
  width: 90%;
  font-size: 0.85rem;
  left: 0;
  transform: translate(-2px, -58%) !important;
}
</style>