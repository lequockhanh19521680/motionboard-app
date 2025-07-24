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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useState } from 'react'

type Shop = {
  id: string
  name: string
  productsCount: number
  ordersCount: number
  status: 'active' | 'inactive'
}

export default function ShopManagerPanel() {
  const [shops, setShops] = useState<Shop[]>([
    {
      id: '1',
      name: 'Shop Thời Trang',
      productsCount: 24,
      ordersCount: 120,
      status: 'active',
    },
    {
      id: '2',
      name: 'Shop Đồ Da',
      productsCount: 12,
      ordersCount: 58,
      status: 'inactive',
    },
  ])

  const handleEdit = (shop: Shop) => {
    alert(`Chỉnh sửa ${shop.name}`)
  }

  const handleDelete = (shop: Shop) => {
    if (confirm(`Bạn có chắc muốn xoá ${shop.name}?`)) {
      setShops((prev) => prev.filter((s) => s.id !== shop.id))
    }
  }

  const handleView = (shop: Shop) => {
    alert(`Xem chi tiết ${shop.name}`)
    // Có thể điều hướng router ở đây
  }

  return (
    <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box' }}>
      {/* Header */}
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

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell>Tên Shop</TableCell>
              <TableCell align="center">Sản phẩm</TableCell>
              <TableCell align="center">Đơn hàng</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell>{shop.name}</TableCell>
                <TableCell align="center">{shop.productsCount}</TableCell>
                <TableCell align="center">{shop.ordersCount}</TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={shop.status === 'active' ? 'green' : 'gray'}
                  >
                    {shop.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" onClick={() => handleView(shop)} color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(shop)} color="warning">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(shop)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {shops.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có shop nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
