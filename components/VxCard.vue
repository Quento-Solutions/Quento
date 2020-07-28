 <template>
    <div class="vx-card" ref="card" :class="[
        {'overflow-hidden': tempHidden},
        {'no-shadow': noShadow},
        {'rounded-none': noRadius},
        {'card-border': cardBorder},
        cardClasses ]" :style="cardStyles"
        v-on="$listeners">
        <div class="vx-card__header" v-if="hasHeader">

            <!-- card title -->
            <div class="vx-card__title">
                <h4 v-if="this.$props.title" :style="titleStyles" style="font-size : 1.5rem" :class="titleClasses">{{ title }}</h4>
                <h6 v-if="this.$props.subtitle" :style="subtitleStyles" :class="subtitleClasses">{{ subtitle }}</h6>
            </div>

            <!-- card actions -->
            <div class="vx-card__actions" v-if="hasAction">
                <slot name="actions">
                    <div class="vx-card__action-buttons p-2 m-0 rounded-md" v-if="(actionButtons || collapseAction || refreshContentAction || removeCardAction) && !codeToggler" style="border-style : solid; border-width: 2px;  ">
                        <i @click="toggleContent"  :class="{rotate180: !isContentCollapsed}" class="bx bxs-chevrons-down" style="color : green; font-size : 1.5rem;" v-if="actionButtons || collapseAction" />
                        <i @click="refreshcard" icon="RotateCwIcon" class="ml-4" v-if="actionButtons || refreshContentAction" />
                        <i @click="removeCard" icon="XIcon" class="ml-4 bx bx-x-circle" style="color : red; font-size : 1.5rem;" v-if="actionButtons || removeCardAction" />
                    </div>
                    <div class="vx-card__code-toggler sm:block hidden" v-if="codeToggler && !actionButtons">
                        <i icon="CodeIcon" :class="{'border border-solid border-primary border-t-0 border-r-0 border-l-0': showCode}" @click="toggleCode"/>
                    </div>
                </slot>
            </div>
        </div>

        <div class="vx-card__collapsible-content vs-con-loading__container" ref="content" :class="[{collapsed: isContentCollapsed}, {'overflow-hidden': tempHidden}]" :style="`${StyleItems} ${bodySizeStyle}`">

            <!-- content with no body(no padding) -->
            <slot name="no-body"></slot>

            <!-- content inside body(with padding) -->
            <div class="vx-card__body" v-if="this.$slots.default" :class="[bodyClasses]" :style="`${bodySizeStyle} ${bodyStyles}`">
                <slot></slot>
            </div>

            <!-- content with no body(no padding) -->
            <slot name="no-body-bottom"></slot>

            <div class="vx-card__footer" v-if="this.$slots.footer">
                <slot name="footer"></slot>
            </div>
        </div>

        <div class="vx-card__code-container" ref="codeContainer" v-show="this.$slots.codeContainer" :style="codeContainerStyles" :class="{collapsed: !showCode}">
            <div class="code-content">
                <prism :language="codeLanguage" :key="$vs.rtl">
                        <slot name="codeContainer"></slot>
                </prism>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from "nuxt-property-decorator"



// declare module 'vue-prism-component';
import Prism from 'vue-prism-component'
import _color from '~/assets/utils/color'
// import Style from '~/assets/utils/csstype'
import type {Properties as Style} from 'csstype';
@Component<VxCard>({
    components: {
        Prism
    }
})

export default class VxCard extends Vue {
    @Prop() title !: string;
    @Prop() subtitle !: string;
    @Prop({default : false}) actionButtons !: boolean;
    @Prop({default : "success"}) actionButtonsColor !: String;
    @Prop({default : false}) codeToggler !: boolean;
    @Prop({default : false}) noShadow !: boolean;
    @Prop({default : false}) noRadius !: boolean;
    @Prop({default : false}) cardBorder !: boolean;
    @Prop({default : "markup"}) codeLanguage !: string;
    @Prop({default : false}) collapseAction !: boolean;
    @Prop({default : false}) refreshContentAction !: boolean;
    @Prop({default : false}) removeCardAction !: boolean;
    @Prop({default : ''}) headerBackground !: string;
    @Prop({default : ''}) cardBackground !: string;
    @Prop({default : ''}) contentColor !: string;
    @Prop({default : ''}) titleColor !: string;
    @Prop({default : '#b8c2cc'}) subtitleColor !: string;
    @Prop({default : ''}) bodyClasses !: string;
    @Prop({default : ''}) bodyStyles !: string;
    @Prop ({default : false}) fitContent !: boolean;

