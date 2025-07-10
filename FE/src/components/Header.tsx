import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import { styled, alpha } from '@mui/material/styles'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SearchIcon from '@mui/icons-material/Search'
import { Link, useNavigate } from 'react-router-dom'
import { PAGE_ROUTES } from '../utils/constant'
import { Menu, MenuList, MenuItem as MuiMenuItem, ListItemIcon } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { logout } from '../redux/authSlice'
import { fetchCart } from '../redux/cartSlice'
import { useAppSelector } from '../redux/hook'
import { CartItemPreview } from '../types/response/CartItemResponse'

// Search bar styling
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

export default function Header() {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()

  const user = useAppSelector((state) => state.auth.user)
  const cartItems: CartItemPreview[] = useAppSelector((state) => state.cart.items)
  const cartLoading = useAppSelector((state) => state.cart.loading)

  const cartCount = cartItems.length

  // Effect simple: chỉ scale nhanh rồi trở về, không màu mè
  const [animateCart, setAnimateCart] = React.useState(false)
  const prevCartCount = React.useRef(cartCount)
  React.useEffect(() => {
    if (prevCartCount.current !== cartCount) {
      setAnimateCart(true)
      const timer = setTimeout(() => setAnimateCart(false), 180)
      prevCartCount.current = cartCount
      return () => clearTimeout(timer)
    }
  }, [cartCount])

  // Popover state cho giỏ hàng
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handlePopoverToggle = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(anchorEl ? null : event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)

  // Account menu state
  const [userAnchorEl, setUserAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setUserAnchorEl(e.currentTarget)
  const handleMenuClose = () => setUserAnchorEl(null)
  const handleLogout = () => {
    dispatch(logout())
    handleMenuClose()
    navigate('/login')
  }

  // Fetch cart khi login
  React.useEffect(() => {
    if (user) dispatch(fetchCart())
  }, [dispatch, user])

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to={PAGE_ROUTES.HOME}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 2,
            mr: 2,
          }}
        >
          SellBuy
        </Typography>

        <Search sx={{ display: { xs: 'none', md: 'flex' } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Tìm kiếm sản phẩm…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <IconButton
            color="inherit"
            size="large"
            aria-haspopup="true"
            onClick={handlePopoverToggle}
          >
            {/* Scale đơn giản, tinh tế, không đổi màu */}
            <span
              className={
                animateCart
                  ? 'scale-110 transition-transform duration-150 ease-out'
                  : 'transition-transform duration-150'
              }
              style={{ display: 'inline-block' }}
            >
              <Badge badgeContent={cartLoading ? 0 : cartCount} color="secondary" showZero>
                <ShoppingCartIcon className="text-xl" />
              </Badge>
            </span>
          </IconButton>

          <Popover
            id="cart-popover"
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
            PaperProps={{
              sx: { minWidth: 300, p: 1 },
            }}
          >
            <Typography variant="subtitle1" sx={{ px: 2, pt: 1, pb: 1, fontWeight: 500 }}>
              Giỏ hàng ({cartCount} sản phẩm)
            </Typography>
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <ListItem key={item.product_id} disableGutters>
                    <ListItemAvatar>
                      <Avatar variant="square" src={item.image_url} alt={item.product_name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {item.product_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          Giá: {item.variant_price} x {item.quantity}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  Giỏ hàng của bạn đang trống.
                </Typography>
              )}
            </List>
            <Box sx={{ textAlign: 'center', pt: 1 }}>
              <Typography
                component={Link}
                to="/cart"
                onClick={handlePopoverClose}
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Xem chi tiết giỏ hàng
              </Typography>
            </Box>
          </Popover>

          {user ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar
                  src={user.image ? user.image : undefined}
                  alt={user.full_name}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.full_name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu anchorEl={userAnchorEl} open={Boolean(userAnchorEl)} onClose={handleMenuClose}>
                <MenuList>
                  <MuiMenuItem disabled>
                    <Typography variant="body2">{user.full_name}</Typography>
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
              <MenuItem component={Link} to="/login">
                Đăng nhập
              </MenuItem>
              <MenuItem component={Link} to="/register">
                Đăng ký
              </MenuItem>
            </>
          )}
        </Box>
      </Toolbar>
      <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, pb: 1 }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Tìm kiếm sản phẩm…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </Box>
    </AppBar>
  )
}
