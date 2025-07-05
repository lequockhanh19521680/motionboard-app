import { Button } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

export default function ProductActions() {
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
    >
      Thêm vào giỏ hàng
    </Button>
  )
}
