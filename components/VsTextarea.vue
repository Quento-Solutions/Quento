<template>
  <div class="vs-input-parent" :style="style" style="background-color : #f4f7f8;position:relative;">
    <vs-navbar v-if="markdownOptions" class="rounded-lg mt-4" id="markdown-options" style="background:none;pointer-events: none;">
      <template #left>
        <div class="vx-row rounded-full bg-white mb-3" style="pointer-events: auto;flex-wrap: nowrap;margin-left:-0.25rem">
          <vs-navbar-item class="bg-white markdown-option p-1" @click="insertHeader()">H</vs-navbar-item>
          <vs-navbar-item class="bg-white markdown-option p-1" @click="insertBold()">
            <b>B</b>
          </vs-navbar-item>
          <vs-navbar-item class="bg-white markdown-option p-1" @click="insertItalics()">
            <i>I</i>
          </vs-navbar-item>
          <vs-navbar-item class="bg-white markdown-option p-1" @click="insertIndent()">
            <i class="bx bx-left-indent" />
          </vs-navbar-item>
          <vs-navbar-item class="bg-white markdown-option p-1" @click="insertUl()">
            <i class="bx bx-list-ul" />
          </vs-navbar-item>
          <vs-navbar-item class="bg-white markdown-option p-1" @click="insertCodeblock()">
            <i class="bx bx-code" />
          </vs-navbar-item>
          <vs-navbar-item class="bg-white markdown-option p-1" @click="insertLink()">
            <i class="bx bx-link" />
          </vs-navbar-item>
        </div>
      </template>
    </vs-navbar>

    <div class="vs-input-content vs-input-content--has-label w-full flex-col justify-start">
      <label class="label" id="label">{{label}}</label>
      <textarea
        :value="value"
        v-bind="$attrs"
        v-on="listeners"
        class="vs-textarea border-none w-full h-full"
        :style="`height : ${inputHeight}px; min-height : 10rem`"
        ref="input"
        @keydown="keydownHandler"
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
  @Prop({ default: false }) expand!: boolean
  @Prop({ default: false }) markdownOptions!: boolean

  isFocus = false
  inputHeight = 0

  get input() {
    return this.$refs.input as HTMLTextAreaElement
  }
  @Watch('value')
  textAreaAdjust() {
    if (!this.expand || this.input.scrollHeight == this.input.clientHeight)
      return
    this.inputHeight =
      this.input.scrollHeight > this.input.clientHeight
        ? this.input.scrollHeight + 10
        : this.input.scrollHeight
  }

  keydownHandler(e: any) {
    var keyCode = e.keyCode || e.which

    if (keyCode == 9) {
      e.preventDefault()
      this.insertText('\t')
    }
  }
  insertLink() {
    this.insertText('[', 'Link Text', '](url)')
  }
  insertCodeblock() {
    this.insertText(' ` ', 'Code block text', ' `')
  }
  insertIndent() {
    this.insertText('\n> ', 'Indented Text', '\n')
  }
  insertUl() {
    this.insertText('\n- ', 'List Item')
  }
  insertHeader() {
    this.insertText('\n## ', 'Header Text')
  }
  insertBold() {
    this.insertText('**', 'Bold Text', '**')
  }
  insertItalics() {
    this.insertText('_', 'Italic Text', '_')
  }

  set contents(value: string) {
    this.$emit('input', value)
  }
  get contents() {
    return this.value
  }

  insertText(
    beforeText: string,
    highlightText: string = '',
    afterText: string = ''
  ) {
    if (this.input.selectionStart || this.input.selectionStart == 0) {
      var startPos = this.input.selectionStart
      var endPos = this.input.selectionEnd || this.input.selectionStart
      console.log({ startPos, endPos })

      this.contents =
        this.contents.substring(0, startPos) +
        beforeText +
        highlightText +
        afterText +
        this.contents.substring(endPos!)
      // This is dumb code don't do this at home.
      setTimeout(() => {
        this.input.focus()
        startPos += beforeText.length
        this.input.setSelectionRange(startPos, startPos + highlightText.length)
        this.textAreaAdjust()
      }, 10)
    } else {
      this.contents += beforeText + highlightText + afterText
    }
  }

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
#markdown-options {
  position: relative;
  min-height: auto !important;
  background-color: #f4f7f8;
  .markdown-option {
    opacity: 1;
    font-size: 1.2rem !important;
    font-weight: normal !important;
    padding: 8px !important;
  }
}

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
  overflow: hidden;
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