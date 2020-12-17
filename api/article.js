import { request } from '../plugins/request'

export const getArticles = params => request({
  method: 'GET',
  url: '/api/articles',
  params
})

export const getFeedArticles = params => request({
  method: 'GET',
  url: '/api/articles/feed',
  params
})

export const getArticle = (slug) => request({
  method: 'GET',
  url: `/api/articles/${slug}`,
})

export const createArticle = (data) => request({
  method: 'POST',
  url: '/api/articles',
  data
})

export const updateArticle = (slug, data) => request({
  method: 'PUT',
  url: `/api/articles/${slug}`,
  data
})

export const addFavorite = slug => request({
  method: 'POST',
  url: `/api/articles/${slug}/favorite`,
})

export const deleteFavorite = slug => request({
  method: 'DELETE',
  url: `/api/articles/${slug}/favorite`,
})

export const addComment = (slug, data) => request({
  method: 'POST',
  url: `/api/articles/${slug}/comments`,
  data,
})

export const getComments = (slug) => request({
  method: 'GET',
  url: `/api/articles/${slug}/comments`,
})
