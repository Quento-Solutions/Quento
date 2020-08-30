<template>
  <nuxt-child></nuxt-child>
</template>

<script lang="ts">
import { Vue, Component, mixins } from 'nuxt-property-decorator'
import { newslettersStore } from '~/store'
import VxCard from '~/components/VxCard.vue'
import NewsletterModal from '~/screens/newsletter/NewsletterModal.vue'
import Analytics from '~/mixins/AnalyticsMixin';


@Component<NewslettersPage>({
  layout: 'main',
  components: { VxCard },
  name : "NewslettersPage"
})
export default class NewslettersPage extends mixins(Analytics) 
{
 logPage = true;
}
</script>
