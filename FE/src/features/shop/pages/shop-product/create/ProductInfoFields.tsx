import { TextField } from '@mui/material'

interface ProductInfoFieldsProps {
  values: {
    productName: string
    description: string
    price: number
  }
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export function ProductInfoFields({ values, handleChange }: ProductInfoFieldsProps) {
  return (
    <>
      <TextField
        name="productName"
        label="Tên sản phẩm"
        value={values.productName}
        onChange={handleChange}
        required
        fullWidth
        size="small"
      />
      <TextField
        name="description"
        label="Mô tả chi tiết"
        value={values.description}
        onChange={handleChange}
        multiline
        minRows={3}
        fullWidth
        size="small"
        sx={{ bgcolor: '#f7fafc' }}
      />
      <TextField
        name="price"
        label="Giá sản phẩm"
        value={values.price}
        type="number"
        onChange={handleChange}
        required
        fullWidth
        size="small"
        inputProps={{ min: 0 }}
      />
    </>
  )
}
