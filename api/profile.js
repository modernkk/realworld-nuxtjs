import { request } from '../plugins/request'

export const getProfile = (username) => request({
  method: 'GET',
  url: `/api/profiles/${username}`,
})
