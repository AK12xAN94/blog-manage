import React, { useState, useEffect } from 'react'
import { Table, Button, Input, Select, Space, Tag, message, Popconfirm, Spin, ConfigProvider } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import type { BlogInfo } from '../../api/BlogApi'
import BlogForm from '../../components/BlogForm'
import BlogDetailModal from '../../components/BlogDetailModal'

const { Search } = Input
const { Option } = Select

const categories = [
  { value: 'java', label: 'Java' },
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'node', label: 'Node.js' },
  { value: 'database', label: '数据库' },
  { value: 'other', label: '其他' },
]

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '草稿', color: 'default' },
  1: { label: '已发布', color: 'success' },
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const filterBlogData = (
  data: BlogInfo[],
  searchParams: { title: string; category: string | undefined; status: number | undefined },
  pagination: { current: number; pageSize: number }
) => {
  let filteredData = [...data]

  if (searchParams.title) {
    filteredData = filteredData.filter((blog) =>
      blog.title.toLowerCase().includes(searchParams.title.toLowerCase())
    )
  }

  if (searchParams.category) {
    filteredData = filteredData.filter((blog) => blog.category === searchParams.category)
  }

  if (searchParams.status !== undefined) {
    filteredData = filteredData.filter((blog) => blog.status === searchParams.status)
  }

  const total = filteredData.length
  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  const paginatedData = filteredData.slice(start, end)

  return { data: paginatedData, total }
}

