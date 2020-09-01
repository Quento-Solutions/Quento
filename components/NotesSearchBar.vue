<template>
  <div style="max-width: 100%" class="w-full relative">
    <ais-instant-search-ssr>
      <ais-search-box />
      <ais-configure :hits-per-page.camel="4"></ais-configure>

      <div
        class="absolute w-full rounded-lg bg-white"
        style="top : 40px; max-height : 50vh; overflow-y : scroll"
      >
        <ais-hits>
          <div slot-scope="{ items }" class="w-full">
            <div
              class="auto-suggest__suggestion-group-title pt-3 pb-1 px-4 vx-row items-center"
              v-if="items && items.length"
            >
              <p class="font-semibold text-primary">
                <i class="bx bx-note text-xl mr-2"></i>Notes
              </p>
            </div>
            <ListCard
              v-for="(item, index) in items"
              :key="index"
              :item="fromAlgoliaNote(item)"
              @click="itemClick(`/notes/${item.objectID}`)"
            >
              <template #title>
                <ais-highlight
                  attribute="title"
                  :hit="item"
                  class="md:text-xl text-ginger-b truncate text-sm"
                ></ais-highlight>
              </template>
            </ListCard>
          </div>
        </ais-hits>
        <ais-index index-name="dev_questions_index">
          <ais-configure :hits-per-page.camel="4"></ais-configure>

          <ais-hits>
            <div slot-scope="{ items }" class="w-full">
              <div
                class="auto-suggest__suggestion-group-title pt-3 pb-1 px-4"
                v-if="items && items.length"
              >
                <p class="font-semibold text-primary">
                  <i class="bx bx-question-mark text-xl mr-2"></i>Questions
                </p>
              </div>
              <ListCard
                v-for="(item, index) in items"
                :key="index"
                :item="fromAlgoliaQuestion(item)"
                @click="itemClick(`/questions/${item.objectID}`)"
              >
                <template #title>
                  <ais-highlight
                    attribute="title"
                    :hit="item"
                    class="md:text-xl text-ginger-b truncate text-sm"
                  ></ais-highlight>
                </template>
              </ListCard>
            </div>
          </ais-hits>
        </ais-index>
      </div>
    </ais-instant-search-ssr>
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
  AisIndex,
  createServerRootMixin
} from 'vue-instantsearch'
import ListCard from '~/components/ListCard.vue'
import { ListItem} from '~/types/interface'

import algoliaClient from '~/plugins/algolia'
import { Note_t_A, Note } from '~/types/notes'
import { Question_t_F, Question, Question_t_A } from '~/types/questions'
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
    AisIndex,
    KeywordSelect,
    ListCard
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
  fromAlgoliaQuestion(question: Question_t_A) : ListItem{
    return Question.fromAlgolia(question)
  }
  fromAlgoliaNote(note: Note_t_A) : ListItem {
    const note2 =  Note.fromAlgolia(note)
    return {...note2, userId : note2.uid}
  }
  itemClick(url?: string)  {
    url ? this.$router.push(url) : ''
    this.$emit('close')
  }
}
</script>