import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './app/login'
import RegisterPage from './app/register'
import HomePage from './app/home'
import AdminPage from './app/admin'
import ShopPage from './app/shop'
import AuthLayout from './components/layout/AuthLayout'
import MainLayout from './components/layout/MainLayout'
import { useEffect, JSX } from 'react'
import { ROUTES, USER_ROLE } from './utils/constant'
import ProductDetailPage from './app/product'

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element
  allowedRoles: string[]
}) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') || ''

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  return children
}

function AfterLoginRoute() {
  const role = localStorage.getItem('role') || ''
  if (role === USER_ROLE.SHOP) {
    return <Navigate to={ROUTES.SHOP} />
  }
  if (role === USER_ROLE.ADMIN) {
    return <Navigate to={ROUTES.ADMIN} />
  }
  return <Navigate to={ROUTES.HOME} />
}

export default function App() {
  useEffect(() => {
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY
      if (endY - startY > 100) {
        window.location.reload()
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />

          <Route
            path={ROUTES.SHOP}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLE.SHOP]}>
                <ShopPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES.AFTER_LOGIN} element={<AfterLoginRoute />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
      </Routes>
    </BrowserRouter>
  )
}
