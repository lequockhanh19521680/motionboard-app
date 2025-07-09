import { Paper, Typography, Box } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ProductVariant } from '../../types/response/ProductResponse'

interface Props {
  variants: ProductVariant[]
  selectedVariant: number | undefined
  onSelect: (id: number) => void
}

export default function ProductVariants({ variants, selectedVariant, onSelect }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mt: 1,
        alignItems: 'stretch',
      }}
    >
      {variants
        .filter((v) => typeof v.variant_id === 'number') // Lọc các variant_id undefined/null
        .map((v) => (
          <Paper
            key={v.variant_id}
            elevation={selectedVariant === v.variant_id ? 8 : 1}
            sx={{
              p: 1,
              borderRadius: 3,
              minWidth: 180,
              flex: '1 0 180px',
              boxSizing: 'border-box',
              border: selectedVariant === v.variant_id ? '2px solid' : '1px solid #ccc',
              borderColor: selectedVariant === v.variant_id ? 'primary.main' : '#ccc',
              cursor: 'pointer',
              transition: '0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: selectedVariant === v.variant_id ? '#e3f2fd' : '#fff',
              '&:hover': { borderColor: 'primary.main' },
            }}
            onClick={() => onSelect(v.variant_id as number)}
          >
            <CheckCircleIcon color={selectedVariant === v.variant_id ? 'primary' : 'disabled'} />
            <Typography variant="body2" fontWeight="bold" noWrap>
              {v.color} | {v.size}
            </Typography>
            <Typography variant="body2" noWrap>
              {Number(v.price).toLocaleString()} VND
            </Typography>
          </Paper>
        ))}
    </Box>
  )
}
