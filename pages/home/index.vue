<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">拉勾教育</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link class="nav-link" 
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" 
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }">Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link class="nav-link active" 
                  :class="{
                    active: tab === 'tag'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag'
                    }
                  }">#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{ article.createdAt | date }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: pageNo === page,
                }"
                v-for="pageNo in totalPage"
                :key="pageNo"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: pageNo,
                      tag: $route.query.tag,
                      tab: tab
                    },
                  }"
                  >{{ pageNo }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag'
                  }
                }"
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
                >{{ item }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from 'vuex'
export default {
  name: "HomeIndex",
  watchQuery: ["page", "tag", "tab"],
  async asyncData({ query, store }) {
    console.log(store.state)
    try {
      const { tag } = query
      const page = Number.parseInt(query.page || 1);
      const limit = 20;
      const tab = query.tab || 'global_feed'; 
      const loadArticles = store.state.user && tab === 'your_feed'
        ? getFeedArticles
        : getArticles;
      const [articleRes, tagRes] = await Promise.all([
        loadArticles({
          limit,
          offset: (page - 1) * limit,
          tag
        }),
        getTags(),
      ]);
      const { articlesCount, articles } = articleRes.data
      const { tags } = tagRes.data
      return {
        articlesCount,
        articles,
        page,
        limit,
        tags,
        tag,
        tab,
      };
    } catch (error) {
      console.log("getArticles failed.", error);
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true
      const { favorited, slug } = article;
      if (favorited) {
        // delete
        await deleteFavorite(slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        // add
        await addFavorite(slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
};
</script>

<style>
</style>