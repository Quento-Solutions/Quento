import { Component, Vue, Watch } from 'nuxt-property-decorator'
@Component<LoadScrollMixin>({
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted()
  {
    window.scrollTo(0, 0);
    window.addEventListener('scroll', this.handleScroll)
  },
})
export default class LoadScrollMixin extends Vue {
  scrollHeight = 0
  loaded = false
  totalHeight : number | null = null
  handleScroll() {
    this.scrollHeight = document.documentElement.scrollTop
    this.totalHeight = document.body.scrollHeight
  }
  get IsScrolledDown() 
  {
    return this.totalHeight && this.scrollHeight >= this.totalHeight - window.innerHeight * 1.2
  }
}
