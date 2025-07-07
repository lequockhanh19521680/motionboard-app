import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import { styled, alpha } from '@mui/material/styles'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SearchIcon from '@mui/icons-material/Search'
import { Link } from 'react-router-dom'
import { PAGE_ROUTES } from '../utils/constant'

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

        {/* SEARCH BAR */}
        <Search sx={{ display: { xs: 'none', md: 'flex' } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Tìm kiếm sản phẩm…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        {/* ACTION BUTTONS (always right aligned) */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <IconButton color="inherit" component={Link} to="/cart" size="large">
            <Badge badgeContent={2} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <MenuItem component={Link} to="/login">
            Đăng nhập
          </MenuItem>
          <MenuItem component={Link} to="/register">
            Đăng ký
          </MenuItem>
        </Box>
      </Toolbar>

      {/* SEARCH BAR FOR MOBILE BELOW TOOLBAR */}
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
