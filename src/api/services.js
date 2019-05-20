import { axios } from '@/utils/request'

const api = {
  services: '/discovery/eureka/apps'
}

export function getServices (parameter) {
  return axios({
    url: api.services,
    method: 'get',
    header: {
      'accept': 'application/json'
    },
    params: parameter
  })
}
