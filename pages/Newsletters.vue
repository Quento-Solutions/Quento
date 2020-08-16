<template>
  <nuxt-child></nuxt-child>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { newslettersStore } from '~/store'
import VxCard from '~/components/VxCard.vue'
import NewsletterModal from '~/screens/newsletter/NewsletterModal.vue'

@Component<NewslettersPage>({
  layout: 'main',
  components: { VxCard },
})
export default class NewslettersPage extends Vue 
{
 
}
</script>

<style lang="scss">
.background-cover {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.md-container {
  font-family: 'Quicksand', sans-serif !important;
  word-wrap: break-word;

  img {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'ginger-bold', 'Trebuchet MS', 'Lucida Sans Unicode',
      'Lucida Grande', 'Lucida Sans', Arial, sans-serif !important;
    font-weight: 200 !important;
    margin-bottom: 2rem !important;
  }
  p {
    margin-bottom: 2rem !important;
    font-weight: 500 !important;
  }

  blockquote {
    margin-left: -10px !important;
    padding-left: 23px !important;
    box-shadow: rgb(41, 41, 41) 3px 0px 0px 0px inset !important;
    p {
      font-style: italic !important;
    }
  }
  pre > code {
    margin-bottom: 2rem !important;
    background-color: #eeeeee;
    border-radius: 0.5rem;
    padding: 1rem;
  }
  ul,
  ol {
    li {
      font-weight: 500 !important;
    }
    margin-left: 2rem;
    margin-bottom: 1rem;
    list-style-type: symbols();
    p {
      margin-bottom: 0.5rem !important;
    }
    ol {
      list-style-type: lower-roman;
    }

    ul,
    ol {
      ol {
        list-style-type: lower-alpha;
      }
    }
  }
}
</style>
