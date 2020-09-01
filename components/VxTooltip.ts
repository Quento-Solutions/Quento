import { VNode } from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import VsComponent from '~/mixins/VsMixin'
import { insertBody, setCordsPosition } from '~/utils/vuesax'

@Component<VxTooltip>({})
export default class VxTooltip extends VsComponent {
  activeTooltip: boolean = false
  isHoverTooltip: boolean = false

  tooltipRef: HTMLElement | null = null

  @Prop({}) value: any

  @Prop({ default: false, type: Boolean }) loading!: boolean

  @Prop({ default: false, type: Boolean }) bottom!: boolean

  @Prop({ default: false, type: Boolean }) left!: boolean

  @Prop({ default: false, type: Boolean }) right!: boolean

  @Prop({ default: false, type: Boolean }) notHover!: boolean

  @Prop({ default: false, type: Boolean }) shadow!: boolean

  @Prop({ default: false, type: Boolean }) interactivity!: boolean

  @Prop({ default: false, type: Boolean }) notArrow!: boolean

  @Prop({ default: false, type: Boolean }) square!: boolean

  @Prop({ default: false, type: Boolean }) circle!: boolean

  @Prop({ default: false, type: Boolean }) border!: boolean

  @Prop({ default: false, type: Boolean }) borderThick!: boolean

  @Prop({ default: null, type: String }) delay!: any

  insertTooltip() {
    const tooltip = this.$refs.tooltip as HTMLElement
    this.tooltipRef = insertBody(tooltip, document.body)

    let position: 'top' | 'bottom' | 'left' | 'right' = 'top'
    if (this.bottom) {
      position = 'bottom'
    } else if (this.left) {
      position = 'left'
    } else if (this.right) {
      position = 'right'
    }

    setCordsPosition(tooltip, this.ContentRef as HTMLElement, position)
    this.$nextTick(() => {
      this.changeColor()
    })
  }

  get ContentRef()
  {
    return this.$refs.content as HTMLElement
  }

  handlerMouseEnter() {
    if (this.delay) {
      setTimeout(() => {
        this.activeTooltip = true
        this.$nextTick(() => {
          this.insertTooltip()
        })
      }, Number(this.delay))
    } else {
      this.activeTooltip = true
      this.$nextTick(() => {
        this.insertTooltip()
      })
    }
  }

  removeTooltip() {
    this.activeTooltip = false
    this.$emit('input', false)
  }

  handleResize() {
    let position: 'top' | 'bottom' | 'left' | 'right' = 'top'

    if (this.bottom) {
      position = 'bottom'
    } else if (this.left) {
      position = 'left'
    } else if (this.right) {
      position = 'right'
    }
    const tooltip = this.$refs.tooltip as HTMLElement

    if (!tooltip) {
      return
    }
    this.$nextTick(() => {
      setCordsPosition(tooltip, (this.ContentRef), position)
    })

    for (let index = 0; index < 300; index++) {
      setTimeout(() => {
        setCordsPosition(tooltip, this.ContentRef, position)
      }, index)
    }
  }

  handleMouseDownNotHover(evt: any) {
    if (
      !evt.target.closest('.vs-tooltip') &&
      !evt.target.closest('.vs-tooltip-content')
    ) {
      this.removeTooltip()
    }
  }

  @Watch('value')
  handleWatchValue(val: boolean) {
    this.activeTooltip = val
    if (val) {
      this.$nextTick(() => {
        this.insertTooltip()
      })
    }
  }

  mounted() {
    window.addEventListener('resize', this.handleResize)
    if (this.notHover) {
      window.addEventListener('mousedown', this.handleMouseDownNotHover)
    }

    window.addEventListener('touchstart', this.handleMouseDownNotHover)
  }

  beforeDestroy() {
    this.tooltipRef?.remove()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('mousedown', this.handleMouseDownNotHover)
  }

  public render(h: any): VNode {
    const loading = h('div', {
      staticClass: 'vs-tooltip__loading'
    })

    const tooltip = h(
      'div',
      {
        staticClass: 'vs-tooltip vx-tooltip',
        ref: 'tooltip',
        class: [
          {
            top: !this.bottom && !this.left && !this.right,
            bottom: this.bottom,
            left: this.left,
            right: this.right,
            shadow: this.shadow,
            notArrow: this.notArrow,
            square: this.square,
            circle: this.circle,
            border: this.border,
            borderThick: this.borderThick,
            loading: this.loading
          }
        ],
        on: {
          click: () => {
            console.log(this.activeTooltip)
          }
        }
      },
      [this.$slots.tooltip, this.loading && loading]
    )

    return h(
      'div',
      {
        staticClass: 'vs-tooltip-content relative',
        ref: 'content',
        on: {
          mouseenter: () => {
            if (!this.notHover) {
              this.handlerMouseEnter()
            }
          },
          mouseleave: () => {
            if (!this.notHover) {
              if (this.interactivity) {
                setTimeout(() => {
                  if (!this.isHoverTooltip) {
                    this.removeTooltip()
                  }
                }, 250)
              } else {
                this.removeTooltip()
              }
            }
          }
        }
      },
      [
        h(
          'transition',
          {
            props: {
              name: 'vs-tooltip'
            }
          },
          [this.activeTooltip && tooltip]
        ),
        this.$slots.default
      ]
    )
  }
}
