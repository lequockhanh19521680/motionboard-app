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
  useTheme,
  useMediaQuery,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useAppSelector } from '../../../redux/hook'
import { useDispatch } from 'react-redux'
import { updateCartItem, removeFromCart } from '../../../redux/cartSlice'
import { AppDispatch } from '../../../redux/store'
import { CartItemPreview, ShopCart } from '../../../shared/types/response/CartItemResponse'

export default function CartLayout() {
  const cart = useAppSelector((state) => state.cart.items) as ShopCart[]
  const dispatch = useDispatch<AppDispatch>()

  const [localQty, setLocalQty] = useState<Record<number, number>>({})
  const timeoutRefs = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setLocalQty((prev) => {
      const synced: Record<number, number> = { ...prev }
      for (const shop of cart) {
        for (const item of shop.items) {
          if (
            typeof synced[item.variantId] !== 'number' ||
            synced[item.variantId] === item.quantity
          ) {
            synced[item.variantId] = item.quantity
          }
        }
      }
      return synced
    })
  }, [cart])

  const handleChangeQuantity = (item: CartItemPreview, newQuantity: number) => {
    if (newQuantity < 1 || (item.stockQuantity && newQuantity > item.stockQuantity)) return

    setLocalQty((prev) => ({
      ...prev,
      [item.variantId]: newQuantity,
    }))

    if (timeoutRefs.current[item.variantId]) {
      clearTimeout(timeoutRefs.current[item.variantId])
    }
    timeoutRefs.current[item.variantId] = setTimeout(() => {
      dispatch(updateCartItem({ variantId: item.variantId, quantity: newQuantity }))
    }, 500)
  }

  // Xóa ngay trong store và sử dụng local state để giữ animation
  const handleRemove = (variantId: number, cartId: number) => {
    setRemovingIds((prev) => new Set(prev).add(cartId))

    // Xóa ngay trong store
    for (const shop of cart) {
      if (shop.items.some((item) => item.variantId === variantId)) {
        dispatch(removeFromCart({ shopId: shop.shopId, variantId }))
        break
      }
    }

    // Sau animation 1.5s, remove id khỏi removingIds để ẩn khỏi UI
    setTimeout(() => {
      setRemovingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(cartId)
        return newSet
      })
    }, 1500)
  }

  const getQty = (item: CartItemPreview) =>
    typeof localQty[item.variantId] === 'number' ? localQty[item.variantId] : item.quantity

  const total = cart.reduce(
    (sumShop, shop) =>
      sumShop +
      shop.items.reduce(
        (sumItem, item) => sumItem + Number(item.variantPrice) * getQty(item),
        0
      ),
    0
  )

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 3, p: { xs: 1, md: 2 } }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Giỏ hàng
      </Typography>

      {cart.length === 0 && (
        <Typography sx={{ textAlign: 'center', mt: 4 }} variant="body1" color="text.secondary">
          Giỏ hàng của bạn đang trống
        </Typography>
      )}

      {cart.map((shop) => (
        <Box key={shop.shopId} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            {shop.shopName}
          </Typography>
          {isMobile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {shop.items.map((item) => {
                const isRemoving = removingIds.has(item.cartId)
                return (
                  <Card
                    key={item.cartId}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      opacity: isRemoving ? 0 : 1,
                      maxHeight: isRemoving ? 0 : 'none',
                      overflow: 'hidden',
                      transition: 'opacity 1.5s ease, max-height 1.5s ease, transform 1.5s ease',
                      transform: isRemoving ? 'translateX(150%)' : 'translateX(0)',
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={item.imageUrl}
                      alt={item.productName}
                      sx={{ width: 56, height: 56, flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={600} noWrap>
                        {item.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.color} / {item.size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        SKU: {item.sku}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        textAlign: 'right',
                        minWidth: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography color="error" fontWeight={700} noWrap>
                        {Number(item.variantPrice).toLocaleString('vi-VN')}₫
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mt: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          disabled={getQty(item) <= 1 || isRemoving}
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
                            (typeof item.stockQuantity === 'number'
                              ? getQty(item) >= item.stockQuantity
                              : false) || isRemoving
                          }
                          onClick={() => handleChangeQuantity(item, getQty(item) + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography sx={{ fontWeight: 600, mt: 1 }} noWrap>
                        {(Number(item.variantPrice) * getQty(item)).toLocaleString('vi-VN')}₫
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => handleRemove(item.variantId, item.cartId)}
                      disabled={isRemoving}
                      aria-label="Xóa sản phẩm"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                )
              })}
            </Box>
          ) : (
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
                  {shop.items.map((item) => {
                    const isRemoving = removingIds.has(item.cartId)
                    return (
                      <TableRow
                        key={item.cartId}
                        sx={{
                          opacity: isRemoving ? 0 : 1,
                          transition: 'opacity 1.5s ease, transform 1.5s ease',
                          transform: isRemoving ? 'translateX(150%)' : 'translateX(0)',
                          height: isRemoving ? 0 : 'auto',
                          overflow: 'hidden',
                        }}
                      >
                        <TableCell>
                          <Avatar
                            variant="rounded"
                            src={item.imageUrl}
                            alt={item.productName}
                            sx={{ width: 56, height: 56 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600}>{item.productName}</Typography>
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
                            {Number(item.variantPrice).toLocaleString('vi-VN')}₫
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={getQty(item) <= 1 || isRemoving}
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
                                (typeof item.stockQuantity === 'number'
                                  ? getQty(item) >= item.stockQuantity
                                  : false) || isRemoving
                              }
                              onClick={() => handleChangeQuantity(item, getQty(item) + 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {(Number(item.variantPrice) * getQty(item)).toLocaleString('vi-VN')}₫
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleRemove(item.variantId, item.cartId)}
                            disabled={isRemoving}
                            aria-label="Xóa sản phẩm"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, mt: 2 }}>
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
