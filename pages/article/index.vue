<template>
  <div class="article-page">

  <div class="banner">
    <div class="container">

      <h1>{{ article.title }}</h1>

      <article-meta :article="article" />

    </div>
  </div>

  <div class="container page">

    <div class="row article-content">
      <div class="col-md-12">
        <p v-html="article.body">
        </p>
        <h2 id="introducing-ionic">Introducing RealWorld.</h2>
        <p>{{ article.description }}</p>
      </div>
    </div>

    <hr />

    <div class="article-actions">
      <article-meta :article="article" />
    </div>

    <div class="row">
      <article-comment :article="article" />
    </div>

  </div>

</div>
</template>

<script>
import { getArticle } from '@/api/article'
import Markdown from 'markdown-it'
import ArticleMeta from './components/ArticleMeta.vue'
import ArticleComment from './components/article-comment.vue'
export default {
  components: { ArticleMeta, ArticleComment },
  name: 'ArticleIndex',
  async asyncData ({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new Markdown()
    article.body = md.render(article.body)
    return {
      article
    }
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        { 
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  }
}
</script>

<style>

</style>