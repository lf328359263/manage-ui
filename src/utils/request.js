import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://47.95.216.127:8440/', // api base_url
  // baseURL: 'http://192.168.10.188:8440/', // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (data.status === '403') {
      notification.error({
        message: 'Forbidden',
        description: data.msg
      })
    }
    // if (data.status === '401' && !(data.result && data.result.isLogin)) {
    if (data.status === '401') {
      notification.error({
        message: '认证失败',
        description: data.msg
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    // config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
