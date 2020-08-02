<template>
  <VxCard fitContent="true" class="note-card mb-8" >
    <!-- Card Header -->
    <div class="vx-row w-full justify-between items-center">
      <!-- Profile Picture -->
      <div class="">
        <vs-tooltip>
          <vs-avatar class="icon">
            <img v-if="note.userPhotoUrl" :src="note.userPhotoUrl" />
            <template #text v-else>
              {{ note.userDisplayName }}
            </template>
          </vs-avatar>
          <template #tooltip>
            {{ note.userDisplayName }}
          </template>
        </vs-tooltip>
      </div>
      <!-- User name -->
      <div class="lg:w-1/3 w-1/2 truncate">
        <div class="vx-row w-full truncate text-xl text-ginger-b">
          <div class="truncate">
            {{ note.userDisplayName }}
          </div>
        </div>
        <div class="vx-row w-full">
          <div class="truncate">
            {{ note.createdAt.toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div>
        <vs-avatar class="icon-small float-right">
          <i class="bx bx-dots-horizontal" style="font-size: 1.25rem;" />
        </vs-avatar>
      </div>
    </div>


    <!-- Title -->
    <div class="vx-row w-full text-ginger-b text-xl lg:px-10 p-4" style="">
      {{ note.title }}
    </div>
    
    <!-- <div style="width : 80%; margin-left: 10%;  height : 2px; background-color: gray" class="my-2"></div> -->

    <!-- Content -->
    <div class="vx-row w-full justify-center p-4 m-0" style="margin: 0;">
      <div
        class="md:w-2/3 w-full vx-row justify-center overflow-y-hidden relative rounded-md p-0 border-solid "
        :style="hasImage ? 'max-height : 512px' : 'max-height: 200px'"
        style="border-width : 1px; border-color : #ccd6dd"
      >

        <img :src="note.images[0]" class="responsive rounded" v-if="hasImage" />
        <div v-html="$md.render(note.contents)" class="w-full text-ginger"></div>
      </div>
    </div>

    <div style="width : 80%; margin-left: 10%; margin-top:20px; height : 2px; background-color: gray"></div>

    <!-- Footer -->

    <div class="vx-row w-full justify-evenly lg:px-10 p-6" style="">
      <vs-avatar class="icon-small" :color="false ? 'danger' : '#f4f7f8'" badge-color="#7d33ff">
        <i
          class="bx bx-heart primary"
          :style="`color : ${false ? 'white' : '#ff4757'}`"
        ></i>
        <template #badge>
          {{ note.upVotes }}
        </template>
      </vs-avatar>

      <vs-avatar class="icon-small">
        <i class="bx bx-chat"></i>
      </vs-avatar>

      <vs-avatar class="icon-small">
        <i class="bx bx-save"></i>
      </vs-avatar>
    </div>
  </VxCard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Note } from '~/types/notes'

const a = new Date().toLocaleString()
console.log({ a })
@Component<NotesCard>({
  components: {},
  mounted() {
    if (this.note.images && this.note.images.length) {
      this.image = new Image()
      this.image.src = this.note.images[0]
      this.hasImage = true
    }
    console.log({ content: this.note.contents })
  }
})
export default class NotesCard extends Vue {
  @Prop({ required: true }) note!: Note

  hasImage = false
  image?: HTMLImageElement
}
</script>
<style lang="scss">
.note-card {
    :hover {
        background-color : #f5f5f6;
    }
    transition-duration : 100ms !important;

  .icon {
    width: 4rem !important;
    height: 4rem !important;
    max-width: 10vw;
    max-height: 10vw;
  }
  .icon-small {
    width: 3rem !important;
    height: 3rem !important;
    max-width: 8vw;
    max-height: 8vw;
  }
  #profile {
    .vs-navbar__group__items {
      min-width: 0 !important;
      // max-width : 100%;
      width: 150%;
      transform: translate(-25%, 90%);
    }
  }
}
</style>
