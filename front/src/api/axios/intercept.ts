import axios from 'axios'

// axios 实例
const instance = axios.create({
  timeout: 15000,
  responseType: 'json',
})


// 添加请求拦截器
instance.interceptors.request.use(
  request => {
    return request
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    return Promise.resolve(response)
  },
  error => {
    return Promise.reject(error)
    
  }
)

export default instance