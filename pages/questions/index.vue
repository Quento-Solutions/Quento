<template>
  <div>
    <KeywordSelect label="label"></KeywordSelect>
    <vs-button @click="OpenPostQuestionModal()">Post New Question</vs-button>
    <ais-instant-search-ssr>
      <ais-search-box />
      <ais-stats />
      <ais-refinement-list attribute="title" />
      <ais-hits>
        <template slot="item" slot-scope="{ item }">
          <nuxt-link :to="`/questions/${item.objectID}`" @click="QuestionClicked(item)">
            <p>
              <ais-highlight attribute="contents" :hit="item" />
            </p>
            <p>
              <ais-highlight attribute="title" :hit="item" />
            </p>
          </nuxt-link>
        </template>
      </ais-hits>
      <ais-pagination />
    </ais-instant-search-ssr>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import { algoliaConfig } from '~/envars'
import KeywordSelect from '~/components/KeywordSelect.vue'
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
import { questionStore } from '~/store'
import { Question, Question_t_A } from '~/types/questions'
const searchClient = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey)

@Component<QuestionsPage>({
  components: {
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination,
    KeywordSelect
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
  OpenPostQuestionModal() {
    questionStore.SET_POST_MODAL_OPEN(true)
  }
  QuestionClicked(question: any) {
    console.log({ question })
  }

    stringify(item : Question_t_A)
    {
        const a = new String(item.title);
        console.log({a}, a.replaceAll);
        
        return encodeURI(a.replaceAll(" ", "-").replaceAll("?", ""));
    }
  AlgoliaConvert(item : Question_t_A)
  {
      return Question.fromAlgolia(item);
  }
}
</script>