    get bodySizeStyle()
    {
        if(this.fitContent) return " width : 100%; height: 100%;";
    }
    
    isContentCollapsed = false;
    showCode : boolean = false;
    maxHeight : string | null = null;
    cardMaxHeight : string | null = null;
    codeContainerMaxHeight = '0px';
    tempHidden : boolean = false;

    get hasAction() {
        return this.$slots.actions || (this.actionButtons || this.collapseAction || this.refreshContentAction || this.removeCardAction || this.codeToggler)
    };

    get hasHeader() {
        return this.hasAction || (this.title || this.subtitle)
    };

    get StyleItems() {
        return { maxHeight: this.maxHeight }
    };

    get cardStyles() {
        let obj = { maxHeight: this.cardMaxHeight, background : this.cardBackground, color : this.contentColor }
        if (!_color.isColor(this.cardBackground)) obj.background = _color.getColor(this.cardBackground)
        if (!_color.isColor(this.contentColor)) obj.color = _color.getColor(this.contentColor)
        return obj
    };

    get codeContainerStyles() {
        return { maxHeight: this.codeContainerMaxHeight }
    };

    get cardClasses() {
        let str = ''
        // Add bg class
        if(_color.isColor(this.cardBackground)) {
        str += ` bg-${this.cardBackground}`
        }
        // add content color
        if (_color.isColor(this.contentColor)){
        str += ` text-${this.contentColor}`
        }
        return str.trim()
    };

    get titleStyles() {
        return {
        color: _color.getColor(this.titleColor)
        }
    };

    get titleClasses() {
        let str = 'text-title'
        // add content color
        if(_color.isColor(this.titleColor)) {
        str += ` text-${this.titleColor}`
        }
        return str.trim()
    };

    get subtitleStyles() {
        let obj = { color : this.contentColor }
        if (!_color.isColor(this.subtitleColor)) obj.color = _color.getColor(this.subtitleColor)
        return obj
    };

    get subtitleClasses() {
        let str = ''
        // add content color
        if(_color.isColor(this.subtitleColor)) {
        str += ` text-${this.subtitleColor}`
        }
        return str.trim()
    };

    ref(el : string)
    {
        return this.$refs[el] as Element & {style : Style};
    }
    get content() 
    {
        return this.$refs.content as Element & {style : Style}; 
    }
    get card()
    {
        return this.$refs.card as Element & { style : Style };
    }
    get element()
    {
        return this.$el as Element & { style : Style };
    }
    toggleContent() {
        this.content.style.overflow = "hidden"
        let scrollHeight = this.content.scrollHeight
        if (this.maxHeight == '1.5rem') {
            this.maxHeight = `${scrollHeight}px`
            setTimeout(() => {
                this.maxHeight = 'none'
                this.content.style.overflow = undefined
            }, 300)
        } else {
            this.maxHeight = `${scrollHeight}px`
            setTimeout(() => {
                this.maxHeight = `1.5rem`
                this.content.style.overflow = undefined
            }, 50)
        }
        this.isContentCollapsed = !this.isContentCollapsed
        this.$emit("toggleCollapse", this.isContentCollapsed)
    }
    refreshcard() {
        this.$vs.loading({
            container: this.$refs.content,
            scale: 0.5,
        })
        this.tempHidden = true
        this.$emit("refresh", this)
    }
    removeRefreshAnimation(time=100) {
        setTimeout( ()=> {
            this.$vs.loading.close(this.$refs.content)
            this.tempHidden = false
        }, time)
    }
    removeCard() {
        let scrollHeight = this.card.scrollHeight;
        this.cardMaxHeight = `${scrollHeight}px`
        this.element.style.overflow = "hidden"
        setTimeout(() => {
            this.cardMaxHeight = `0px`
        }, 50)
        this.$emit("remove")
    }
    toggleCode() {
        this.tempHidden = true
        this.showCode = !this.showCode
        let scrollHeight = this.ref('codeContainer').scrollHeight
        if (this.codeContainerMaxHeight == '0px') {
            this.codeContainerMaxHeight = `${scrollHeight}px`
            setTimeout(() => {
                this.codeContainerMaxHeight = 'none'
                this.tempHidden = false
            }, 300)
        } else {
            this.codeContainerMaxHeight = `${scrollHeight}px`
            setTimeout(() => {
                this.codeContainerMaxHeight = `0px`
                this.tempHidden = false
            }, 150)
        }
    }
}
</script>

<style lang="scss">
    @import "~/assets/scss/components/vxCard.scss";
</style>