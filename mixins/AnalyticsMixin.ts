import { Component, Vue } from 'nuxt-property-decorator'

@Component<AnalyticsMixin>({
    mounted()
    {   
        if(this.logPage)
        {
            this.$fire.analytics?.logEvent("page_view", {page_title : this.$options.name})
            // console.log("Log Event", this.$options.name);
        }
    },
})
export default class AnalyticsMixin extends Vue {
    logPage : boolean = false;
}
