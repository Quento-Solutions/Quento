<template>
    <div id="Header">
            <h2 class="header">This is the Header</h2>

    </div>
</template>
<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"

@Component({})
export default class Header extends Vue {

}
</script>
<style scoped>
.header {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
</style>