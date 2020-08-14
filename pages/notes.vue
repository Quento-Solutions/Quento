<template>
  <div>
    <PreviewNotesModal></PreviewNotesModal>
    <EditNotesModal></EditNotesModal>
    <PostNotesModal></PostNotesModal>

    <nuxt-child></nuxt-child>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import EditNotesModal from '~/screens/EditNotesModal.vue'
import PreviewNotesModal from '~/screens/PreviewNotesModal.vue'
import PostNotesModal from '~/screens/PostNotesModal.vue'


@Component<NotesGroup>({ components: {
EditNotesModal, PreviewNotesModal, PostNotesModal
}, layout: 'main' })
export default class NotesGroup extends Vue {



}
</script>