const mockBlogs: BlogInfo[] = [
  {
    id: 1,
    title: '深入理解Java虚拟机内存模型',
    content: 'Java虚拟机的内存模型是Java程序运行时的核心概念之一。本文将深入探讨JVM的内存结构，包括堆内存、栈内存、方法区等各个部分的作用和特点。通过实例代码和详细图解，帮助读者更好地理解Java程序在内存中的运行机制。',
    summary: '深入探讨JVM内存结构和运行机制',
    cover: '',
    category: 'java',
    tags: ['Java', 'JVM', '内存模型'],
    status: 1,
    viewCount: 3520,
    likeCount: 186,
    commentCount: 45,
    createdAt: '2024-11-20T10:30:00',
    updatedAt: '2024-11-20T10:30:00',
  },
  {
    id: 2,
    title: 'Vue3 Composition API完全指南',
    content: 'Vue3引入的Composition API为Vue开发者带来了全新的编码体验。本文从基础概念入手，详细介绍ref、reactive、computed、watch等核心API的使用方法，并通过实际案例展示如何利用Composition API构建可维护的大型应用。',
    summary: '全面掌握Vue3 Composition API',
    cover: '',
    category: 'vue',
    tags: ['Vue3', 'Composition API', '前端'],
    status: 1,
    viewCount: 2890,
    likeCount: 156,
    commentCount: 32,
    createdAt: '2024-11-18T14:20:00',
    updatedAt: '2024-11-18T14:20:00',
  },
  {
    id: 3,
    title: 'React Hooks最佳实践',
    content: 'React Hooks改变了我们编写React组件的方式。本文总结了使用Hooks的最佳实践，包括useState、useEffect、useContext等常用Hook的使用技巧，以及如何避免常见的陷阱和性能问题。',
    summary: 'React Hooks使用技巧与避坑指南',
    cover: '',
    category: 'react',
    tags: ['React', 'Hooks', '最佳实践'],
    status: 1,
    viewCount: 4100,
    likeCount: 234,
    commentCount: 58,
    createdAt: '2024-11-15T09:15:00',
    updatedAt: '2024-11-15T09:15:00',
  },
  {
    id: 4,
    title: 'Node.js高性能服务器开发',
    content: 'Node.js凭借其非阻塞I/O模型在服务器端开发中占据重要地位。本文介绍如何利用Node.js构建高性能Web服务器，包括中间件的设计、异步编程模式、进程管理等关键技术点。',
    summary: '构建高并发Node.js服务器',
    cover: '',
    category: 'node',
    tags: ['Node.js', '服务器', '高性能'],
    status: 1,
    viewCount: 1980,
    likeCount: 98,
    commentCount: 24,
    createdAt: '2024-11-12T16:45:00',
    updatedAt: '2024-11-12T16:45:00',
  },
  {
    id: 5,
    title: 'MySQL索引优化实战',
    content: '索引是数据库性能优化的关键。本文通过实际案例深入分析MySQL索引的原理和使用方法，包括B+树索引结构、联合索引设计、索引失效场景等，帮助开发者写出高效的SQL查询语句。',
    summary: '掌握MySQL索引优化技巧',
    cover: '',
    category: 'database',
    tags: ['MySQL', '索引', '性能优化'],
    status: 1,
    viewCount: 5200,
    likeCount: 312,
    commentCount: 76,
    createdAt: '2024-11-10T11:00:00',
    updatedAt: '2024-11-10T11:00:00',
  },
  {
    id: 6,
    title: 'Java并发编程入门到精通',
    content: '并发编程是Java开发者必须掌握的技能。本文从线程基础开始，逐步介绍synchronized、Lock、线程池、原子类等并发工具的使用，以及如何解决线程安全问题。',
    summary: '系统学习Java并发编程',
    cover: '',
    category: 'java',
    tags: ['Java', '并发', '多线程'],
    status: 0,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: '2024-11-08T13:30:00',
    updatedAt: '2024-11-08T13:30:00',
  },
  {
    id: 7,
    title: 'Vue Router路由管理详解',
    content: 'Vue Router是Vue.js官方的路由管理器。本文详细介绍路由配置、动态路由、嵌套路由、路由守卫等核心功能，并通过示例代码展示如何实现复杂的路由场景。',
    summary: 'Vue Router核心功能解析',
    cover: '',
    category: 'vue',
    tags: ['Vue', 'Router', '路由'],
    status: 1,
    viewCount: 2150,
    likeCount: 112,
    commentCount: 28,
    createdAt: '2024-11-05T10:00:00',
    updatedAt: '2024-11-05T10:00:00',
  },
  {
    id: 8,
    title: 'React状态管理方案对比',
    content: 'React生态中有多种状态管理方案可供选择。本文对比分析Redux、Zustand、Jotai、Recoil等主流状态管理库的优缺点，帮助开发者根据项目需求选择合适的方案。',
    summary: 'Redux、Zustand、Jotai等方案对比',
    cover: '',
    category: 'react',
    tags: ['React', '状态管理', 'Redux'],
    status: 1,
    viewCount: 3400,
    likeCount: 178,
    commentCount: 42,
    createdAt: '2024-11-02T15:20:00',
    updatedAt: '2024-11-02T15:20:00',
  },
  {
    id: 9,
    title: 'TypeScript类型体操实战',
    content: 'TypeScript的类型系统非常强大。本文通过一系列有趣的类型体操练习，帮助读者深入理解TypeScript的类型推断、泛型、条件类型等高级特性，提升类型编程能力。',
    summary: '提升TypeScript类型编程能力',
    cover: '',
    category: 'other',
    tags: ['TypeScript', '类型', '进阶'],
    status: 0,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: '2024-10-30T09:45:00',
    updatedAt: '2024-10-30T09:45:00',
  },
  {
    id: 10,
    title: 'Redis缓存策略设计',
    content: 'Redis作为高性能缓存数据库在分布式系统中广泛应用。本文介绍缓存击穿、缓存穿透、缓存雪崩等常见问题的解决方案，以及Redis的持久化策略和集群配置。',
    summary: 'Redis缓存最佳实践',
    cover: '',
    category: 'database',
    tags: ['Redis', '缓存', '分布式'],
    status: 1,
    viewCount: 2780,
    likeCount: 145,
    commentCount: 35,
    createdAt: '2024-10-28T14:00:00',
    updatedAt: '2024-10-28T14:00:00',
  },
]

