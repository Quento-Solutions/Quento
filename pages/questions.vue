<template>
  <div>
    <PostQuestionModal></PostQuestionModal>
    <PreviewQuestionModal></PreviewQuestionModal>
    <nuxt-child></nuxt-child>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, mixins } from 'nuxt-property-decorator'
import PostQuestionModal from '~/screens/questions/PostQuestionModal.vue'
import PreviewQuestionModal from '~/screens/questions/PreviewQuestionModal.vue'

import { questionStore } from '~/store'
import AnalyticsMixin from '~/mixins/AnalyticsMixin'
@Component<QuestionsGroup>({
  components: { PostQuestionModal, PreviewQuestionModal },
  layout: 'main',
  name : "QuestionsGroup"
})
export default class QuestionsGroup extends mixins(AnalyticsMixin) {
  logPage = true
}
</script>
