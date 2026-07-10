import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Tag, Descriptions, Image, Spin, Result, Card } from 'antd'
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { BlogInfo } from '../../api/BlogApi'
import { statusMap } from '../../utils/constants'
import { formatDateTime } from '../../utils/format'
import { mockBlogs } from '../../mock/blogMock'

/**
 * 博客详情页组件
 * 从URL参数中获取博客ID，模拟API调用获取详情数据
 */
export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [blogData, setBlogData] = useState<BlogInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!id) {
        setError('博客ID不存在')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))

        // 模拟获取博客详情数据
        // TODO: 后续替换为真实的API调用: const response = await getBlogInfo(Number(id))
        const mockBlog: BlogInfo | undefined = mockBlogs.find(blog => blog.id === Number(id))

        if (!mockBlog) {
          setError('博客不存在')
          setBlogData(null)
        } else {
          setBlogData(mockBlog)
        }
      } catch{
        setError('获取博客详情失败，请稍后重试')
        setBlogData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogDetail()
  }, [id])

  const handleBack = () => {
    navigate('/blogs')
  }

  const handleEdit = () => {
    // TODO: 跳转到编辑页面或打开编辑模态框
    console.log('编辑博客', blogData)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (error) {
    return (
      <Result
        status="404"
        title="加载失败"
        subTitle={error}
        extra={
          <Button type="primary" onClick={handleBack}>
            返回博客列表
          </Button>
        }
      />
    )
  }

  if (!blogData) {
    return (
      <Result
        status="404"
        title="博客不存在"
        subTitle="抱歉，您访问的博客不存在或已被删除"
        extra={
          <Button type="primary" onClick={handleBack}>
            返回博客列表
          </Button>
        }
      />
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Button onClick={handleBack} style={{ marginBottom: 16 }}>
            <ArrowLeftOutlined /> 返回列表
          </Button>

          <h2 style={{ marginBottom: 16, fontSize: 24, fontWeight: 600 }}>{blogData.title}</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <Tag color={statusMap[blogData.status]?.color || 'default'}>
              {statusMap[blogData.status]?.label || '未知'}
            </Tag>
            <Tag color="blue">{blogData.category}</Tag>
            {blogData.tags?.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>

          {blogData.cover && (
            <Image
              src={blogData.cover}
              alt="封面图"
              style={{ width: '100%', height: 300, objectFit: 'cover', marginBottom: 16, borderRadius: 8 }}
            />
          )}

          {blogData.summary && (
            <p style={{ marginBottom: 16, color: '#666', fontStyle: 'italic', fontSize: 16 }}>
              摘要：{blogData.summary}
            </p>
          )}

          <div style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', minHeight: 200, fontSize: 15 }}>
            {blogData.content}
          </div>
        </div>

        <Descriptions column={3} size="small" style={{ marginBottom: 24 }} bordered>
          <Descriptions.Item label="阅读量">{blogData.viewCount}</Descriptions.Item>
          <Descriptions.Item label="点赞数">{blogData.likeCount}</Descriptions.Item>
          <Descriptions.Item label="评论数">{blogData.commentCount}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDateTime(blogData.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatDateTime(blogData.updatedAt)}</Descriptions.Item>
        </Descriptions>

        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button type="primary" onClick={handleEdit}>
            <EditOutlined /> 编辑博客
          </Button>
        </div>
      </Card>
    </div>
  )
}