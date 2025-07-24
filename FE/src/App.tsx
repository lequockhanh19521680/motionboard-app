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
import { useAppSelector } from './redux/hook'
import ShopLayout from './layouts/ShopLayout'
import { useLocation } from 'react-router-dom'

// ------ RequireAuth Component ------
type RequireAuthProps = {
  allowedRoles?: string[]
  children: JSX.Element
}

function RequireAuth({ allowedRoles, children }: RequireAuthProps) {
  const token = localStorage.getItem('token')
  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()

  if (!token) {
    return <Navigate to={PAGE_ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={PAGE_ROUTES.HOME} replace />
  }

  return children
}

// ------ AfterLoginRoute như cũ ------
const roleToRoute = {
  [USER_ROLE.SHOP]: PAGE_ROUTES.SHOP,
  [USER_ROLE.ADMIN]: PAGE_ROUTES.ADMIN,
}

function AfterLoginRoute() {
  const user = useAppSelector((state) => state.auth.user)
  console.log('user', user)
  const targetRoute = user ? roleToRoute[user.role] || PAGE_ROUTES.HOME : PAGE_ROUTES.HOME
  return <Navigate to={targetRoute} />
}

// ------ Main App ------
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

          <Route
            path={PAGE_ROUTES.PROFILE}
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />

          <Route path={PAGE_ROUTES.HOME} element={<HomePage />} />
          <Route path={PAGE_ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />

          <Route
            path={PAGE_ROUTES.ADMIN}
            element={
              <RequireAuth allowedRoles={[USER_ROLE.ADMIN]}>
                <AdminPage />
              </RequireAuth>
            }
          />

          <Route path={PAGE_ROUTES.AFTER_LOGIN} element={<AfterLoginRoute />} />
        </Route>

        <Route element={<ShopLayout />}>
          <Route
            path={PAGE_ROUTES.SHOP}
            element={
              <RequireAuth allowedRoles={[USER_ROLE.SHOP]}>
                <ShopPage />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={PAGE_ROUTES.HOME} />} />
      </Routes>
    </BrowserRouter>
  )
}
