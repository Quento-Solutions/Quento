import { Component, Vue, Watch } from 'nuxt-property-decorator'
@Component<LoadScrollMixin>({
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted()
  {
    window.scrollTo(0, 0)
  }
})
export default class LoadScrollMixin extends Vue {
  scrollHeight = 0
  loaded = false
  totalHeight = window.innerHeight * 1.2
  handleScroll() {
    this.scrollHeight = document.documentElement.scrollTop
    this.totalHeight = document.body.scrollHeight
  }
  get IsScrolledDown() 
  {
    return this.scrollHeight >= this.totalHeight - window.innerHeight * 1.2
  }
}