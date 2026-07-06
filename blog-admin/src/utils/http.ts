import type { AxiosRequestConfig } from 'axios'
import instance from './axios'
import type { ApiResponse } from './axios'

export type HttpConfig = AxiosRequestConfig

export const http = {
  get<T = unknown>(url: string, config?: HttpConfig): Promise<ApiResponse<T>> {
    return instance.get<ApiResponse<T>>(url, config).then((res) => res.data)
  },

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpConfig
  ): Promise<ApiResponse<T>> {
    return instance.post<ApiResponse<T>>(url, data, config).then((res) => res.data)
  },

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpConfig
  ): Promise<ApiResponse<T>> {
    return instance.put<ApiResponse<T>>(url, data, config).then((res) => res.data)
  },

  delete<T = unknown>(url: string, config?: HttpConfig): Promise<ApiResponse<T>> {
    return instance.delete<ApiResponse<T>>(url, config).then((res) => res.data)
  },

  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpConfig
  ): Promise<ApiResponse<T>> {
    return instance.patch<ApiResponse<T>>(url, data, config).then((res) => res.data)
  },
}

export type { ApiResponse }

export default http