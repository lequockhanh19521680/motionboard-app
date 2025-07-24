// StatsManagerPanel.tsx
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'

export default function StatsManagerPanel() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography sx={{ fontWeight: 800, fontSize: 19, color: '#333', px: 2, mb: 1 }}>
        Quản lý Thống kê
      </Typography>
      <List disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <BarChartIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Báo cáo doanh số" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <InsertChartOutlinedIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Biểu đồ truy cập" />
        </ListItemButton>
      </List>
    </Box>
  )
}
