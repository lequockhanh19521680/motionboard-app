import {
  Card,
  CardContent,
  Typography,
  Stack,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Rating,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { setFilters } from '../../redux/productSlice' // Import để cập nhật các bộ lọc
import { useAppSelector } from '../../redux/hook'
import { fetchCategories } from '../../redux/categorySlice'

export const Categories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { categories, error } = useAppSelector((state) => state.category)
  const filters = useAppSelector((state) => state.product.filters)

  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [searchCategory, setSearchCategory] = useState<string>('')

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleBrandChange = (brand: string) => {
    const updatedBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter((b) => b !== brand)
      : [...filters.selectedBrands, brand]

    dispatch(setFilters({ selectedBrands: updatedBrands }))
  }

  const handleRatingChange = (value: number | null) => {
    setSelectedRating(value)
    dispatch(setFilters({ selectedRating: value }))
  }

  const handlePriceChange = (newRange: number[]) => {
    dispatch(setFilters({ priceRange: newRange }))
  }

  const handleCategoryChange = (id: number) => {
    const updatedCategories = filters.selectedCategories.includes(id)
      ? filters.selectedCategories.filter((c) => c !== id)
      : [...filters.selectedCategories, id]

    dispatch(setFilters({ selectedCategories: updatedCategories })) // Cập nhật danh mục
  }

  return (
    <div className="md:col-span-1">
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" className="font-bold pb-3 border-b border-gray-200">
            Bộ lọc
          </Typography>

          {error ? (
            <Typography color="error" className="py-2">
              {error}
            </Typography>
          ) : (
            <Stack spacing={2}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="font-bold">Danh mục</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    placeholder="Tìm danh mục..."
                    size="small"
                    fullWidth
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="mb-2"
                  />
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    <FormGroup>
                      {categories
                        .filter((cat) =>
                          cat.name.toLowerCase().includes(searchCategory.toLowerCase())
                        )
                        .map((category) => (
                          <FormControlLabel
                            key={category.id}
                            control={
                              <Checkbox
                                checked={filters.selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)} // Cập nhật category
                              />
                            }
                            label={
                              <div className="flex justify-between items-center w-full">
                                <span>{category.name}</span>
                                {category.productCount > 0 && (
                                  <span
                                    style={{
                                      backgroundColor: '#f3f4f6', // Tailwind gray-100
                                      borderRadius: '9999px',
                                      padding: '2px 8px',
                                      fontSize: '0.75rem',
                                      color: '#374151', // Tailwind gray-700
                                      marginLeft: '0.5rem',
                                    }}
                                  >
                                    {category.productCount}
                                  </span>
                                )}
                              </div>
                            }
                          />
                        ))}
                    </FormGroup>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Giá */}
              <Divider className="!my-4" />
              <Typography variant="subtitle1" className="font-bold">
                Khoảng giá
              </Typography>
              <Slider
                value={filters.priceRange}
                min={0}
                max={20000000}
                step={500000}
                onChange={(_, value) => handlePriceChange(value as number[])} // Cập nhật dải giá
                valueLabelDisplay="auto"
              />

              {/* Thương hiệu */}
              <Divider className="!my-4" />
              <Typography variant="subtitle1" className="font-bold">
                Thương hiệu
              </Typography>
              <FormGroup>
                {['Apple', 'Samsung', 'Oppo', 'Xiaomi'].map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox
                        checked={filters.selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)} // Cập nhật thương hiệu
                      />
                    }
                    label={brand}
                  />
                ))}
              </FormGroup>

              {/* Đánh giá */}
              <Divider className="!my-4" />
              <Typography variant="subtitle1" className="font-bold">
                Đánh giá
              </Typography>
              <FormGroup>
                {[5, 4, 3].map((star) => (
                  <FormControlLabel
                    key={star}
                    control={
                      <Checkbox
                        checked={filters.selectedRating === star}
                        onChange={() => handleRatingChange(selectedRating === star ? null : star)} // Cập nhật rating
                      />
                    }
                    label={<Rating name="read-only" value={star} readOnly size="small" />}
                  />
                ))}
              </FormGroup>
            </Stack>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
