import Header from '../shared/components/layout/Header'
import Footer from '../shared/components/layout/Footer'
import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ flex: 1, py: 2 }}>
        <Outlet />
      </Container>
      <Footer />
    </div>
  )
}
