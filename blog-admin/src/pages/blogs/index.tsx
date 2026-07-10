import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Input, Select, Space, Tag, message, Popconfirm, Spin, ConfigProvider } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import type { BlogInfo } from '../../api/BlogApi'
import BlogForm from '../../components/BlogForm'
import { categories, statusMap } from '../../utils/constants'
import { formatDate } from '../../utils/format'
import { mockBlogs } from '../../mock/blogMock'

const { Search } = Input
const { Option } = Select

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

export default function Blogs() {
  const navigate = useNavigate()
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

  const handleView = (record: BlogInfo) => {
    navigate(`/blog/${record.id}`)
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
    </div>
  )
}