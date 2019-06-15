import { axios } from '@/utils/request'

const api = {
  overview: '/flink/overview'
}

export function getInfo () {
  return axios({
    url: api.overview,
    method: 'get'
  })
}
