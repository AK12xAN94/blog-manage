import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from '../utils/axios'
import { login, getUserList, getUserInfo, createUser, updateUser, deleteUser } from './UserApi'

vi.mock('../utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

const mockAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

describe('UserApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login should call POST /user/login with correct params', async () => {
    const mockData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      nickname: 'Test',
      avatar: '',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.post.mockResolvedValue(mockResponse)

    const params = { username: 'testuser', password: '123456' }
    const result = await login(params)

    expect(mockAxios.post).toHaveBeenCalledWith('/user/login', params, undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('getUserList should call GET /user/page with correct params', async () => {
    const mockData = {
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      totalPages: 0,
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.get.mockResolvedValue(mockResponse)

    const params = { pageNum: 1, pageSize: 10, username: 'test' }
    const result = await getUserList(params)

    expect(mockAxios.get).toHaveBeenCalledWith('/user/page', { params })
    expect(result).toEqual(mockResponse.data)
  })

  it('getUserInfo should call GET /user/info/:id', async () => {
    const mockData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      nickname: 'Test',
      avatar: '',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await getUserInfo(1)

    expect(mockAxios.get).toHaveBeenCalledWith('/user/info/1', undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('createUser should call POST /user/save with correct params', async () => {
    const mockData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      nickname: 'Test',
      avatar: '',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.post.mockResolvedValue(mockResponse)

    const params = { username: 'testuser', password: '123456', email: 'test@example.com' }
    const result = await createUser(params)

    expect(mockAxios.post).toHaveBeenCalledWith('/user/save', params, undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('updateUser should call PUT /user/update/:id with correct params', async () => {
    const mockData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      nickname: 'Test',
      avatar: '',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.put.mockResolvedValue(mockResponse)

    const params = { nickname: 'New Name' }
    const result = await updateUser(1, params)

    expect(mockAxios.put).toHaveBeenCalledWith('/user/update/1', params, undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('deleteUser should call DELETE /user/delete/:id', async () => {
    const mockResponse = { data: { code: 200, message: 'success', data: null } }
    mockAxios.delete.mockResolvedValue(mockResponse)

    const result = await deleteUser(1)

    expect(mockAxios.delete).toHaveBeenCalledWith('/user/delete/1', undefined)
    expect(result).toEqual(mockResponse.data)
  })
})