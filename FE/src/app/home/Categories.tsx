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
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { useEffect, useState } from 'react'
import { fetchCategories } from '../../redux/categorySlice'
import { fetchProducts } from '../../redux/productSlice'

export const Categories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { categories, error } = useSelector((state: RootState) => state.category)

  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [searchCategory, setSearchCategory] = useState<string>('')

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const handleRatingChange = (value: number | null) => {
    setSelectedRating(value)
  }

  const handleCategoryChange = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    dispatch(
      fetchProducts({
        price_min: priceRange[0],
        price_max: priceRange[1],
        category_ids: selectedCategories.length ? selectedCategories : [],
        brand: selectedBrands.length ? selectedBrands : undefined,
        rating: selectedRating ?? undefined,
      })
    )
  }, [priceRange, selectedCategories, selectedBrands, selectedRating, dispatch])

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
              {/* category section */}
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
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
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

              {/* Price filter */}
              <Divider className="!my-4" />
              <Typography variant="subtitle1" className="font-bold">
                Khoảng giá
              </Typography>
              <Slider
                value={priceRange}
                min={0}
                max={20000000}
                step={500000}
                onChange={(_, value) => setPriceRange(value as number[])}
                valueLabelDisplay="auto"
              />

              {/* Brand filter */}
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
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                    }
                    label={brand}
                  />
                ))}
              </FormGroup>

              {/* Rating filter */}
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
                        checked={selectedRating === star}
                        onChange={() => handleRatingChange(selectedRating === star ? null : star)}
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
