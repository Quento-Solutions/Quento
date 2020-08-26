import { Component, Vue } from 'nuxt-property-decorator'
import analytics from '~/plugins/fireanalytics';

@Component<AnalyticsMixin>({
    mounted()
    {   
        if(this.logPage)
        {
            this.analytics?.logEvent("page_view", {page_title : this.$options.name})
            // console.log("Log Event", this.$options.name);
        }
    },
})
export default class AnalyticsMixin extends Vue 
{
    logPage : boolean = false;
    analytics = analytics;
}
