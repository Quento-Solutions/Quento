<template>
  <div
    class="relative disable-scrollbars overflow-x-hidden"
    style="width: 100vw; height: 100vh;"
  >
    <div class="p-8 obelisk bg-cover bg" style="">
      <transition name="bounce" mode="out-in">
        <nuxt />
      </transition>
      <FooterCard />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import FooterCard from '~/components/FooterCard.vue'

@Component<AuthLayout>({
  components: {
    FooterCard
  },
})
export default class AuthLayout extends Vue {}
</script>

<style lang="scss">
.obelisk {
  width: 120vw;
  height: calc(100vw / var(--bg-aspect-ratio));
  position: absolute;
  background-position: center top;
  transform: translate(-8%, -20%);
  background-image: url('https://images.unsplash.com/photo-1585792180666-f7347c490ee2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1356&q=80');
}

.disable-scrollbars {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
}

.article-card {
  border-radius: 8px;
}
.article-card a {
  background-color: #fff;
  border-radius: 8px;
}
.article-card img div {
  border-radius: 8px 0 0 8px;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-out 0.3s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1, 0);
  }
}
</style>
