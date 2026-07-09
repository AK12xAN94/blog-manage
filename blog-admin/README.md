# React博客管理系统

基于 React 19 + TypeScript + Vite 的现代化博客管理系统，提供用户认证、博客管理、用户管理等核心功能。

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [登录模块](#登录模块)
- [Layout布局](#layout布局)
- [博客模块](#博客模块)
- [开发指南](#开发指南)
- [测试](#测试)

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 19.2.7 |
| 构建工具 | Vite | 8.1.1 |
| 编程语言 | TypeScript | ~6.0.2 |
| UI组件库 | Ant Design | 6.5.0 |
| 状态管理 | Zustand | 5.0.14 |
| 路由管理 | React Router DOM | 6.30.4 |
| HTTP客户端 | Axios | 1.18.1 |
| 测试框架 | Vitest | 4.1.9 |

## 项目结构

```
blog-admin/
├── public/              # 静态资源
├── src/
│   ├── api/             # API接口定义
│   │   ├── BlogApi.ts   # 博客相关API
│   │   └── UserApi.ts   # 用户相关API
│   ├── components/      # 通用组件
│   │   ├── Layout.tsx           # 全局布局
│   │   ├── ProtectedRoute.tsx   # 路由守卫
│   │   ├── SuspenseWrapper.tsx  # 懒加载包装
│   │   ├── BlogForm.tsx         # 博客表单弹窗
│   │   └── BlogDetailModal.tsx  # 博客详情弹窗
│   ├── pages/           # 页面组件
│   │   ├── Login.tsx      # 登录页
│   │   ├── HomeContent.tsx # 首页内容
│   │   ├── blogs/         # 博客管理页
│   │   └── users/         # 用户管理页
│   ├── router/          # 路由配置
│   │   ├── index.tsx     # 路由实例
│   │   └── routes.tsx    # 路由表
│   ├── store/           # 状态管理
│   │   └── useLoginStore.ts # 登录状态
│   ├── utils/           # 工具函数
│   │   ├── axios.ts     # Axios配置
│   │   ├── http.ts      # HTTP请求封装
│   │   └── token.ts     # Token管理
│   ├── App.tsx          # 根组件
│   ├── main.tsx         # 入口文件
│   └── index.css        # 全局样式
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 登录模块

### 设计思路

登录模块是系统的安全入口，负责用户身份认证和会话管理。设计核心包括：

1. **认证流程**：用户名/密码验证 → Token生成 → 状态持久化 → 页面跳转
2. **路由守卫**：未登录用户自动重定向到登录页
3. **Token管理**：本地存储 + 有效期校验 + 自动刷新
4. **状态同步**：登录状态全局共享，支持页面刷新后恢复

### 实现步骤

#### 步骤1：创建状态管理Store

使用 Zustand 管理登录状态，集成 `persist` 中间件实现持久化：

```typescript
// src/store/useLoginStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserLoginState {
  userInfo: UserInfo | null
  token: string | null
  isLoggedIn: boolean
  login: (params: LoginParams) => Promise<void>
  logout: () => void
  checkTokenValidity: () => boolean
}

const useUserLoginStore = create<UserLoginState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      token: null,
      isLoggedIn: false,
      
      login: async (params) => {
        // 模拟登录验证
        if (params.username === 'admin' && params.password === 'admin') {
          const token = generateToken()
          set({ userInfo, token, isLoggedIn: true })
          setLocalToken(token)
        }
      },
      
      logout: () => {
        set({ userInfo: null, token: null, isLoggedIn: false })
        removeLocalToken()
      },
      
      checkTokenValidity: () => {
        // Token有效期校验（24小时）
        const tokenAge = Date.now() - timestamp
        return tokenAge < 24 * 60 * 60 * 1000
      },
    }),
    { name: 'blog-admin-user-login' }
  )
)
```

**设计要点**：
- 使用 `persist` 中间件自动将状态保存到 localStorage
- 登录成功后同时更新内存状态和本地存储
- `checkTokenValidity` 方法校验 Token 格式和有效期

#### 步骤2：实现登录页面组件

```tsx
// src/pages/Login.tsx
export default function Login() {
  const [loading, setLoading] = useState(false)
  const { login } = useUserLoginStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/'

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      await login(values)
      message.success('登录成功')
      navigate(from, { replace: true })
    } catch {
      message.error('登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card>
        <Form onFinish={handleSubmit}>
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  )
}
```

**设计要点**：
- 使用 Ant Design 的 Form 组件实现表单验证
- 通过 `location.state` 获取跳转前的路径，实现登录后自动返回
- 登录状态通过 Zustand 的 `login` action 更新

#### 步骤3：实现路由守卫

```tsx
// src/components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, token, checkTokenValidity } = useUserLoginStore()
  const isValid = checkTokenValidity()

  useEffect(() => {
    if (!isLoggedIn || !token) {
      message.warning("请先登录")
      navigate("/login", { state: { from: location.pathname } })
      return
    }

    if (!isValid) {
      message.error("登录已过期，请重新登录")
      useUserLoginStore.getState().logout()
      navigate("/login", { state: { from: location.pathname } })
    }
  }, [isLoggedIn, token, navigate, location.pathname, isValid])

  if (!isLoggedIn || !token) return null
  if (!isValid) return null

  return <>{children}</>
}
```

**设计要点**：
- 使用 `useEffect` 监听登录状态变化，实现路由拦截
- 双重校验：登录状态 + Token有效性
- 未登录或 Token 过期时，记录当前路径并跳转登录页
- 组件卸载前返回 `null`，避免渲染未授权内容

#### 步骤4：配置路由

```tsx
// src/router/routes.tsx
const HomeContent = lazy(() => import('../pages/HomeContent'))
const Blogs = lazy(() => import('../pages/blogs'))
const Users = lazy(() => import('../pages/users'))

