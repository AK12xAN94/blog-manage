import { Button, Input } from 'antd'
import { ArrowLeftOutlined, SearchOutlined, HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './home/index.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <span className="icon-404">404</span>
        </div>
        <h1 className="not-found-title">页面未找到</h1>
        <p className="not-found-desc">抱歉，您访问的页面不存在或已被移动</p>
        
        <div className="not-found-search">
          <Input
            className="search-input"
            prefix={<SearchOutlined />}
            placeholder="搜索文章或页面..."
            onPressEnter={() => navigate('/')}
          />
        </div>
        
        <div className="not-found-actions">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => window.history.back()}
          >
            返回上一页
          </Button>
        </div>
        
        <div className="not-found-suggestions">
          <p className="suggestions-title">您可以尝试：</p>
          <ul className="suggestions-list">
            <li>检查网址是否输入正确</li>
            <li>使用上方搜索框查找内容</li>
            <li>从首页导航栏浏览其他页面</li>
          </ul>
        </div>
      </div>
    </div>
  )
}