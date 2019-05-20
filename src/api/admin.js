import { axios } from '@/utils/request'

const api = {
  users: '/auth/auth/users',
  user: '/auth/auth/user',
  roles: '/auth/auth/roles',
  role: '/auth/auth/role'
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
    url: api.user,
    method: 'delete',
    data: parameter
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
  })
}

export function deleteRole (parameter) {
  console.log(parameter)
  return axios({
    url: api.role,
    method: 'delete',
    data: parameter
  })
}
