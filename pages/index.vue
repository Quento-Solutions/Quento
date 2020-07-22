<template>
  <section>
    <Header/>
    asdf
    <div class="cards">
      <Card
        v-for="person in people"
        :key="person.id"
        :person="person"
      ></Card>
    </div>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"
import { State } from "vuex-class"
import type { Person } from "~/types";
import Card from "~/components/Card.vue"
import Header from "~/components/Header.vue"

@Component({
  components: {
    Card,
    Header,
  }
})
export default class extends Vue {
  @State people!: Person[]
}
</script>

<style scoped>

.cards {
  display: flex;
  flex-wrap: wrap;
}
</style>
