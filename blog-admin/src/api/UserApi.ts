import { http } from '../utils/http'
import type { ApiResponse } from '../utils/http'

export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  nickname: string
  avatar: string
  token: string
  createdAt: string
  updatedAt: string
}

export interface UserPageParams {
  pageNum: number
  pageSize: number
  username?: string
  email?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  totalPages: number
}

/**
 * 用户登录接口
 * @param {LoginParams} params - 登录参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @returns {Promise<ApiResponse<UserInfo>>} 登录成功返回用户信息，包含token
 * @throws {Error} 登录失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 用户名或密码错误
 *   - 500: 服务器内部错误
 */
export const login = async (params: LoginParams): Promise<ApiResponse<UserInfo>> => {
  return http.post<UserInfo>('/user/login', params)
}

/**
 * 获取用户分页列表
 * @param {UserPageParams} params - 分页查询参数
 * @param {number} params.pageNum - 页码（从1开始）
 * @param {number} params.pageSize - 每页条数
 * @param {string} [params.username] - 用户名（模糊搜索）
 * @param {string} [params.email] - 邮箱（模糊搜索）
 * @returns {Promise<ApiResponse<PageResult<UserInfo>>>} 用户分页数据
 * @throws {Error} 查询失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 500: 服务器内部错误
 */
export const getUserList = async (params: UserPageParams): Promise<ApiResponse<PageResult<UserInfo>>> => {
  return http.get<PageResult<UserInfo>>('/user/page', { params })
}

/**
 * 获取用户详情
 * @param {number} id - 用户ID
 * @returns {Promise<ApiResponse<UserInfo>>} 用户详细信息
 * @throws {Error} 查询失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 404: 用户不存在
 *   - 500: 服务器内部错误
 */
export const getUserInfo = async (id: number): Promise<ApiResponse<UserInfo>> => {
  return http.get<UserInfo>(`/user/info/${id}`)
}

/**
 * 创建用户
 * @param {Partial<UserInfo>} params - 用户信息（不含id）
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @param {string} [params.email] - 邮箱
 * @param {string} [params.nickname] - 昵称
 * @param {string} [params.avatar] - 头像URL
 * @returns {Promise<ApiResponse<UserInfo>>} 创建成功的用户信息
 * @throws {Error} 创建失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 403: 拒绝访问
 *   - 500: 服务器内部错误
 */
export const createUser = async (params: Partial<UserInfo> & { password: string }): Promise<ApiResponse<UserInfo>> => {
  return http.post<UserInfo>('/user/save', params)
}

/**
 * 更新用户信息
 * @param {number} id - 用户ID
 * @param {Partial<UserInfo>} params - 更新的用户信息
 * @returns {Promise<ApiResponse<UserInfo>>} 更新后的用户信息
 * @throws {Error} 更新失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 403: 拒绝访问
 *   - 404: 用户不存在
 *   - 500: 服务器内部错误
 */
export const updateUser = async (id: number, params: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> => {
  return http.put<UserInfo>(`/user/update/${id}`, params)
}

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise<ApiResponse<null>>} 删除结果
 * @throws {Error} 删除失败时抛出错误，可能的错误码：
 *   - 400: 请求参数错误
 *   - 401: 未授权，请重新登录
 *   - 403: 拒绝访问
 *   - 404: 用户不存在
 *   - 500: 服务器内部错误
 */
export const deleteUser = async (id: number): Promise<ApiResponse<null>> => {
  return http.delete<null>(`/user/delete/${id}`)
}

export default {
  login,
  getUserList,
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
}