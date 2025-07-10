import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { CategoryResponse } from '../../../../../shared/types/response/CategoryResponse'

interface CategorySelectProps {
  value: number
  onChange: (event: SelectChangeEvent<number>) => void
  categories: CategoryResponse[]
}

export function CategorySelect({ value, onChange, categories }: CategorySelectProps) {
  return (
    <FormControl fullWidth required size="small">
      <InputLabel id="category-label">Danh mục</InputLabel>
      <Select
        labelId="category-label"
        id="category"
        value={value}
        label="Danh mục"
        onChange={onChange}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
