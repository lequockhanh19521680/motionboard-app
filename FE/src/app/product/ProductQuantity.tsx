import { IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

interface Props {
  quantity: number
  setQuantity: (qty: number) => void
}

export default function ProductQuantity({ quantity, setQuantity }: Props) {
  return (
    <>
      <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} color="primary">
        <RemoveIcon />
      </IconButton>
      <Typography
        variant="h6"
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '1.25rem',
        }}
      >
        {quantity}
      </Typography>
      <IconButton onClick={() => setQuantity(quantity + 1)} color="primary">
        <AddIcon />
      </IconButton>
    </>
  )
}
