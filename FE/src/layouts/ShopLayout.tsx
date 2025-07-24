import Footer from '../shared/components/layout/Footer'
import HeaderShop from '../shared/components/layout/HeaderShop'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function ShopLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f7fb' }}>
      <HeaderShop />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Box
          sx={{
            flex: 1,

            background: '#f5f7fb',
            minWidth: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}
