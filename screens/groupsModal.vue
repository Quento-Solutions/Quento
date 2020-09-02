<template>
  <vs-dialog
    id="suggestionsPopup"
    class="content-popup"
    style="z-index: 1000000000;"
    scroll
    :full-screen="!isLargeScreen"
    prevent-close
    overflow-hidden
  >
    <template #header>
      <div class="pt-10">
        <h4 class="not-margin text-title text-4xl">Post A Question</h4>
      </div>
    </template>
<!-- <vs-alert v-if="contents.length > characterLimit" danger>Your note cannot exceed 5000 characters</vs-alert> -->

    <!-- <div class="con-form md:p-4 lg:p-8 p-2 flex vx-row w-full justify-evenly overflow-x-hidden">
      <div class="w-full p-6" style>
        <vs-input
          v-model="title"
          placeholder="Title"
          class="block"
          width="w-6"
        >
          <template #icon>
            <i class="bx bx-highlight" primary></i>
          </template>
        </vs-input>
      </div>

      <div class="p-6 w-full lg:w-1/2">
        <vs-select
          filter
          class="block w-full"
          placeholder="Subject"
          v-model="subjectSelect"
        >
          <vs-option-group v-for="(subjectGroup, index) in SubjectGroupList" :key="index">
            <div slot="title" class="w-full vx-row">
              <i class="bx text-xl mr-2" :class="subjectGroup.iconClass" />
              <div class="font-bold truncate">{{ subjectGroup.name }}</div>
            </div>
            <vs-option
              v-for="(subject, subIndex) in subjectGroup.items"
              :key="subIndex"
              :label="subject.name"
              :value="subject.name"
            >
              <i class="bx text-3xl mr-2" :class="subject.iconClass" />
              <div class="font-bold truncate">{{ subject.name }}</div>
            </vs-option>
          </vs-option-group>
        </vs-select>
      </div>
      <div class="p-6 w-full lg:w-1/2">
        <vs-select
          filter
          class="block w-full"
          placeholder="Grade"
          v-model="gradeSelect"
        >
          <vs-option
            v-for="(grade, subIndex) in GradeList"
            :key="subIndex"
            :label="`Grade ${grade}`"
            :value="grade"
          >
            <div class="font-bold truncate">Grade {{ grade }}</div>
          </vs-option>
        </vs-select>
      </div>
      <div class="w-full p-6 px-10 pt-0">
        <VsTextarea
        v-model="contents"
        placeholder="Enter your content here"
        class="block rounded-lg pl-1"
        ref="textarea"
        expand="true"
        markdownOptions="true"
        @paste="onPaste"
      ></VsTextarea>
      </div>
    </div>

    <template #footer>
      <div class="footer-dialog vx-row justify-center md:pb-8 md:px-12 px-2">
        <vs-button
          class="md:w-1/2 w-full"
          @click="PreviewQuestion()"
        >
          <div class="text-xl p-2 font-bold lg:text-2xl" style="">
            Preview Question
          </div>
        </vs-button>
      </div>
    </template> -->
  </vs-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
})
</script>