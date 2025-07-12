import { Button } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { addToCart, fetchCart } from '../../../redux/cartSlice'

interface ProductActionsProps {
  variantId: number
  quantity: number
}

export default function ProductActions({ variantId, quantity }: ProductActionsProps) {
  const dispatch = useDispatch<AppDispatch>()

  const handleAddToCart = async () => {
    const resultAction = await dispatch(addToCart({ variant_id: variantId, quantity }))
    if (addToCart.fulfilled.match(resultAction)) {
      dispatch(fetchCart())
    }
  }

  return (
    <Button
      variant="contained"
      startIcon={<ShoppingCartIcon />}
      sx={{
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: 3,
        py: 1.5,
        flex: 1,
      }}
      size="large"
      onClick={handleAddToCart}
    >
      Thêm vào giỏ hàng
    </Button>
  )
}
