import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Avatar from '@mui/material/Avatar'
import { styled, alpha } from '@mui/material/styles'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link, useNavigate } from 'react-router-dom'
import { PAGE_ROUTES } from '../../constants'
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
import { fetchCart, removeFromCart } from '../../../redux/cartSlice'
import { useAppSelector } from '../../../redux/hook'
import { CartItemPreview } from '../../types/response/CartItemResponse'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

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

  // Khi user login thì fetch cart
  useEffect(() => {
    if (user) dispatch(fetchCart())
  }, [dispatch, user])

  // Cart icon scale effect khi đổi số lượng
  const [animateCart, setAnimateCart] = useState(false)
  const prevCartCount = useRef(cartCount)
  useEffect(() => {
    if (prevCartCount.current !== cartCount) {
      setAnimateCart(true)
      const timer = setTimeout(() => setAnimateCart(false), 180)
      prevCartCount.current = cartCount
      return () => clearTimeout(timer)
    }
  }, [cartCount])

  // Popover cart
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const handlePopoverToggle = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(anchorEl ? null : event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)

  // User menu state
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setUserAnchorEl(e.currentTarget)
  const handleMenuClose = () => setUserAnchorEl(null)
  const handleLogout = () => {
    dispatch(logout())
    handleMenuClose()
    navigate('/login')
  }

  // Xoá sản phẩm trong Popover
  const [pendingRemove, setPendingRemove] = useState(false)
  const handleRemoveCartItem = (variantId: number) => {
    setPendingRemove(true)
    dispatch(removeFromCart(variantId))
  }
  useEffect(() => {
    if (pendingRemove && !cartLoading) {
      dispatch(fetchCart())
      setPendingRemove(false)
    }
  }, [pendingRemove, cartLoading, dispatch])

  const totalPrice =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (total, item) => total + Number(item.variantPrice) * Number(item.quantity),
          0
        )
      : 0

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
          {/* Cart Popover */}
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
              sx: { minWidth: 340, maxWidth: 380, p: 1, borderRadius: 3, boxShadow: 6 },
            }}
          >
            <Typography variant="subtitle1" sx={{ px: 2, pt: 1, fontWeight: 600 }}>
              Giỏ hàng ({cartItems.length} sản phẩm)
            </Typography>
            <Divider sx={{ mb: 1, mt: 1 }} />
            <Box
              sx={{
                minHeight: 90,
                maxHeight: 330,
                overflowY: 'auto',
                pr: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <AnimatePresence initial={false}>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.variantId}
                      initial={{ x: 80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 80, opacity: 0 }}
                      transition={{ duration: 0.17, ease: 'easeOut' }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                          p: 1.2,
                          position: 'relative',
                          '&:hover': { boxShadow: '0 4px 18px rgba(50,50,150,0.17)' },
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          src={item.imageUrl}
                          alt={item.productName}
                          sx={{
                            width: 52,
                            height: 52,
                            mr: 2,
                            flexShrink: 0,
                            borderRadius: 2,
                            bgcolor: '#f4f6fa',
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {item.productName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.7 }}>
                            <Typography variant="body2" color="primary.main" fontWeight={700}>
                              {Number(item.variantPrice).toLocaleString()}₫
                            </Typography>
                            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                              x {item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          edge="end"
                          size="small"
                          style={{ marginLeft: 8 }}
                          sx={{
                            color: 'text.disabled',
                            '&:hover': { color: 'error.main', bgcolor: 'transparent' },
                          }}
                          onClick={() => handleRemoveCartItem(item.variantId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Box sx={{ textAlign: 'center', color: 'text.disabled', py: 3 }}>
                      <ShoppingCartIcon sx={{ fontSize: 38, mb: 1 }} />
                      <Typography variant="body2">Giỏ hàng của bạn đang trống.</Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="body2"
              sx={{ px: 2, textAlign: 'right', fontWeight: 600, mb: 0.5, color: 'text.primary' }}
            >
              Tạm tính: {totalPrice.toLocaleString()}₫
            </Typography>
            <Box sx={{ textAlign: 'center', pt: 0.5 }}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/cart"
                onClick={handlePopoverClose}
                sx={{
                  borderRadius: 7,
                  px: 4,
                  mt: 0.5,
                  fontWeight: 700,
                  boxShadow: 'none',
                  letterSpacing: 1,
                }}
              >
                Xem chi tiết giỏ hàng
              </Button>
            </Box>
          </Popover>
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
