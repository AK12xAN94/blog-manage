import { useState } from 'react'
import { Form, Input, Select, Button, Upload, Modal, message } from 'antd'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons'
import type { BlogInfo } from '../api/BlogApi'
import { saveBlog } from '../api/BlogApi'
import { categories } from '../utils/constants'

interface BlogFormProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  editData?: BlogInfo | null
}

const { TextArea } = Input
const { Option } = Select

export default function BlogForm({ visible, onCancel, onSuccess, editData }: BlogFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFormReset = () => {
    form.resetFields()
  }

  const handleCancel = () => {
    handleFormReset()
    onCancel()
  }

  const handleCoverUpload = async (file: File) => {
    setUploading(true)
    try {
      const reader = new FileReader()
      return new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (values: {
    title: string
    content: string
    category: string
    tags: string[]
    cover?: string
    summary?: string
  }, status: number) => {
    setLoading(true)
    try {
      const params: Partial<BlogInfo> = {
        ...values,
        status,
        tags: values.tags || [],
      }
      if (editData?.id) {
        params.id = editData.id
      }
      await saveBlog(params)
      message.success(status === 1 ? '发布成功' : '保存草稿成功')
      handleFormReset()
      onSuccess()
    } catch {
      message.error('操作失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = () => {
    form.validateFields().then((values) => {
      handleSubmit(values, 1)
    })
  }

  const handleSaveDraft = () => {
    form.validateFields(['title']).then((values) => {
      handleSubmit(values, 0)
    })
  }

  const uploadProps = {
    name: 'cover',
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: async (file: File) => {
      const coverUrl = await handleCoverUpload(file)
      form.setFieldValue('cover', coverUrl)
      return false
    },
    fileList: form.getFieldValue('cover') ? [{ uid: 'cover', name: '封面图', status: 'done' as const }] : [],
  }

  return (
    <Modal
      title={editData ? '编辑博客' : '创建博客'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editData ? {
          title: editData.title,
          content: editData.content,
          category: editData.category,
          tags: editData.tags,
          cover: editData.cover,
          summary: editData.summary,
        } : {}}
        onValuesChange={() => {}}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[
            { required: true, message: '请输入博客标题' },
            { max: 100, message: '标题不能超过100个字符' },
          ]}
        >
          <Input placeholder="请输入博客标题" />
        </Form.Item>

        <Form.Item
          name="summary"
          label="摘要"
          rules={[
            { max: 200, message: '摘要不能超过200个字符' },
          ]}
        >
          <TextArea
            placeholder="请输入博客摘要（可选）"
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="cover"
          label="封面图"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={uploading}>
                {form.getFieldValue('cover') ? '更换封面' : '上传封面'}
              </Button>
            </Upload>
            {form.getFieldValue('cover') && (
              <>
                <img
                  src={form.getFieldValue('cover')}
                  alt="封面预览"
                  style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }}
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => form.setFieldValue('cover', undefined)}
                >
                  删除
                </Button>
              </>
            )}
          </div>
        </Form.Item>

        <Form.Item
          name="category"
          label="分类"
          rules={[
            { required: true, message: '请选择博客分类' },
          ]}
        >
          <Select placeholder="请选择博客分类">
            {categories.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tags"
          label="标签"
        >
          <Select
            mode="tags"
            placeholder="请输入标签，按回车添加"
            allowClear
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="内容"
          rules={[
            { required: true, message: '请输入博客内容' },
            { min: 10, message: '内容不能少于10个字符' },
          ]}
        >
          <TextArea
            placeholder="请输入博客内容"
            rows={10}
            showCount
            maxLength={10000}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button
            type="default"
            onClick={handleSaveDraft}
            loading={loading}
            style={{ marginRight: 8 }}
          >
            保存草稿
          </Button>
          <Button
            type="primary"
            onClick={handlePublish}
            loading={loading}
          >
            发布
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}