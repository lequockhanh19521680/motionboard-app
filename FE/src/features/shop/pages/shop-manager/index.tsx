import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hook'
import { fetchShops } from '../../../../redux/shopSlice'
import { ShopResponse } from '../../../../shared/types/response/ShopResponse'
import ShopMap from './ShopMap'

export default function ShopManagerPanel() {
  const dispatch = useAppDispatch()
  const shops = useAppSelector((state) => state.shop.shops)
  const isLoading = useAppSelector((state) => state.shop.loading)

  useEffect(() => {
    dispatch(fetchShops())
  }, [dispatch])

  const [hoveredShopId, setHoveredShopId] = useState<number | null>(null)
  const [focusedShop, setFocusedShop] = useState<ShopResponse | null>(null)

  const handleEdit = (shop: ShopResponse) => {
    alert(`Chỉnh sửa ${shop.shopName}`)
  }

  const handleView = (shop: ShopResponse) => {
    alert(`Xem chi tiết ${shop.shopName}`)
  }

  const handleDelete = () => {
    alert(`xóa`)
  }

  const handleAddressClick = (shop: ShopResponse) => {
    setFocusedShop(shop)
  }

  return (
    <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box' }}>
      {/* Bản đồ */}
      <ShopMap shops={shops} hoveredShopId={hoveredShopId} focusedShop={focusedShop} />

      {/* Tiêu đề và nút thêm */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Danh sách Shop
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            bgcolor: '#4f46e5',
            '&:hover': { bgcolor: '#4338ca' },
          }}
          onClick={() => alert('Mở modal tạo shop')}
        >
          Thêm Shop
        </Button>
      </Stack>

      {/* Bảng dữ liệu */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Tên Shop</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : shops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có shop nào.
                </TableCell>
              </TableRow>
            ) : (
              shops.map((shop) => (
                <TableRow
                  key={shop.id}
                  onMouseEnter={() => setHoveredShopId(shop.id)}
                  onMouseLeave={() => setHoveredShopId(null)}
                >
                  <TableCell>
                    <img
                      src={shop.image ?? '/default-shop.png'}
                      alt={shop.shopName}
                      style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </TableCell>

                  <TableCell>{shop.shopName}</TableCell>

                  <TableCell>
                    <span
                      style={{
                        color: '#2563eb',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleAddressClick(shop)}
                    >
                      {shop.addressLabel?.trim()
                        ? shop.addressLabel
                        : shop.latitude && shop.longitude
                          ? `(${shop.latitude.toFixed(4)}, ${shop.longitude.toFixed(4)})`
                          : 'Không rõ'}
                    </span>
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => handleView(shop)} color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(shop)} color="warning">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete()} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
