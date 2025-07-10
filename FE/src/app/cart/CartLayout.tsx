import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  Avatar,
  Typography,
  IconButton,
  Divider,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useAppSelector } from '../../redux/hook'
import { useDispatch } from 'react-redux'
import { updateCartItem, removeFromCart } from '../../redux/cartSlice'
import { AppDispatch } from '../../redux/store'
import { CartItemPreview } from '../../shared/types/response/CartItemResponse'

export default function CartLayout() {
  const cart = useAppSelector((state) => state.cart.items)
  const dispatch = useDispatch<AppDispatch>()

  // Local state: số lượng dự kiến cho từng variant_id
  const [localQty, setLocalQty] = useState<Record<number, number>>({})
  const timeoutRefs = useRef<Record<number, ReturnType<typeof setTimeout>>>({})

  // Sync localQty khi store cart đổi: nếu local khác store thì cập nhật lại cho mượt
  useEffect(() => {
    setLocalQty((prev) => {
      const synced: Record<number, number> = { ...prev }
      for (const item of cart) {
        // Update nếu local chưa có hoặc đã khớp với store (tức là không phải đang sửa local)
        if (
          typeof synced[item.variant_id] !== 'number' ||
          synced[item.variant_id] === item.quantity
        ) {
          synced[item.variant_id] = item.quantity
        }
      }
      return synced
    })
  }, [cart])

  // Khi +/-, local cập nhật ngay, gửi PATCH sau ~500ms ngừng bấm
  const handleChangeQuantity = (item: CartItemPreview, newQuantity: number) => {
    if (newQuantity < 1 || (item.stock_quantity && newQuantity > item.stock_quantity)) return

    setLocalQty((prev) => ({
      ...prev,
      [item.variant_id]: newQuantity,
    }))

    // Nếu đang pending timeout -> clear
    if (timeoutRefs.current[item.variant_id]) {
      clearTimeout(timeoutRefs.current[item.variant_id])
    }
    // Debounce gửi PATCH
    timeoutRefs.current[item.variant_id] = setTimeout(() => {
      dispatch(updateCartItem({ variant_id: item.variant_id, quantity: newQuantity }))
      // Có thể fetch lại cart nếu muốn sync mạnh tay, nhưng thường không cần
    }, 500)
  }

  const handleRemove = (item: CartItemPreview) => {
    dispatch(removeFromCart(item.variant_id))
  }

  const getQty = (item: CartItemPreview) =>
    typeof localQty[item.variant_id] === 'number' ? localQty[item.variant_id] : item.quantity

  const total = cart.reduce((sum, item) => sum + Number(item.variant_price) * getQty(item), 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 3, p: { xs: 1, md: 2 } }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Giỏ hàng
      </Typography>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Màu/Size</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Đơn giá</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="right">Tạm tính</TableCell>
              <TableCell align="center">Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.cart_id}>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={item.image_url}
                    alt={item.product_name}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{item.product_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.color} / {item.size}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.sku}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="error" fontWeight={700}>
                    {Number(item.variant_price).toLocaleString('vi-VN')}₫
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={getQty(item) <= 1}
                      onClick={() => handleChangeQuantity(item, getQty(item) - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 1, minWidth: 24 }}>
                      {getQty(item)}
                    </Typography>
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={
                        typeof item.stock_quantity === 'number'
                          ? getQty(item) >= item.stock_quantity
                          : false
                      }
                      onClick={() => handleChangeQuantity(item, getQty(item) + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {(Number(item.variant_price) * getQty(item)).toLocaleString('vi-VN')}₫
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => handleRemove(item)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Tổng cộng:
        </Typography>
        <Typography variant="h5" color="primary" fontWeight={800}>
          {total.toLocaleString('vi-VN')}₫
        </Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" size="large" sx={{ px: 6, fontWeight: 700 }}>
          Thanh toán
        </Button>
      </Box>
    </Box>
  )
}
