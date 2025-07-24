// OrderManagerPanel.tsx
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'

export default function OrderManagerPanel() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography sx={{ fontWeight: 800, fontSize: 19, color: '#333', px: 2, mb: 1 }}>
        Quản lý Đơn hàng
      </Typography>
      <List disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <ListAltIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Tất cả đơn hàng" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCartCheckoutIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Đơn chờ xử lý" />
        </ListItemButton>
      </List>
    </Box>
  )
}
