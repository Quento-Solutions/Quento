<template>
  <div class="w-full p-2 items-start md:text-sm text-xs mt-2 flex flex-row">
    <div class="rounded-full bg-orange-500 p-2 text-ginger text-white" v-if="grade">
      <div class="truncate" style>Gr {{ grade }}</div>
    </div>
    <div
      class="rounded-full bg-purple-500 p-2 text-ginger text-white mt-0 mx-2 truncate flex min-w-0" v-if="subject"
    >
      <i
        class="bx text-xl text-white mr-2"
        :class="getIcon(subject)"
        style="background-color:transparent;"
      />
      <div class="truncate" style>{{ subject }}</div>
    </div>
    <VxTooltip v-if="school" class="flex truncate" style="flex-shrink : 100" >
      <div
        class="rounded-full p-2 cursor-pointer text-ginger text-white truncate"
        style="background-color: #6398de"
      >{{school}}</div>
      <template #tooltip>{{school}}</template>
    </VxTooltip>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, mixins} from 'nuxt-property-decorator'
import { School_O } from '~/types/schools';
import { Grade_O, Subject_O } from '~/types/subjects'
import IconMixin from '~/mixins/IconMixin'

@Component<CategoryPills>({ components : {

}})
export default class CategoryPills extends mixins(IconMixin) 
{
    @Prop({required : false}) grade !: Grade_O;
    @Prop({required : false}) subject !: Subject_O;
    @Prop({required : false}) school !: School_O;

}
</script>