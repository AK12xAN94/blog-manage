import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/home'
import ProtectedRoute from '../components/ProtectedRoute'

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
]

const router = createBrowserRouter(routes)

export default router