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

import EditNotesModal from '~/screens/notes/EditNotesModal.vue'
import PreviewNotesModal from '~/screens/notes/PreviewNotesModal.vue'
import PostNotesModal from '~/screens/notes/PostNotesModal.vue'


@Component<NotesGroup>({ components: {
EditNotesModal, PreviewNotesModal, PostNotesModal
}, layout: 'main' })
export default class NotesGroup extends Vue {

}
</script>
