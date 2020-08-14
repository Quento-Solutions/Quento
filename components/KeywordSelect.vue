<template>
  <div class="" style="">
    <vs-select :label="label" :placeholder="placeholder" multiple filter v-model="keywords">
      <vs-option v-for="(item, index) in KeywordList" :key="index" :label="item" :value="item">
        {{item}}
      </vs-option>
    </vs-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Keyword_O, KeywordList } from '~/types/subjects'

@Component<KeywordSelect>({ components: {} })
export default class KeywordSelect extends Vue {
  @Prop() label!: string
  @Prop() placeholder!: string

  KeywordList = KeywordList.map(v => String(v));

  keywords: Keyword_O[] = []
}
</script>
