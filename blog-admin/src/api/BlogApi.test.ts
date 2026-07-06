import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from '../utils/axios'
import { getBlogList, getBlogInfo, saveBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog } from './BlogApi'

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

describe('BlogApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getBlogList should call GET /blog/page with correct params', async () => {
    const mockData = {
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      totalPages: 0,
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.get.mockResolvedValue(mockResponse)

    const params = { pageNum: 1, pageSize: 10, title: 'test' }
    const result = await getBlogList(params)

    expect(mockAxios.get).toHaveBeenCalledWith('/blog/page', { params })
    expect(result).toEqual(mockResponse.data)
  })

  it('getBlogInfo should call GET /blog/info/:id', async () => {
    const mockData = {
      id: 1,
      title: 'Test Blog',
      content: 'Content',
      summary: 'Summary',
      cover: '',
      category: 'Tech',
      tags: ['tag1'],
      status: 1,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await getBlogInfo(1)

    expect(mockAxios.get).toHaveBeenCalledWith('/blog/info/1', undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('saveBlog should call POST /blog/save with correct params', async () => {
    const mockData = {
      id: 1,
      title: 'Test Blog',
      content: 'Content',
      summary: 'Summary',
      cover: '',
      category: 'Tech',
      tags: ['tag1'],
      status: 1,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.post.mockResolvedValue(mockResponse)

    const params = { title: 'Test Blog', content: 'Content' }
    const result = await saveBlog(params)

    expect(mockAxios.post).toHaveBeenCalledWith('/blog/save', params, undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('updateBlog should call PUT /blog/update/:id with correct params', async () => {
    const mockData = {
      id: 1,
      title: 'Updated Blog',
      content: 'Content',
      summary: 'Summary',
      cover: '',
      category: 'Tech',
      tags: ['tag1'],
      status: 1,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.put.mockResolvedValue(mockResponse)

    const params = { title: 'Updated Blog' }
    const result = await updateBlog(1, params)

    expect(mockAxios.put).toHaveBeenCalledWith('/blog/update/1', params, undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('deleteBlog should call DELETE /blog/delete/:id', async () => {
    const mockResponse = { data: { code: 200, message: 'success', data: null } }
    mockAxios.delete.mockResolvedValue(mockResponse)

    const result = await deleteBlog(1)

    expect(mockAxios.delete).toHaveBeenCalledWith('/blog/delete/1', undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('publishBlog should call PUT /blog/publish/:id', async () => {
    const mockData = {
      id: 1,
      title: 'Test Blog',
      content: 'Content',
      summary: 'Summary',
      cover: '',
      category: 'Tech',
      tags: ['tag1'],
      status: 1,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.put.mockResolvedValue(mockResponse)

    const result = await publishBlog(1)

    expect(mockAxios.put).toHaveBeenCalledWith('/blog/publish/1', undefined, undefined)
    expect(result).toEqual(mockResponse.data)
  })

  it('unpublishBlog should call PUT /blog/unpublish/:id', async () => {
    const mockData = {
      id: 1,
      title: 'Test Blog',
      content: 'Content',
      summary: 'Summary',
      cover: '',
      category: 'Tech',
      tags: ['tag1'],
      status: 0,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    const mockResponse = { data: { code: 200, message: 'success', data: mockData } }
    mockAxios.put.mockResolvedValue(mockResponse)

    const result = await unpublishBlog(1)

    expect(mockAxios.put).toHaveBeenCalledWith('/blog/unpublish/1', undefined, undefined)
    expect(result).toEqual(mockResponse.data)
  })
})