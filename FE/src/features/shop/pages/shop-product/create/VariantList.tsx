import React from 'react'
import { Stack, TextField, IconButton, Button, Typography, Box, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { ProductVariant } from '../../../../../shared/types/response/ProductResponse'

interface VariantListProps {
  variants: ProductVariant[]
  addVariant: () => void
  removeVariant: (idx: number) => void
  handleVariantChange: (idx: number, field: keyof ProductVariant, value: any) => void
}

export const VariantList: React.FC<VariantListProps> = ({
  variants,
  addVariant,
  removeVariant,
  handleVariantChange,
}) => (
  <Box>
    <Typography variant="subtitle1" color="primary.main" gutterBottom>
      Chọn Option
    </Typography>
    <Stack spacing={1} divider={<Divider flexItem />}>
      {variants.map((v, idx) => (
        <Stack
          key={idx}
          direction="row"
          alignItems="center"
          spacing={1}
          px={1}
          py={1}
          sx={{ bgcolor: '#fff', borderRadius: 2 }}
        >
          <Box sx={{ fontWeight: 600, minWidth: 32, color: '#1976d2' }}>#{idx + 1}</Box>
          <TextField
            placeholder="Màu sắc"
            value={v.color}
            size="small"
            onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
            sx={{ width: 90 }}
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            placeholder="Kích thước"
            value={v.size}
            size="small"
            onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
            sx={{ width: 90 }}
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            placeholder="Số lượng"
            type="number"
            value={v.stockQuantity}
            size="small"
            onChange={(e) => handleVariantChange(idx, 'stockQuantity', Number(e.target.value))}
            inputProps={{ min: 0 }}
            sx={{ width: 80 }}
          />
          <TextField
            placeholder="Giá"
            type="number"
            value={v.price}
            size="small"
            onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))}
            inputProps={{ min: 0 }}
            sx={{ width: 80 }}
          />
          <IconButton
            color="error"
            onClick={() => removeVariant(idx)}
            disabled={variants.length === 1}
            sx={{ ml: 0.5 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
    </Stack>
    <Button
      variant="outlined"
      onClick={addVariant}
      sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
    >
      Thêm biến thể
    </Button>
  </Box>
)
