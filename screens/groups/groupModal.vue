<template>
  <div class="vx-row w-full" style>
    <div class="vx-col w-full md:w-1/2 p-4 h-full">
      <div class="flex flex-col justify-center w-full items-center border-2 p-4 rounded">
        <div class="text-center w-4/5">
          <b>Create</b> a New Group and Add Your Friends
        </div>
        <i class="bx bx-group" style="font-size: 8rem"></i>
        <vs-button @click.stop="$emit('next', 1)">
          <div class="text-xl p-2 font-bold lg:text-2xl" style>Create a group</div>
        </vs-button>
      </div>
    </div>
    <div class="vx-col w-full md:w-1/2 p-4 h-full">
      <div class="flex flex-col justify-center w-full items-center border-2 p-4 rounded h-full">
        <div class="text-center w-4/5">
          <b>Join</b> a group with an invite code or link
        </div>
        <i class="bx bx-group" style="font-size: 8rem"></i>
        <vs-button class="rounded" @click.stop="$emit('next', 2)">
          <div class="text-xl p-2 font-bold lg:text-2xl" style>Join a group</div>
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'
import {SchoolList, School_O} from '~/types/schools'
import {GradeList, Grade_O, NestedSubjectList, Subject_O} from '~/types/subjects'

@Component<FirstScreen>({components: {}})
export default class FirstScreen extends Vue {


}
</script>