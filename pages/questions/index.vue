<template>
  <div>
    <ais-instant-search-ssr>
      <ais-search-box />
      <ais-stats />
      <ais-refinement-list attribute="title" />
      <ais-hits>
        <template slot="item" slot-scope="{ item }">
          <p>
            <ais-highlight attribute="name" :hit="item" />
          </p>
          <p>
            <ais-highlight attribute="title" :hit="item" />
          </p>
        </template>
      </ais-hits>
      <ais-pagination />
    </ais-instant-search-ssr>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import { algoliaConfig } from '~/envars'

import {
  AisInstantSearchSsr,
  AisRefinementList,
  AisHits,
  AisHighlight,
  AisSearchBox,
  AisStats,
  AisPagination,
  createServerRootMixin
} from 'vue-instantsearch'

import algoliasearch from 'algoliasearch/lite'

const searchClient = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey)

@Component<QuestionsPage>({
  components: {
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination
  },
  serverPrefetch() {
    return this.instantsearch
      .findResultsState(this)
      .then((algoliaState: any) => {
        this.$ssrContext.nuxt.algoliaState = algoliaState
      })
  },
  beforeMount() {
    const results =
      this.$nuxt.context.nuxtState.algoliaState ||
      (window as any).__NUXT__.algoliaState

    this.instantsearch.hydrate(results)
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css'
        }
      ]
    }
  }
})
export default class QuestionsPage extends mixins(
  createServerRootMixin({ searchClient, indexName: 'dev_questions_index' })
) {
  instantsearch!: any
}
</script>
