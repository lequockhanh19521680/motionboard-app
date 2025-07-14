import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Skeleton,
  Tooltip,
  Chip,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import BusinessIcon from '@mui/icons-material/Business'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../redux/hook'
import { PAGE_ROUTES } from '../../../shared/constants'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { fetchProducts } from '../../../redux/productSlice'

const SectionHeader: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 4,
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }}
  >
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'primary.main',
        }}
      >
        <StarBorderOutlinedIcon color="primary" />
        Sản phẩm nổi bật
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
        Khám phá những sản phẩm hot nhất tháng này
      </Typography>
    </Box>
    <Box
      sx={{
        height: 4,
        width: 100,
        background: 'linear-gradient(to right, #3b82f6, #9333ea)',
        borderRadius: 2,
        mt: { xs: 2, md: 0 },
      }}
    />
  </Box>
)

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const [hovered, setHovered] = useState(false)

  // Image logic
  const images =
    Array.isArray(product.images) && product.images.length > 0 ? product.images : []
  const mainImage =
    images[0]?.imageUrl ||
    'https://data.webnhiepanh.com/wp-content/uploads/2020/11/21105453/phong-canh-1.jpg'
  const hoverImage = images[1]?.imageUrl || mainImage
  const canHover = images.length > 1 && hoverImage !== mainImage

  const rating = product.rating || 4.8
  const promotion = product.promotion || null

  const categoryText = product.categoryName || 'Không xác định'
  const brandText = product.brandName

  return (
    <Link
      to={
        product.productId !== undefined && product.productId !== null
          ? PAGE_ROUTES.PRODUCT_DETAIL.replace(':id', product.productId.toString())
          : '#'
      }
      style={{ textDecoration: 'none' }}
      tabIndex={-1}
    >
      <Card
        elevation={hovered ? 8 : 1}
        sx={{
          height: '100%',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 6px 32px 0 rgba(36,37,47,0.17)'
            : '0 1px 10px 0 rgba(36,37,47,0.06)',
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          flexGrow: 1,
          transition: 'box-shadow 0.25s, background 0.22s',
          bgcolor: hovered ? 'grey.50' : 'background.paper',
        }}
        onMouseEnter={() => canHover && setHovered(true)}
        onMouseLeave={() => canHover && setHovered(false)}
      >
        {/* Hình ảnh */}
        <Box
          sx={{
            width: '100%',
            height: 220,
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#fff',
          }}
        >
          {/* Always show main image */}
          <CardMedia
            component="img"
            image={mainImage}
            alt={product.productName}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              transition: 'opacity 0.32s',
              opacity: canHover && hovered ? 0 : 1,
            }}
          />
          {/* Only overlay hover image if more than 1 image and not same as main */}
          {canHover && (
            <CardMedia
              component="img"
              image={hoverImage}
              alt={product.productName}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 2,
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.32s',
              }}
            />
          )}
          {promotion && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bgcolor: 'error.main',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderBottomRightRadius: 16,
                fontSize: 13,
                fontWeight: 700,
                zIndex: 5,
              }}
            >
              {promotion}
            </Box>
          )}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: hovered ? 'flex' : 'none',
              flexDirection: 'column',
              gap: 1,
              zIndex: 6,
            }}
          >
            <IconButton
              size="small"
              sx={{ bgcolor: 'white', mb: 1, '&:hover': { bgcolor: 'grey.200' } }}
            >
              <FavoriteBorderIcon fontSize="small" color="error" />
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.200' } }}>
              <ShoppingCartIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
        </Box>

        {/* Nội dung chính */}
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            py: 2,
            px: 2,
            flexGrow: 1,
            minHeight: 220,
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="h3"
            color="text.primary"
            noWrap
            sx={{ mb: 1 }}
          >
            {product.productName}
          </Typography>

          {/* Chip category luôn hiện */}
          <Tooltip title={`Danh mục: ${categoryText}`} arrow>
            <Chip
              icon={<LabelOutlinedIcon />}
              label={categoryText}
              color="primary"
              variant="filled"
              sx={{
                fontWeight: 700,
                textTransform: 'capitalize',
                mb: 1,
                width: 'fit-content',
              }}
              size="small"
            />
          </Tooltip>

          {/* Chip brand chỉ hiện nếu có */}
          {brandText && (
            <Tooltip title={`Thương hiệu: ${brandText}`} arrow>
              <Chip
                icon={<BusinessIcon />}
                label={brandText}
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  mb: 1,
                  width: 'fit-content',
                }}
                size="small"
              />
            </Tooltip>
          )}

          {/* Phần rating và HOT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <StarIcon sx={{ color: 'orange', fontSize: 18 }} />
            <Typography variant="body2" fontWeight={500}>
              {rating.toFixed(1)}
            </Typography>
            {(product.is_hot || product.top_seller) && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  fontSize: 13,
                  px: 1.1,
                  py: 0.2,
                  bgcolor: 'primary.light',
                  color: 'primary.dark',
                  borderRadius: 1,
                  fontWeight: 700,
                }}
              >
                HOT
              </Box>
            )}
          </Box>

          {/* Giá tiền */}
          <Typography variant="h6" color="error" sx={{ fontWeight: 700, mb: 1 }}>
            {Number(product.price).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
}

export const MainContent: React.FC = () => {
  const { items: products, loading, error, filters } = useAppSelector((state) => state.product)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  const skeletons = Array.from({ length: 6 }, (_, i) => (
    <Card key={i} sx={{ borderRadius: 4, p: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={180} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={28} />
    </Card>
  ))

  return (
    <div className="md:col-span-3 relative">
      <SectionHeader />
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : products.length === 0 && !loading ? (
        <Typography>Không có sản phẩm nào.</Typography>
      ) : (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {skeletons}
              </div>
            </div>
          )}
          <div
            className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
              loading ? 'opacity-60 pointer-events-none' : 'opacity-100'
            }`}
            style={{ minHeight: '500px' }}
          >
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MainContent
