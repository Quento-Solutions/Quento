<template>
  <div>
    <PreviewNotesModal></PreviewNotesModal>
    <PostNotesModal></PostNotesModal>

    <nuxt-child></nuxt-child>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, mixins} from 'nuxt-property-decorator'

import PreviewNotesModal from '~/screens/notes/PreviewNotesModal.vue'
import PostNotesModal from '~/screens/notes/PostNotesModal.vue'
import AnalyticsMixin from '~/mixins/AnalyticsMixin'

@Component<NotesGroup>({
  components: {
    PreviewNotesModal,
    PostNotesModal
  },
  layout: 'main',
  name: 'NotesGroup'
})
export default class NotesGroup extends mixins(AnalyticsMixin) {
  logPage = true
}
</script>