const routes: RouteObject[] = [
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomeContent />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'blogs',
        element: (
          <SuspenseWrapper>
            <Blogs />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <SuspenseWrapper>
            <Users />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]
```

**设计要点**：
- 登录页不受路由守卫保护，允许匿名访问
- 其他页面嵌套在 `ProtectedRoute` 中，实现统一权限控制
- 使用 `lazy()` 实现组件懒加载，配合 `SuspenseWrapper` 处理加载状态

#### 步骤5：实现懒加载包装组件

```tsx
// src/components/SuspenseWrapper.tsx
import { Suspense } from 'react'

export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="loading">加载中...</div>}>
      {children}
    </Suspense>
  )
}
```

**设计要点**：
- 使用 React 的 `Suspense` 组件处理组件懒加载
- `fallback` 属性设置加载状态展示内容
- 统一包装所有懒加载组件，确保加载体验一致

### 核心流程图

```
用户访问 /blogs
    ↓
ProtectedRoute 检查登录状态
    ↓
未登录 → 跳转 /login?from=/blogs
    ↓
用户输入用户名密码 → 调用 login action
    ↓
验证成功 → 更新状态 + 存储Token
    ↓
跳转回 /blogs（通过 location.state.from）
```

---

## Layout布局

### 设计思路

Layout 组件作为系统的全局布局容器，负责组织页面结构和导航。设计核心包括：

1. **布局结构**：侧边栏（导航）+ 头部（用户信息）+ 内容区（路由出口）+ 页脚
2. **响应式设计**：侧边栏可折叠，适应不同屏幕尺寸
3. **导航同步**：菜单选中状态与当前路由自动匹配
4. **用户交互**：头像下拉菜单、退出登录

### 实现步骤

#### 步骤1：定义布局结构

```tsx
// src/components/Layout.tsx
const { Header, Sider, Content, Footer } = Layout

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, userInfo } = useUserLoginStore()

  return (
    <Layout className="home-layout">
      {/* 侧边栏 */}
      <Sider collapsible collapsed={collapsed} className="home-sider">
        <div className="sider-logo">
          {!collapsed && <span>知否在线博客论坛</span>}
        </div>
        <Menu mode="inline" selectedKeys={[selectedKey]} onClick={handleMenuClick}>
          {menuItems}
        </Menu>
      </Sider>

      {/* 主内容区 */}
      <Layout>
        <Header className="home-header">
          {/* 折叠按钮 */}
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          {/* 用户信息 */}
          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span>{userInfo?.nickname || '管理员'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="home-content">
          <Outlet /> {/* 路由出口 */}
        </Content>
        
        <Footer className="home-footer">
          知否技术 ©2024
        </Footer>
      </Layout>
    </Layout>
  )
}
```

**设计要点**：
- 使用 Ant Design 的 `Layout` 组件构建整体布局框架
- `Sider` 组件实现可折叠侧边栏
- `Outlet` 组件作为子路由的渲染出口

#### 步骤2：实现导航菜单

```tsx
// src/components/Layout.tsx
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

