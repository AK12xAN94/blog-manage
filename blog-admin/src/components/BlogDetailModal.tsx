import { Modal, Button, Tag, Descriptions, Image } from 'antd'
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { BlogInfo } from '../api/BlogApi'
import { statusMap } from '../utils/constants'
import { formatDateTime } from '../utils/format'

interface BlogDetailModalProps {
  visible: boolean
  onCancel: () => void
  onEdit: (data: BlogInfo) => void
  data: BlogInfo | null
}

export default function BlogDetailModal({ visible, onCancel, onEdit, data }: BlogDetailModalProps) {
  if (!data) return null

  return (
    <Modal
      title="博客详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>{data.title}</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <Tag color={statusMap[data.status]?.color || 'default'}>
            {statusMap[data.status]?.label || '未知'}
          </Tag>
          <Tag color="blue">{data.category}</Tag>
          {data.tags?.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </div>

        {data.cover && (
          <Image
            src={data.cover}
            alt="封面图"
            style={{ width: '100%', height: 250, objectFit: 'cover', marginBottom: 16, borderRadius: 8 }}
          />
        )}

        {data.summary && (
          <p style={{ marginBottom: 16, color: '#666', fontStyle: 'italic' }}>
            摘要：{data.summary}
          </p>
        )}

        <div style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', minHeight: 200 }}>
          {data.content}
        </div>
      </div>

      <Descriptions column={3} size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="阅读量">{data.viewCount}</Descriptions.Item>
        <Descriptions.Item label="点赞数">{data.likeCount}</Descriptions.Item>
        <Descriptions.Item label="评论数">{data.commentCount}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{formatDateTime(data.createdAt)}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{formatDateTime(data.updatedAt)}</Descriptions.Item>
      </Descriptions>

      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          <ArrowLeftOutlined /> 返回列表
        </Button>
        <Button type="primary" onClick={() => onEdit(data)}>
          <EditOutlined /> 编辑博客
        </Button>
      </div>
    </Modal>
  )
}