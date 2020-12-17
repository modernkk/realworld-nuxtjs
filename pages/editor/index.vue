<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(msg, index) in messages" :key="index">
                {{ field }} {{ msg }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="article.tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle } from '@/api/article'
export default {
  middleware: 'authenticated',
  name: 'EditorIndex',
  async asyncData() {
    return {
      article: {},
      errors: {},
    }
  },
  methods: {
    async onSubmit () {
      try {
        const { data } = await createArticle({
          article: {
            title: this.article.title,
            description: this.article.description,
            body: this.article.body,
            tagList: [],
          },
        });
        this.$router.push(`/article/${data.article.slug}`);
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    }
  }
};
</script>

<style>
</style>