import { axios } from '@/utils/request'

const api = {
  users: '/auth/auth/users',
  user: '/auth/auth/user',
  roles: '/auth/auth/roles',
  role: '/auth/auth/role',
  configMeta: '/auth/auth/services/meta',
  serviceConfig: '/auth/auth/services/config',
  routeConfig: '/auth/auth/routes',
  initPassword: '/auth/auth/password',
  updatePassword: '/auth/current/password'
}

export function getUsers (parameter) {
  return axios({
    url: api.users,
    method: 'get',
    data: parameter
  })
}

export function saveUser (parameter) {
  return axios({
    url: api.user,
    method: 'post',
    data: parameter
  })
}

export function deleteUser (parameter) {
  return axios({
    url: api.user + '/' + parameter,
    method: 'delete'
  })
}

export function getRoles (parameter) {
  return axios({
    url: api.roles,
    method: 'get',
    data: parameter
  })
}

export function saveRole (parameter) {
  return axios({
    url: api.role,
    method: 'post',
    data: parameter
    // params: parameter
  })
}

export function deleteRole (parameter) {
  return axios({
    url: api.role + '/' + parameter,
    method: 'delete',
    data: parameter
  })
}

export function getConfigMeta () {
  return axios({
    url: api.configMeta,
    method: 'get'
  })
}

export function getServiceConfig (parameter) {
  return axios({
    url: api.serviceConfig,
    method: 'get',
    params: parameter
  })
}

export function getRouteInfo (parameter) {
  return axios({
    url: api.routeConfig,
    method: 'get',
    params: parameter
  })
}

export function initPassword (parameter) {
  return axios({
    url: api.initPassword + '/' + parameter,
    method: 'put'
  })
}

export function updatePassword (parameter) {
  return axios({
    url: api.updatePassword,
    method: 'post',
    data: parameter
  })
}
