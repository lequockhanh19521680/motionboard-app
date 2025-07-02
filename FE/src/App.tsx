import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './app/login'
import { JSX } from 'react'
import { useAppSelector } from './redux/hook'
import HomePage from './app/home'
import RegisternPage from './app/register'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token)
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisternPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
