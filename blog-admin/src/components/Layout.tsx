import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown } from 'antd'
import '../pages/home/index.css'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useUserLoginStore from '../store/useLoginStore'

const { Header, Sider, Content, Footer } = Layout

const menuItems = [
  { key: '/', label: '首页', icon: <HomeOutlined /> },
  { key: '/users', label: '用户管理', icon: <UserOutlined /> },
  { key: '/blogs', label: '博客管理', icon: <FileTextOutlined /> },
]

const getSelectedKey = (pathname: string): string => {
  return menuItems.find(item =>
    pathname === item.key || pathname.startsWith(item.key + '/')
  )?.key || '/'
}

const userMenuItems = [
  { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
]

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, userInfo } = useUserLoginStore()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
    }
  }

  const selectedKey = getSelectedKey(location.pathname)

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
          selectedKeys={[selectedKey]}
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
          <Outlet />
        </Content>
        <Footer className="home-footer">
          知否技术 ©2024 Created by 知否技术
        </Footer>
      </Layout>
    </Layout>
  )
}
