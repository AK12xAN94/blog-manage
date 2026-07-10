/**
 * 博客状态映射表
 * 用于显示博客的发布状态标签
 */
export const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '草稿', color: 'default' },
  1: { label: '已发布', color: 'success' },
}

/**
 * 博客分类选项列表
 * 用于分类选择和筛选
 */
export const categories = [
  { value: 'java', label: 'Java' },
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'node', label: 'Node.js' },
  { value: 'database', label: '数据库' },
  { value: 'other', label: '其他' },
]

/**
 * 根据分类值获取分类标签
 * @param {string} value - 分类值
 * @returns {string} 分类标签，如果未找到则返回原值
 */
export const getCategoryLabel = (value: string): string => {
  return categories.find((c) => c.value === value)?.label || value
}

/**
 * 根据状态值获取状态信息
 * @param {number} status - 状态值
 * @returns {{ label: string; color: string }} 状态信息对象
 */
export const getStatusInfo = (status: number): { label: string; color: string } => {
  return statusMap[status] || { label: '未知', color: 'default' }
}