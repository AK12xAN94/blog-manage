/** @refresh skip */
import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import Login from '../pages/Login'
import AppLayout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import SuspenseWrapper from '../components/SuspenseWrapper'

const HomeContent = lazy(() => import('../pages/HomeContent'))
const Blogs = lazy(() => import('../pages/blogs'))
const Users = lazy(() => import('../pages/users'))

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
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

const router = createBrowserRouter(routes)

export default router
