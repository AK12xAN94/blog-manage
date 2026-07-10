/**
 * 格式化日期时间
 * 显示完整的日期和时间信息
 * @param {string} dateStr - 日期字符串
 * @returns {string} 格式化后的日期时间字符串（如：2024/11/20 10:30）
 */
export const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 格式化日期
 * 只显示日期部分，不含时间
 * @param {string} dateStr - 日期字符串
 * @returns {string} 格式化后的日期字符串（如：2024/11/20）
 */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}