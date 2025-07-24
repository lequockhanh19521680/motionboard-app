import { JSX, useState } from 'react'
import { Box } from '@mui/material'
import ShopManagerPanel from './shop-manager'
import OrderManagerPanel from './order-manager'
import StatsManagerPanel from './stat-manager'

import Sidebar, { SidebarItem } from '../../../shared/components/ui/Sidebar'

type PanelKey = 'shop' | 'order' | 'stats'

const components: Record<PanelKey, JSX.Element> = {
  shop: <ShopManagerPanel />,
  order: <OrderManagerPanel />,
  stats: <StatsManagerPanel />,
}

const sidebarItems: SidebarItem[] = [
  { key: 'shop', label: 'Quản lý cửa hàng', icon: '🏪' },
  { key: 'order', label: 'Quản lý đơn hàng', icon: '📦' },
  { key: 'stats', label: 'Thống kê', icon: '📊' },
]

export default function ShopPage() {
  const [selected, setSelected] = useState<PanelKey>('shop')

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc' }}>
      <Sidebar
        title="Quản lý hệ thống"
        selectedKey={selected}
        onSelect={(key) => setSelected(key as PanelKey)}
        items={sidebarItems}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          overflow: 'hidden',
          bgcolor: '#f1f5f9',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            bgcolor: '#ffffff',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'auto',
            p: 3,
          }}
        >
          {components[selected]}
        </Box>
      </Box>
    </Box>
  )
}
