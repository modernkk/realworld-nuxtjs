<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" />
          <h4>{{ profile.username }}</h4>
          <p>
            {{ profile.bio }}
          </p>
          <button 
            class="btn btn-sm btn-outline-secondary action-btn"
            v-if="profile.username !== user.username">
            <i class="ion-plus-round"></i>
            &nbsp;
            Follow {{ profile.username }} 
          </button>
          <nuxt-link 
            class="btn btn-sm btn-outline-secondary action-btn" 
            v-else
            :to="{
              name: 'settings'
            }">
            <i class="ion-gear-a"></i> Edit Profile Settings
          </nuxt-link>
        </div>

      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <nuxt-link 
                class="nav-link"
                :class="{
                  active: tab === 'my'
                }"
                exact
                :to="{
                  name: 'profile',
                  query: {
                    tab: 'my'
                  }
                }"
                >My Articles</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link 
                class="nav-link" 
                :class="{
                  active: tab === 'favorite'
                }"
                exact
                :to="{
                  name: 'profile',
                  query: {
                    tab: 'favorite'
                  }
                }">Favorited Articles</nuxt-link>
            </li>
          </ul>
        </div>


        <div 
          class="article-preview"
          v-for="article in articles"
          :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{
              name: 'profile',
              params: {
                username: article.author.username,
              },
            }"><img :src="article.author.image" /></nuxt-link>
            <div class="info">
              <nuxt-link 
                class="author"
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }">{{ article.author.username }}</nuxt-link>
              <span class="date">{{ article.createdAt | date }}</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right">
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
            }">
            <h1>{{ article.title }}</h1>
            <p>{{ article.description }}</p>
            <span>Read more...</span>
            <ul class="tag-list">
              <li 
                class="tag-default tag-pill tag-outline"
                v-for="tag in article.tags"
                :key="tag">{{ tag }}</li>
            </ul>
          </nuxt-link>
        </div>


      </div>

    </div>
  </div>

</div>
</template>

<script>
import { mapState } from 'vuex'
import { getProfile } from '@/api/profile'
import { getArticles } from "@/api/article";
export default {
  name: 'ProfileIndex',
  watchQuery: ["tab"],
  computed: {
    ...mapState(['user'])
  },
  async asyncData ({ params, query }) {
    const { data } = await getProfile(params.username)
    const { data: articlesData } = await getArticles({
      author: params.username
    })
    const tab = query.tab || 'my'; 
    const getArticleParams = tab === 'my'
        ? { author: params.username }
        : { favorited: params.username };
      const [articleRes, profileRes] = await Promise.all([
        getArticles({
          limit: 5,
          offset: 0,
          ...getArticleParams,
        }),
        getProfile(params.username),
      ]);
    const { profile } = profileRes.data
    const { articlesCount, articles } = articleRes.data
    return {
      profile,
      articles,
      articlesCount,
      tab
    }
  }
}
</script>

<style>

</style>