const handleMenuClick = ({ key }: { key: string }) => {
  navigate(key)
}
```

**设计要点**：
- 使用 `useLocation` 获取当前路径，自动匹配菜单项
- `getSelectedKey` 函数处理精确匹配和前缀匹配
- 点击菜单通过 `useNavigate` 跳转到对应路由

#### 步骤3：实现用户下拉菜单

```tsx
// src/components/Layout.tsx
const userMenuItems = [
  { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
]

const handleUserMenuClick = ({ key }: { key: string }) => {
  if (key === 'logout') {
    logout()
  }
}
```

**设计要点**：
- 使用 Ant Design 的 `Dropdown` 组件实现下拉菜单
- 调用 Zustand 的 `logout` action 清空状态和 Token

#### 步骤4：添加样式

```css
/* src/pages/home/index.css */
.home-layout {
  min-height: 100vh;
  width: 100%;
}

.home-sider {
  background-color: #001529;
}

.sider-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.home-header {
  background-color: #fff;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.home-content {
  background-color: #f5f5f5;
  padding: 24px;
  overflow: auto;
}

.home-footer {
  text-align: center;
  background-color: #f0f2f5;
  color: #666;
  font-size: 12px;
}
```

**设计要点**：
- 侧边栏使用深色主题，与主内容区形成视觉区分
- 头部添加阴影效果，增强层次感
- 内容区使用浅灰色背景，突出卡片内容

### 布局结构图

```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                     │
│  ┌─────────────┐                            ┌─────────────┐ │
│  │ ☰ Toggle    │                            │ Avatar +    │ │
│  │             │                            │ 用户名      │ │
│  └─────────────┘                            └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌─────────────────────────────────────────┐ │
│  │           │  │                                         │ │
│  │   Sider   │  │         Content (Outlet)                │ │
│  │  Navigation│  │                                         │ │
│  │           │  │  ┌───────────────────────────────────┐  │ │
│  │  • 首页   │  │  │                                   │  │ │
│  │  • 用户   │  │  │      页面内容                      │  │ │
│  │  • 博客   │  │  │                                   │  │ │
│  │           │  │  └───────────────────────────────────┘  │ │
│  └───────────┘  └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                     │
│                  知否技术 ©2024                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 博客模块

### 设计思路

博客模块是系统的核心功能，包含文章的增删改查、筛选搜索、分页排序等操作。设计核心包括：

1. **数据管理**：本地状态管理列表数据、搜索条件、分页信息
2. **表格展示**：使用 Ant Design Table 实现排序、筛选、分页
3. **弹窗交互**：新增/编辑表单、详情查看弹窗
4. **数据过滤**：标题搜索、分类筛选、状态筛选

### 实现步骤

#### 步骤1：定义数据接口和模拟数据

```typescript
// src/api/BlogApi.ts
export interface BlogInfo {
  id: number
  title: string
  content: string
  summary: string
  cover: string
  category: string
  tags: string[]
  status: number
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

// src/pages/blogs/index.tsx - 模拟数据
const mockBlogs: BlogInfo[] = [
  {
    id: 1,
    title: '深入理解Java虚拟机内存模型',
    content: 'Java虚拟机的内存模型...',
    category: 'java',
    tags: ['Java', 'JVM', '内存模型'],
    status: 1,
    viewCount: 3520,
    createdAt: '2024-11-20T10:30:00',
  },
  // ...更多数据
]
```

**设计要点**：
- 使用 TypeScript 接口定义数据结构
- 提供完整的字段类型定义，包括枚举类型（status）和数组类型（tags）
- 模拟数据用于开发测试，实际项目中通过 API 获取

#### 步骤2：实现博客列表页面

```tsx
// src/pages/blogs/index.tsx
export default function Blogs() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BlogInfo[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState({
    title: '',
    category: undefined,
    status: undefined,
  })

  // 数据加载逻辑
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = filterBlogData(mockBlogs, searchParams, pagination)
        setData(result.data)
        setTotal(result.total)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [searchParams, pagination])

  // ...
}
```

**设计要点**：
- 使用多个 `useState` 管理不同维度的状态
- `searchParams` 存储搜索条件，`pagination` 存储分页信息
- `useEffect` 监听状态变化，自动重新加载数据

#### 步骤3：实现数据过滤函数

```typescript
// src/pages/blogs/index.tsx
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
```

**设计要点**：
- 纯函数设计，无副作用，便于测试
- 支持多条件组合过滤
- 先过滤后分页，确保分页基于过滤结果

#### 步骤4：配置表格列

```tsx
// src/pages/blogs/index.tsx
const columns: TableProps<BlogInfo>['columns'] = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    sorter: (a, b) => a.title.localeCompare(b.title, 'zh-CN'),
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    filters: categories.map(item => ({ text: item.label, value: item.value })),
    onFilter: (value, record) => record.category === value,
    render: (category) => (
      <Tag color="blue">{categories.find(c => c.value === category)?.label}</Tag>
    ),
  },
  {
    title: '发布日期',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    render: (date) => formatDate(date),
  },
  // ...其他列
]
```

**设计要点**：
- `sorter` 属性配置排序函数，支持字符串比较和日期比较
- `filters` + `onFilter` 配置列筛选功能
- `render` 属性自定义单元格渲染，如使用 `Tag` 组件展示分类

#### 步骤5：实现操作列

```tsx
// src/pages/blogs/index.tsx
{
  title: '操作',
  key: 'actions',
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
        onConfirm={() => handleDelete(record.id)}
      >
        <Button size="small" danger icon={<DeleteOutlined />}>
          删除
        </Button>
      </Popconfirm>
    </Space>
  ),
}
```

**设计要点**：
- 使用 `Popconfirm` 组件实现删除确认
- 操作按钮绑定对应的处理函数
- `Space` 组件统一按钮间距

#### 步骤6：实现博客表单弹窗

```tsx
// src/components/BlogForm.tsx
export default function BlogForm({ visible, onCancel, onSuccess, editData }: BlogFormProps) {
  const [form] = Form.useForm()

  const handleSubmit = async (values, status: number) => {
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
  }

  return (
    <Modal title={editData ? '编辑博客' : '创建博客'} open={visible} onCancel={handleCancel}>
      <Form form={form} layout="vertical" initialValues={editData ? { ...editData } : {}}>
        <Form.Item name="title" rules={[{ required: true }]}>
          <Input placeholder="请输入博客标题" />
        </Form.Item>
        <Form.Item name="content" rules={[{ required: true }]}>
          <TextArea rows={10} />
        </Form.Item>
        {/* ...其他字段 */}
      </Form>
    </Modal>
  )
}
```

**设计要点**：
- 使用 Ant Design Form 组件实现表单验证和数据绑定
- 支持新增和编辑两种模式，通过 `editData` 参数区分
- 提交时根据操作类型（发布/保存草稿）设置不同的 `status`

#### 步骤7：实现博客详情弹窗

```tsx
// src/components/BlogDetailModal.tsx
export default function BlogDetailModal({ visible, onCancel, onEdit, data }: BlogDetailModalProps) {
  if (!data) return null

  return (
    <Modal title="博客详情" open={visible} onCancel={onCancel} footer={null}>
      <h2>{data.title}</h2>
      <div>
        <Tag color={statusMap[data.status]?.color}>{statusMap[data.status]?.label}</Tag>
        <Tag color="blue">{data.category}</Tag>
        {data.tags?.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
      </div>
      {data.cover && <Image src={data.cover} />}
      <div style={{ whiteSpace: 'pre-wrap' }}>{data.content}</div>
      <Descriptions column={3}>
        <Descriptions.Item label="阅读量">{data.viewCount}</Descriptions.Item>
        <Descriptions.Item label="点赞数">{data.likeCount}</Descriptions.Item>
        {/* ...其他信息 */}
      </Descriptions>
    </Modal>
  )
}
```

**设计要点**：
- 使用 `Descriptions` 组件展示博客元信息
- `Image` 组件展示封面图
- `whiteSpace: 'pre-wrap'` 保留内容的换行格式

### 模块结构图

```
Blogs页面
    ├── 搜索区域
    │   ├── Search（标题搜索）
    │   ├── Select（分类筛选）
    │   └── Select（状态筛选）
    ├── 操作栏
    │   └── Button（新建博客）
    ├── Table（博客列表）
    │   ├── 标题列（支持排序）
    │   ├── 分类列（支持筛选）
    │   ├── 标签列
    │   ├── 阅读量列（支持排序）
    │   ├── 状态列（支持筛选）
    │   ├── 发布日期列（支持排序）
    │   └── 操作列（查看/编辑/删除）
    ├── BlogForm（弹窗）
    │   ├── 标题输入
    │   ├── 摘要输入
    │   ├── 封面上传
    │   ├── 分类选择
    │   ├── 标签选择
    │   ├── 内容输入
    │   └── 保存草稿/发布按钮
    └── BlogDetailModal（弹窗）
        ├── 标题和标签
        ├── 封面图
        ├── 内容展示
        ├── 统计信息
        └── 返回列表/编辑按钮
```

---

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 测试

### 运行测试

```bash
npm run test
```

### 运行测试并生成覆盖率报告

```bash
npm run test:coverage
```

---

## 项目特点

1. **现代化技术栈**：React 19 + TypeScript + Vite，享受极速开发体验
2. **简洁的状态管理**：使用 Zustand 替代复杂的 Redux，代码量减少 50%
3. **完善的路由守卫**：基于 React Router v6 的路由权限控制
4. **优雅的 UI 设计**：Ant Design 6.x 组件库，美观且易用
5. **类型安全**：TypeScript 严格模式，从编译期保证代码质量
6. **可测试性**：纯函数设计，便于单元测试和集成测试

---

**默认账号**：admin / admin