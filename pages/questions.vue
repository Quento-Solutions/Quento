<template>
  <div>
    <PostQuestionModal></PostQuestionModal>
    <PreviewQuestionModal></PreviewQuestionModal>
    <nuxt-child></nuxt-child>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import PostQuestionModal from '~/screens/questions/PostQuestionModal.vue'
import PreviewQuestionModal from '~/screens/questions/PreviewQuestionModal.vue'

import { questionStore } from '~/store'
@Component<QuestionsGroup>({ components: {  PostQuestionModal, PreviewQuestionModal }, layout: 'main' })
export default class QuestionsGroup extends Vue {

}
</script>
