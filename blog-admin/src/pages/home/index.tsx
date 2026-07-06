import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useUserLoginStore from '../../store/useLoginStore'
import './index.css'

const { Header, Sider, Content, Footer } = Layout

const menuItems = [
  { key: '1', label: '首页', icon: <HomeOutlined /> },
  { key: '2', label: '用户管理', icon: <UserOutlined /> },
  { key: '3', label: '博客管理', icon: <FileTextOutlined /> },
]

const userMenuItems = [
  { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
]

export default function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { logout, userInfo } = useUserLoginStore()

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case '1':
        navigate('/')
        break
      case '2':
        navigate('/users')
        break
      case '3':
        navigate('/blogs')
        break
    }
  }

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
    }
  }

  return (
    <Layout className="home-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="home-sider"
        theme="dark"
      >
        <div className="sider-logo">
          {!collapsed && <span className="logo-text">知否在线博客论坛</span>}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="home-header">
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div className="header-right">
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span>{userInfo?.nickname || '管理员'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="home-content">
          <div className="welcome-section">
            <h2 className="welcome-title">欢迎来到知否在线博客论坛</h2>
            <div className="hero-card">
              <div className="hero-content">
                <h1 className="hero-title">知否技术</h1>
                <p className="hero-subtitle">让技术更简单</p>
                <div className="search-bar">
                  <input type="text" placeholder="搜索文章..." />
                  <button className="search-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="hero-image">
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=two%20cartoon%20students%20studying%20at%20desk%20with%20books%20minimal%20style%20purple%20background&image_size=landscape_4_3"
                  alt="Welcome"
                />
              </div>
            </div>
          </div>
        </Content>
        <Footer className="home-footer">
          知否技术 ©2024 Created by 知否技术
        </Footer>
      </Layout>
    </Layout>
  )
}