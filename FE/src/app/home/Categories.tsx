import {
  Card,
  CardContent,
  Typography,
  Stack,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Chip,
  Box,
  InputBase,
  RadioGroup,
  Radio,
  Rating,
  Switch,
  FormControl,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import StarIcon from '@mui/icons-material/Star'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { setFilters } from '../../redux/productSlice'
import { useAppSelector } from '../../redux/hook'
import { fetchCategories } from '../../redux/categorySlice'
import { fetchBrands } from '../../redux/brandSlice'

export const Categories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { categories, error: catError } = useAppSelector((state) => state.category)
  const { brands, error: brandsError } = useAppSelector((state) => state.brand)
  const filters = useAppSelector((state) => state.product.filters)

  const [searchCategory, setSearchCategory] = useState('')
  const [searchBrand, setSearchBrand] = useState('')
  const [enableRating, setEnableRating] = useState(!!filters.rating)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchBrands())
  }, [dispatch])

  // Giá
  const handlePriceChange = (newRange: number[]) => {
    dispatch(
      setFilters({
        price_min: newRange[0],
        price_max: newRange[1],
      })
    )
  }

  // Danh mục
  const handleCategoryChange = (id: number) => {
    const prev = filters.category_ids ?? []
    const updated = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    dispatch(setFilters({ category_ids: updated }))
  }

  // Brand chip click
  const handleBrandChipClick = (brand_id?: number) => {
    if (brand_id === undefined) {
      dispatch(setFilters({ brand_id: undefined }))
    } else {
      dispatch(setFilters({ brand_id: [brand_id] }))
    }
  }

  // Rating lọc
  const handleRatingChange = (value?: number) => {
    dispatch(setFilters({ rating: value }))
  }

  // Toggle rating filter
  const handleToggleRatingFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnableRating(event.target.checked)
    if (!event.target.checked) {
      dispatch(setFilters({ rating: undefined }))
    } else {
      // Nếu bật lại mà chưa có rating, mặc định là 5
      if (!filters.rating) dispatch(setFilters({ rating: 5 }))
    }
  }

  const RATINGS = [5, 4, 3]

  return (
    <div className="md:col-span-1">
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, pb: 2, borderBottom: '1px solid #eee' }}>
            Bộ lọc
          </Typography>
          {catError || brandsError ? (
            <Typography color="error" sx={{ py: 2 }}>
              {catError || brandsError}
            </Typography>
          ) : (
            <Stack spacing={2}>
              {/* Danh mục */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Danh mục</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    placeholder="Tìm danh mục..."
                    size="small"
                    fullWidth
                    onChange={(e) => setSearchCategory(e.target.value)}
                    sx={{ mb: 2 }}
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
                                checked={(filters.category_ids ?? []).includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                              />
                            }
                            label={
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}
                              >
                                <span>{category.name}</span>
                                {category.productCount > 0 && (
                                  <span
                                    style={{
                                      backgroundColor: '#f3f4f6',
                                      borderRadius: '9999px',
                                      padding: '2px 8px',
                                      fontSize: '0.75rem',
                                      color: '#374151',
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
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Khoảng giá</Typography>
              <Slider
                value={[filters.price_min ?? 0, filters.price_max ?? 20000000]}
                min={0}
                max={20000000}
                step={500000}
                onChange={(_, value) => handlePriceChange(value as number[])}
                valueLabelDisplay="auto"
              />

              {/* Thương hiệu (Chips) */}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle1">Thương hiệu</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1, gap: 1 }}>
                  <SearchIcon sx={{ color: 'text.disabled', fontSize: 20, ml: 1, mr: 0.5 }} />
                  <InputBase
                    placeholder="Tìm thương hiệu..."
                    size="small"
                    sx={{
                      flex: 1,
                      bgcolor: '#f5f6fa',
                      px: 1,
                      borderRadius: 2,
                      fontSize: 15,
                      border: '1px solid #e0e7ef',
                      height: 32,
                    }}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    value={searchBrand}
                  />
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label="Tất cả thương hiệu"
                    icon={<StarIcon />}
                    color={!filters.brand_id || !filters.brand_id.length ? 'primary' : 'default'}
                    variant={!filters.brand_id || !filters.brand_id.length ? 'filled' : 'outlined'}
                    clickable
                    onClick={() => handleBrandChipClick(undefined)}
                    sx={{ mb: 1, fontWeight: 500 }}
                  />
                  {(brands || [])
                    .filter((brand) =>
                      brand.brand_name.toLowerCase().includes(searchBrand.toLowerCase())
                    )
                    .map((brand) => (
                      <Chip
                        key={brand.brand_id}
                        label={brand.brand_name}
                        color={
                          filters.brand_id && filters.brand_id.includes(brand.brand_id)
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          filters.brand_id && filters.brand_id.includes(brand.brand_id)
                            ? 'filled'
                            : 'outlined'
                        }
                        clickable
                        onClick={() => handleBrandChipClick(brand.brand_id)}
                        sx={{
                          mb: 1,
                          fontWeight: 500,
                          bgcolor:
                            filters.brand_id && filters.brand_id.includes(brand.brand_id)
                              ? 'primary.light'
                              : '#f3f6fa',
                          color:
                            filters.brand_id && filters.brand_id.includes(brand.brand_id)
                              ? '#1976d2'
                              : undefined,
                        }}
                      />
                    ))}
                </Stack>
              </Box>

              {/* Đánh giá - Sang tạo: Bật tắt filter */}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                  <Typography variant="subtitle1" sx={{ mb: 0 }}>
                    Đánh giá
                  </Typography>
                  <FormControlLabel
                    label={enableRating ? 'Lọc theo đánh giá' : 'Bỏ lọc'}
                    control={
                      <Switch
                        checked={enableRating}
                        onChange={handleToggleRatingFilter}
                        color="primary"
                        size="small"
                      />
                    }
                    sx={{
                      m: 0,
                      '.MuiTypography-root': {
                        fontSize: 14,
                        fontWeight: 500,
                        color: enableRating ? 'primary.main' : 'grey.600',
                      },
                    }}
                  />
                </Box>
                {enableRating && (
                  <FormControl component="fieldset" size="small" sx={{ mt: 0.5 }}>
                    <RadioGroup
                      row
                      value={filters.rating ?? RATINGS[0]}
                      onChange={(_, value) => handleRatingChange(value ? Number(value) : undefined)}
                      sx={{ gap: 1 }}
                    >
                      {RATINGS.map((star) => (
                        <FormControlLabel
                          key={star}
                          value={star}
                          control={<Radio size="small" color="warning" />}
                          label={
                            <Stack direction="row" alignItems="center" spacing={0.2}>
                              <Rating value={star} readOnly size="small" max={5} />
                              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                                trở lên
                              </Typography>
                            </Stack>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
