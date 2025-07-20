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
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import StorefrontIcon from '@mui/icons-material/Storefront'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { useAppSelector } from '../../../redux/hook'
import { useDispatch } from 'react-redux'
import { updateCartItem, removeFromCart } from '../../../redux/cartSlice'
import { AppDispatch } from '../../../redux/store'
import { CartItemPreview, ShopCart } from '../../../shared/types/response/CartItemResponse'
import AddressInput from './AddressInput'
import ShopNoteInput from './ShopNoteInput'
import { createOrder } from '../../../redux/orderSlice'
import { OrderRequest } from '../../../shared/types/request/OrderRequest'
import NotificationDialog from '../../../shared/components/feedback/NotificationDialog'

type ErrorsType = {
  address?: string
  [key: string]: string | undefined
}

export default function CartLayout() {
  const cart = useAppSelector((state) => state.cart.items) as ShopCart[]
  const { loading: cartLoading } = useAppSelector((state) => state.cart)
  const { loading: ordersLoading } = useAppSelector((state) => state.order)
  const dispatch = useDispatch<AppDispatch>()

  const [address, setAddress] = useState('')
  const [shopNotes, setShopNotes] = useState<Record<number, string>>({})
  const [errors, setErrors] = useState<ErrorsType>({})
  const addressRef = useRef<HTMLInputElement | null>(null)
  const noteRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const [localQty, setLocalQty] = useState<Record<number, number>>({})
  const timeoutRefs = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())

  const [dialog, setDialog] = useState<{
    open: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    open: false,
    type: 'success',
    title: '',
    message: '',
  })

  const [isBtnLoading, setIsBtnLoading] = useState(false)

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

  const validate = () => {
    const newErrors: ErrorsType = {}
    if (!address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ nhận hàng.'
    return newErrors
  }

  const handleAddressChange = (val: string) => {
    setAddress(val)
    setErrors((prev) => ({ ...prev, address: undefined }))
  }
  const handleShopNoteChange = (shopId: number, note: string) => {
    setShopNotes((prev) => ({ ...prev, [shopId]: note }))
    setErrors((prev) => {
      const { [`note_${shopId}`]: _, ...rest } = prev
      return rest
    })
  }
  const handleClearShopNote = (shopId: number) => {
    setShopNotes((prev) => ({ ...prev, [shopId]: '' }))
    setErrors((prev) => {
      const { [`note_${shopId}`]: _, ...rest } = prev
      return rest
    })
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBtnLoading(true)
    const newErrors = validate()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setIsBtnLoading(false)
      if (newErrors.address && addressRef.current) addressRef.current.focus()
      else {
        const firstNoteKey = Object.keys(newErrors).find(
          (k) => k.startsWith('note_') && noteRefs.current[parseInt(k.split('_')[1])]
        )
        const noteIndex = firstNoteKey ? parseInt(firstNoteKey.split('_')[1]) : -1
        noteRefs.current[noteIndex]?.focus()
      }
      return
    }

    const orderData: OrderRequest[] = cart.map((shop) => ({
      shopId: shop.shopId,
      shopName: shop.shopName,
      address,
      shopNote: shopNotes[shop.shopId] || '',
      items: shop.items.map((item) => ({
        cartId: item.cartId,
        variantId: item.variantId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        variantPrice: item.variantPrice,
        imageUrl: item.imageUrl,
        color: item.color,
        size: item.size,
        sku: item.sku,
        brandId: item.brandId,
        stockQuantity: item.stockQuantity,
      })),
    }))

    try {
      const result = await dispatch(createOrder(orderData))
      if (!createOrder.fulfilled.match(result)) {
        throw new Error('Đặt hàng thất bại, vui lòng thử lại.')
      }
      const removeTasks = orderData.flatMap((shop) =>
        shop.items.map((item) =>
          dispatch(removeFromCart({ shopId: shop.shopId, variantId: item.variantId }))
        )
      )
      await Promise.all(removeTasks)

      setDialog({
        open: true,
        type: 'success',
        title: 'Đặt hàng thành công',
        message: 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý!',
      })

      setAddress('')
      setShopNotes({})
    } catch (err) {
      setDialog({
        open: true,
        type: 'error',
        title: 'Lỗi khi đặt hàng',
        message: (err as Error).message || 'Có lỗi xảy ra, vui lòng thử lại.',
      })
    } finally {
      setIsBtnLoading(false)
    }
  }

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

  const handleRemove = (variantId: number, cartId: number) => {
    setRemovingIds((prev) => new Set(prev).add(cartId))
    for (const shop of cart) {
      if (shop.items.some((item) => item.variantId === variantId)) {
        dispatch(removeFromCart({ shopId: shop.shopId, variantId }))
        break
      }
    }
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
      shop.items.reduce((sumItem, item) => sumItem + Number(item.variantPrice) * getQty(item), 0),
    0
  )

  return (
    <React.Fragment>
      <NotificationDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        autoClose
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        onAfterClose={() => {
          if (dialog.type === 'success') {
            setTimeout(() => {
              window.location.href = '/home'
            }, 800)
          }
        }}
      />

      {cart.length === 0 ? (
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              borderRadius: '50%',
              width: { xs: 84, md: 104 },
              height: { xs: 84, md: 104 },
            }}
          >
            <ShoppingCartOutlinedIcon
              sx={{ color: 'primary.main', fontSize: { xs: 48, md: 62 } }}
            />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Giỏ hàng của bạn đang trống!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Bạn chưa thêm sản phẩm nào vào giỏ hàng.
            <br />
            Hãy khám phá ngay để chọn món yêu thích nhé!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 700, px: 4, borderRadius: 3 }}
            href="/products"
          >
            Khám phá sản phẩm
          </Button>
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleCheckout}
          sx={{ maxWidth: 900, mx: 'auto', mt: 3, p: { xs: 1, md: 2 }, position: 'relative' }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3, letterSpacing: 1 }}>
            Giỏ hàng
          </Typography>

          <AddressInput
            value={address}
            error={errors.address}
            onChange={handleAddressChange}
            inputRef={addressRef}
          />

          {cart.map((shop) => (
            <Box
              key={shop.shopId}
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: '0 2px 8px 0 rgba(30,32,44,0.04), 0 1px 3px 0 rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.grey[200]}`,
                background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#fff',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background: theme.palette.grey[100],
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.grey[200]}`,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
                  }}
                >
                  <StorefrontIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" fontWeight={600} letterSpacing={0.2} sx={{ fontSize: 18 }}>
                  {shop.shopName}
                </Typography>
              </Box>

              <ShopNoteInput
                value={shopNotes[shop.shopId] || ''}
                shopId={shop.shopId}
                error={errors[`note_${shop.shopId}`]}
                onChange={handleShopNoteChange}
                onClear={handleClearShopNote}
                inputRef={(el) => {
                  noteRefs.current[shop.shopId] = el
                }}
              />

              <Box sx={{ p: { xs: 1, md: 2 } }}>
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
                            transition:
                              'opacity 1.5s ease, max-height 1.5s ease, transform 1.5s ease',
                            transform: isRemoving ? 'translateX(150%)' : 'translateX(0)',
                            background: theme.palette.background.paper,
                            boxShadow: '0 1.5px 8px 0 rgba(31,32,40,0.06)',
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
                                  typeof item.stockQuantity === 'number'
                                    ? getQty(item) >= item.stockQuantity
                                    : false || isRemoving
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
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 3,
                      background: theme.palette.grey[50],
                      boxShadow: 'none',
                      border: 'none',
                    }}
                  >
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
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
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
                                      typeof item.stockQuantity === 'number'
                                        ? getQty(item) >= item.stockQuantity
                                        : false || isRemoving
                                    }
                                    onClick={() => handleChangeQuantity(item, getQty(item) + 1)}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>
                                {(Number(item.variantPrice) * getQty(item)).toLocaleString('vi-VN')}
                                ₫
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
            </Box>
          ))}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 3,
              mt: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Tổng cộng:
            </Typography>
            <Typography variant="h5" color="primary" fontWeight={800}>
              {total.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 6, fontWeight: 700 }}
              type="submit"
              disabled={isBtnLoading}
              startIcon={
                isBtnLoading ? <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} /> : null
              }
            >
              {isBtnLoading ? 'Đang xử lý...' : 'Thanh toán'}
            </Button>
          </Box>
        </Box>
      )}
    </React.Fragment>
  )
}
