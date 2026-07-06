import { http } from '../utils/http'
import type { ApiResponse } from '../utils/http'
import type { PageResult } from './UserApi'

export interface BlogInfo {
  id: number
  title: string
  content: string
  summary: string
  cover: string
  category: string
  tags: string[]
  status: number
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface BlogPageParams {
  pageNum: number
  pageSize: number
  title?: string
  category?: string
  status?: number
}

/**
 * 获取博客分页列表
 * @param {BlogPageParams} params - 分页查询参数
 * @param {number} params.pageNum - 页码（从1开始）
 * @param {number} params.pageSize - 每页条数
 * @param {string} [params.title] - 标题（模糊搜索）
 * @param {string} [params.category] - 分类
 * @param {number} [params.status] - 状态（0-草稿，1-发布）
 * @returns {Promise<ApiResponse<PageResult<BlogInfo>>>} 博客分页数据
 * @throws {Error} 查询失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 500: 服务器内部错误
 */
export const getBlogList = async (params: BlogPageParams): Promise<ApiResponse<PageResult<BlogInfo>>> => {
  return http.get<PageResult<BlogInfo>>('/blog/page', { params })
}

/**
 * 获取博客详情
 * @param {number} id - 博客ID
 * @returns {Promise<ApiResponse<BlogInfo>>} 博客详细信息
 * @throws {Error} 查询失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 404: 博客不存在
 *   - 500: 服务器内部错误
 */
export const getBlogInfo = async (id: number): Promise<ApiResponse<BlogInfo>> => {
  return http.get<BlogInfo>(`/blog/info/${id}`)
}

/**
 * 创建或更新博客
 * @param {Partial<BlogInfo>} params - 博客信息
 * @param {number} [params.id] - 博客ID（更新时必填）
 * @param {string} params.title - 标题
 * @param {string} params.content - 内容
 * @param {string} [params.summary] - 摘要
 * @param {string} [params.cover] - 封面图片URL
 * @param {string} [params.category] - 分类
 * @param {string[]} [params.tags] - 标签数组
 * @param {number} [params.status] - 状态（0-草稿，1-发布）
 * @returns {Promise<ApiResponse<BlogInfo>>} 创建或更新后的博客信息
 * @throws {Error} 操作失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 403: 拒绝访问
 *   - 404: 博客不存在（更新时）
 *   - 500: 服务器内部错误
 */
export const saveBlog = async (params: Partial<BlogInfo>): Promise<ApiResponse<BlogInfo>> => {
  return http.post<BlogInfo>('/blog/save', params)
}

/**
 * 更新博客信息
 * @param {number} id - 博客ID
 * @param {Partial<BlogInfo>} params - 更新的博客信息
 * @returns {Promise<ApiResponse<BlogInfo>>} 更新后的博客信息
 * @throws {Error} 更新失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 403: 拒绝访问
 *   - 404: 博客不存在
 *   - 500: 服务器内部错误
 */
export const updateBlog = async (id: number, params: Partial<BlogInfo>): Promise<ApiResponse<BlogInfo>> => {
  return http.put<BlogInfo>(`/blog/update/${id}`, params)
}

/**
 * 删除博客
 * @param {number} id - 博客ID
 * @returns {Promise<ApiResponse<null>>} 删除结果
 * @throws {Error} 删除失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 403: 拒绝访问
 *   - 404: 博客不存在
 *   - 500: 服务器内部错误
 */
export const deleteBlog = async (id: number): Promise<ApiResponse<null>> => {
  return http.delete<null>(`/blog/delete/${id}`)
}

/**
 * 发布博客
 * @param {number} id - 博客ID
 * @returns {Promise<ApiResponse<BlogInfo>>} 发布后的博客信息
 * @throws {Error} 发布失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 403: 拒绝访问
 *   - 404: 博客不存在
 *   - 500: 服务器内部错误
 */
export const publishBlog = async (id: number): Promise<ApiResponse<BlogInfo>> => {
  return http.put<BlogInfo>(`/blog/publish/${id}`)
}

/**
 * 下架博客
 * @param {number} id - 博客ID
 * @returns {Promise<ApiResponse<BlogInfo>>} 下架后的博客信息
 * @throws {Error} 操作失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 403: 拒绝访问
 *   - 404: 博客不存在
 *   - 500: 服务器内部错误
 */
export const unpublishBlog = async (id: number): Promise<ApiResponse<BlogInfo>> => {
  return http.put<BlogInfo>(`/blog/unpublish/${id}`)
}

export default {
  getBlogList,
  getBlogInfo,
  saveBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
}