export default function Blogs() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BlogInfo[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [searchParams, setSearchParams] = useState({
    title: '',
    category: undefined as string | undefined,
    status: undefined as number | undefined,
  })

  const [formVisible, setFormVisible] = useState(false)
  const [editData, setEditData] = useState<BlogInfo | null>(null)

  const [detailVisible, setDetailVisible] = useState(false)
  const [detailData, setDetailData] = useState<BlogInfo | null>(null)

  const handleView = (record: BlogInfo) => {
    setDetailData(record)
    setDetailVisible(true)
  }

  const handleEdit = (record: BlogInfo) => {
    setEditData(record)
    setFormVisible(true)
  }

  const handleDelete = async (id: number) => {
    setLoading(true)
    try {
      const index = mockBlogs.findIndex((blog) => blog.id === id)
      if (index !== -1) {
        mockBlogs.splice(index, 1)
        message.success('删除成功')
        const result = filterBlogData(mockBlogs, searchParams, pagination)
        setData(result.data)
        setTotal(result.total)
      } else {
        message.error('博客不存在')
      }
    } catch {
      message.error('删除失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const columns: TableProps<BlogInfo>['columns'] = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 200,
      sorter: (a: BlogInfo, b: BlogInfo) => a.title.localeCompare(b.title, 'zh-CN'),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      filters: categories.map((item) => ({
        text: item.label,
        value: item.value,
      })),
      onFilter: (value: boolean | React.Key, record: BlogInfo) => record.category === value,
      render: (category: string) => (
        <Tag color="blue">{categories.find((c) => c.value === category)?.label || category}</Tag>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      ellipsis: true,
      render: (tags: string[]) => (
        <Space size={4}>
          {tags?.map((tag: string, index: number) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      sorter: (a: BlogInfo, b: BlogInfo) => a.viewCount - b.viewCount,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      filters: [
        { text: '草稿', value: 0 },
        { text: '已发布', value: 1 },
      ],
      onFilter: (value: boolean | React.Key, record: BlogInfo) => record.status === value,
      render: (status: number) => (
        <Tag color={statusMap[status]?.color || 'default'}>
          {statusMap[status]?.label || '未知'}
        </Tag>
      ),
    },
    {
      title: '发布日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a: BlogInfo, b: BlogInfo) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (_: unknown, record: BlogInfo) => (
        <Space size={4}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此博客？"
            description="删除后将无法恢复，确定继续吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = filterBlogData(mockBlogs, searchParams, pagination)
        setData(result.data)
        setTotal(result.total)
      } catch {
        message.error('获取数据失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchParams, pagination])

  const handleTableChange: TableProps<BlogInfo>['onChange'] = (paginationInfo) => {
    setPagination({
      current: paginationInfo.current || 1,
      pageSize: paginationInfo.pageSize || 10,
    })
  }

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({ ...prev, title: value }))
    setPagination({ current: 1, pageSize: pagination.pageSize })
  }

  const handleCategoryChange = (value: string | undefined) => {
    setSearchParams((prev) => ({ ...prev, category: value }))
    setPagination({ current: 1, pageSize: pagination.pageSize })
  }

  const handleStatusChange = (value: number | undefined) => {
    setSearchParams((prev) => ({ ...prev, status: value }))
    setPagination({ current: 1, pageSize: pagination.pageSize })
  }

  const handleAdd = () => {
    setEditData(null)
    setFormVisible(true)
  }

  const handleFormSuccess = () => {
    setFormVisible(false)
    const result = filterBlogData(mockBlogs, searchParams, pagination)
    setData(result.data)
    setTotal(result.total)
  }

  const handleEditFromDetail = (data: BlogInfo) => {
    setDetailVisible(false)
    setEditData(data)
    setFormVisible(true)
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>博客管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建博客
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Search
          placeholder="搜索博客标题"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 300 }}
          onSearch={handleSearch}
          onChange={(e) => {
            if (!e.target.value) {
              handleSearch('')
            }
          }}
        />
        <Select
          placeholder="选择分类"
          allowClear
          style={{ width: 150 }}
          onChange={handleCategoryChange}
        >
          {categories.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="选择状态"
          allowClear
          style={{ width: 120 }}
          onChange={handleStatusChange}
        >
          <Option value={0}>草稿</Option>
          <Option value={1}>已发布</Option>
        </Select>
      </div>

      <Spin spinning={loading}>
        <ConfigProvider locale={zhCN}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
        </ConfigProvider>
      </Spin>

      <BlogForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSuccess={handleFormSuccess}
        editData={editData}
      />

      <BlogDetailModal
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        onEdit={handleEditFromDetail}
        data={detailData}
      />
    </div>
  )
}