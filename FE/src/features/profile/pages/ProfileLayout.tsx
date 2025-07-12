import React, { useState } from 'react'
import {
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import SettingsIcon from '@mui/icons-material/Settings'
import HistoryIcon from '@mui/icons-material/History'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material/styles'

import { useAppSelector } from '../../../redux/hook'
import ProfileInfo from './ProfileInfo'
import ChangePassword from './ChangePassword'
import Settings from './Setting'
import ActivityHistory from './ActivityHistory'
import Notifications from './Notifications'
import SubscriptionManagement from './SubscriptionManagement'
import LogoutTab from './LogoutTab'
import { Navigate } from 'react-router-dom'
import { PAGE_ROUTES } from '../../../shared/constants'

const sidebarWidth = 320

export default function ProfileLayout() {
  const theme = useTheme()
  const user = useAppSelector((state) => state.auth.user)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index)
  }

  const menuItems = [
    { text: 'Thông tin cá nhân', icon: <PersonIcon /> },
    { text: 'Đổi mật khẩu', icon: <LockIcon /> },
    { text: 'Cài đặt', icon: <SettingsIcon /> },
    { text: 'Lịch sử hoạt động', icon: <HistoryIcon /> },
    { text: 'Thông báo', icon: <NotificationsIcon /> },
    { text: 'Quản lý đăng ký', icon: <AssignmentIcon /> },
    { text: 'Đăng xuất', icon: <LogoutIcon /> },
  ]

  const handleLogout = () => {
    return <Navigate to={PAGE_ROUTES.LOGIN} />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 128px)', // chừa chỗ header footer
        width: '100%',
        bgcolor: '#f5f8fa', // nền nhẹ nhàng sáng
        color: 'text.primary',
        overflow: 'hidden',
        px: 4,
        py: 3,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          width: sidebarWidth,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          p: 4,
          boxShadow: `0 0 20px ${theme.palette.primary.main}66`, // alpha 0.4
          userSelect: 'none',
        }}
      >
        <Box
          sx={{
            mb: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'default',
          }}
        >
          <Avatar
            src={user?.image || undefined}
            alt={user?.full_name || 'User'}
            sx={{
              width: 64,
              height: 64,
              fontSize: 32,
              border: `2px solid ${theme.palette.primary.contrastText}cc`, // 80% opacity
              backgroundColor: `${theme.palette.primary.contrastText}4d`, // 30% opacity
              boxShadow: `0 0 8px ${theme.palette.primary.contrastText}80`,
            }}
          >
            {user?.full_name?.charAt(0) || user?.username?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" noWrap>
              {user?.full_name || user?.username}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }} noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <List component="nav" sx={{ flexGrow: 1 }}>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={item.text}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
              sx={{
                color: 'inherit',
                borderRadius: 2,
                mb: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&.Mui-selected': {
                  bgcolor: theme.palette.primary.light + '33', // alpha ~20%
                  fontWeight: 'bold',
                  boxShadow: `inset 4px 0 0 0 ${theme.palette.primary.light}`, // border-left sáng
                  transform: 'scale(1.03)',
                },
                '&:hover': {
                  bgcolor: theme.palette.primary.light + '22', // alpha ~13%
                },
                '&:focus-visible': {
                  bgcolor: theme.palette.primary.light + '33',
                  boxShadow: `inset 4px 0 0 0 ${theme.palette.primary.light}`,
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 'medium', fontSize: 16 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          ml: 5,
          p: 5,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 0 30px rgb(0 0 0 / 0.1)',
          overflowY: 'auto',
          minHeight: '100%',
        }}
      >
        {selectedIndex === 0 && <ProfileInfo />}
        {selectedIndex === 1 && <ChangePassword />}
        {selectedIndex === 2 && <Settings />}
        {selectedIndex === 3 && <ActivityHistory />}
        {selectedIndex === 4 && <Notifications />}
        {selectedIndex === 5 && <SubscriptionManagement />}
        {selectedIndex === 6 && <LogoutTab onLogout={handleLogout} />}
      </Box>
    </Box>
  )
}
