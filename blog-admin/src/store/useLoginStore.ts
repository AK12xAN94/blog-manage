import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setToken as setLocalToken, removeToken as removeLocalToken } from '../utils/token'

export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  nickname: string
  avatar: string
  token: string
  createdAt: string
  updatedAt: string
}

interface UserLoginState {
  userInfo: UserInfo | null
  token: string | null
  isLoggedIn: boolean
  login: (params: LoginParams) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  setUserInfo: (userInfo: UserInfo | null) => void
  setToken: (token: string | null) => void
  checkTokenValidity: () => boolean
}

const MOCK_USER_INFO: UserInfo = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  nickname: '管理员',
  avatar: '',
  token: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const generateToken = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `mock_token_${timestamp}_${random}`
}

const useUserLoginStore = create<UserLoginState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      token: null,
      isLoggedIn: false,

      login: async (params: LoginParams) => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (params.username === 'admin' && params.password === 'admin') {
          const token = generateToken()
          const userInfo: UserInfo = {
            ...MOCK_USER_INFO,
            token,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          set({
            userInfo,
            token,
            isLoggedIn: true,
          })
          setLocalToken(token)
        } else {
          throw new Error('用户名或密码错误')
        }
      },

      logout: () => {
        set({
          userInfo: null,
          token: null,
          isLoggedIn: false,
        })
        removeLocalToken()
      },

      refreshToken: async () => {
        const currentState = get()
        if (currentState.userInfo) {
          const newToken = generateToken()
          const updatedUserInfo: UserInfo = {
            ...currentState.userInfo,
            token: newToken,
            updatedAt: new Date().toISOString(),
          }
          set({
            userInfo: updatedUserInfo,
            token: newToken,
          })
          setLocalToken(newToken)
        }
      },

      setUserInfo: (userInfo: UserInfo | null) => {
        set({ userInfo })
      },

      setToken: (token: string | null) => {
        set({ token })
        if (token) {
          setLocalToken(token)
        } else {
          removeLocalToken()
        }
      },

      checkTokenValidity: () => {
        const { token, isLoggedIn } = get()
        if (!token || !isLoggedIn) {
          return false
        }
        if (!token.startsWith('mock_token_')) {
          return false
        }
        const parts = token.split('_')
        if (parts.length < 3) {
          return false
        }
        const timestamp = parseInt(parts[2], 10)
        if (isNaN(timestamp)) {
          return false
        }
        const tokenAge = Date.now() - timestamp
        const maxAge = 24 * 60 * 60 * 1000
        return tokenAge < maxAge
      },
    }),
    {
      name: 'blog-admin-user-login',
    }
  )
)

export const useUserInfo = () => useUserLoginStore((state) => state.userInfo)
export const useToken = () => useUserLoginStore((state) => state.token)
export const useIsLoggedIn = () => useUserLoginStore((state) => state.isLoggedIn)

export default useUserLoginStore