<template>
  <div style class="relative w-full">
      <div class="" style="height : 50px; width : 100%">
      </div>
    <div class="absolute w-full" style="z-index: 1000; top: 0">
      <ais-instant-search-ssr>
        <ais-search-box />
        <ais-configure :hits-per-page.camel="6"></ais-configure>
        <ais-refinement-list attribute="title" />
        <ais-hits>
          <div slot-scope="{ items }">
            <NotesListCard v-for="(item, index) in items" :key="index" :note="fromAlgolia(item)">
              <template #title>
                <ais-highlight attribute="title" :hit="item" class="md:text-xl text-ginger-b truncate text-sm"></ais-highlight>
              </template>
            </NotesListCard>
          </div>
        </ais-hits>
      </ais-instant-search-ssr>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import KeywordSelect from '~/components/KeywordSelect.vue'
import {
  AisInstantSearchSsr,
  AisRefinementList,
  AisHits,
  AisHighlight,
  AisSearchBox,
  AisStats,
  AisPagination,
  AisConfigure,
AisSnippet,
createServerRootMixin
  } from 'vue-instantsearch'
import NotesListCard from '~/components/NotesListCard.vue';

import algoliaClient from '~/plugins/algolia'
import { Note_t_A, Note } from '~/types/notes';
const searchClient = {
  search(requests: any) {
    if (requests.every(({ params }: any) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0
        }))
      })
    }
    return algoliaClient.search(requests)
  }
}

@Component<NotesSearchBar>({
  components: {
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination,
    AisConfigure,
    AisSnippet,
    KeywordSelect,
      NotesListCard
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
export default class NotesSearchBar extends mixins(
  createServerRootMixin({ searchClient, indexName: 'dev_notes_MAIN' })
) {
  instantsearch!: any
    fromAlgolia(note : Note_t_A)
    {
        return Note.fromAlgolia(note);
    }
}
</script>