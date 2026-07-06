import axios from 'axios'
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { message } from 'antd'
import useUserLoginStore from '../store/useLoginStore'

const SUCCESS_CODE = 200

export interface ApiResponse<T = unknown> {
  code?: number
  success?: boolean
  message: string
  data: T
}

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = useUserLoginStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
    const { data } = response

    if (data.success !== undefined) {
      if (!data.success) {
        message.error(data.message || '请求失败')
        throw new Error(data.message || '请求失败')
      }
    } else if (data.code !== undefined) {
      if (data.code === 401) {
        message.error('登录已过期，请重新登录')
        useUserLoginStore.getState().logout()
        throw new Error('登录已过期')
      }
      if (data.code !== SUCCESS_CODE) {
        message.error(data.message || '请求失败')
        throw new Error(data.message || '请求失败')
      }
    }

    return response
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      const messageMap: Record<number, string> = {
        400: '请求参数错误',
        401: '未授权，请重新登录',
        403: '拒绝访问',
        404: '请求资源不存在',
        500: '服务器内部错误',
        502: '网关错误',
        503: '服务不可用',
      }
      const msg = messageMap[status] || `请求错误，状态码：${status}`
      message.error(msg)

      if (status === 401) {
        useUserLoginStore.getState().logout()
      }
    } else if (error.request) {
      message.error('请求超时，请稍后重试')
    } else {
      message.error('请求失败：' + error.message)
    }

    return Promise.reject(error)
  }
)

export default instance