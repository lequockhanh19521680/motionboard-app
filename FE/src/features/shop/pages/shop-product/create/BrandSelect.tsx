import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { BrandResponse } from '../../../../../shared/types/response/BrandResponse'

interface BrandSelectProps {
  value: number | string // Accept both number and string!
  onChange: (event: SelectChangeEvent<number | string>) => void // Accept both!
  brands: BrandResponse[]
}

export function BrandSelect({ value, onChange, brands }: BrandSelectProps) {
  return (
    <FormControl fullWidth required size="small">
      <InputLabel id="brand-label">Thương hiệu</InputLabel>
      <Select
        labelId="brand-label"
        id="brand"
        value={value}
        label="Thương hiệu"
        onChange={onChange}
      >
        {brands.map((brand) => (
          <MenuItem key={brand.id} value={brand.id}>
            {brand.brandName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
