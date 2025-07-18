import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { HomePage } from './features/home'
import { AdminPage, TestPage } from './features/admin'
import { ShopPage } from './features/shop'
import { ProductDetailPage } from './features/product'
import { CartPage } from './features/cart'
import { ProfilePage } from './features/profile'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import { JSX, useEffect } from 'react'
import { PAGE_ROUTES, USER_ROLE } from './shared/constants'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './redux/store'
import { fetchProfile } from './redux/authSlice'
import CreateProduct from './features/shop/pages/shop-product/create'

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
    return <Navigate to={PAGE_ROUTES.LOGIN} />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={PAGE_ROUTES.LOGIN} />
  }

  return children
}

function AfterLoginRoute() {
  const role = localStorage.getItem('role') || ''
  if (role === USER_ROLE.SHOP) {
    return <Navigate to={PAGE_ROUTES.SHOP} />
  }
  if (role === USER_ROLE.ADMIN) {
    return <Navigate to={PAGE_ROUTES.ADMIN} />
  }
  return <Navigate to={PAGE_ROUTES.HOME} />
}

export default function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(fetchProfile())
    }
  }, [dispatch])
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={PAGE_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={PAGE_ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={PAGE_ROUTES.TEST} element={<TestPage />} />
          <Route path={PAGE_ROUTES.CART} element={<CartPage />} />

          <Route path={PAGE_ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path="/shop/:shop_id/product/create" element={<CreateProduct />} />

          <Route path={PAGE_ROUTES.HOME} element={<HomePage />} />
          <Route path={PAGE_ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />

          <Route
            path={PAGE_ROUTES.SHOP}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLE.SHOP]}>
                <ShopPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PAGE_ROUTES.ADMIN}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path={PAGE_ROUTES.AFTER_LOGIN} element={<AfterLoginRoute />} />
        </Route>

        <Route path="*" element={<Navigate to={PAGE_ROUTES.HOME} />} />
      </Routes>
    </BrowserRouter>
  )
}
