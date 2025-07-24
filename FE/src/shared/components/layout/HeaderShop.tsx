import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { styled, alpha } from '@mui/material/styles'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  MenuList,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  Button,
  Divider,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { logout } from '../../../redux/authSlice'
import { useAppSelector } from '../../../redux/hook'
import { useState } from 'react'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.25),
  },
  marginLeft: theme.spacing(3),
  flexGrow: 1,
  maxWidth: 420,
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

export default function HeaderShop() {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  // User menu state
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setUserAnchorEl(e.currentTarget)
  const handleMenuClose = () => setUserAnchorEl(null)
  const handleLogout = () => {
    dispatch(logout())
    handleMenuClose()
    navigate('/login')
  }

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/shop/dashboard"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 2,
            mr: 2,
          }}
        >
          Quản lý shop
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {user ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar
                  src={user.image ? user.image : undefined}
                  alt={user.fullName}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.fullName?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu anchorEl={userAnchorEl} open={Boolean(userAnchorEl)} onClose={handleMenuClose}>
                <MenuList>
                  <MuiMenuItem disabled>
                    <Typography variant="body2">{user.fullName}</Typography>
                  </MuiMenuItem>
                  <MuiMenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    Trang cá nhân
                  </MuiMenuItem>
                  <MuiMenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Đăng xuất
                  </MuiMenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <MuiMenuItem component={Link} to="/login">
                Đăng nhập
              </MuiMenuItem>
              <MuiMenuItem component={Link} to="/register">
                Đăng ký
              </MuiMenuItem>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
