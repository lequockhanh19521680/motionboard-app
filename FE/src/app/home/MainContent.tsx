import React, { useState, useEffect } from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/hook'
import { PAGE_ROUTES } from '../../utils/constant'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { fetchProducts } from '../../redux/productSlice'

const SectionHeader: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 4,
      position: 'relative',
      justifyContent: 'space-between',
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
      }}
    />
  </Box>
)

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const [hovered, setHovered] = useState(false)

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : []
  const mainImage =
    images[0]?.image_url ||
    'https://data.webnhiepanh.com/wp-content/uploads/2020/11/21105453/phong-canh-1.jpg'
  const hoverImage = images[1]?.image_url || mainImage

  return (
    <Link
      to={PAGE_ROUTES.PRODUCT_DETAIL.replace(':id', product.product_id.toString())}
      style={{ textDecoration: 'none' }}
    >
      <Card
        className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{ cursor: 'pointer', position: 'relative' }}
      >
        {/* Image box with increased height and intelligent fade effect */}
        <Box sx={{ width: '100%', height: 260, position: 'relative', overflow: 'hidden' }}>
          {/* Main Image */}
          <CardMedia
            component="img"
            image={mainImage}
            alt={product.product_name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              opacity: hovered ? 0 : 1,
              transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1)',
              background: '#fff',
              p: 2,
            }}
          />
          {/* Hover Image (if exists) */}
          {images.length > 1 && (
            <CardMedia
              component="img"
              image={hoverImage}
              alt={product.product_name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 2,
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1)',
                background: '#fff',
                p: 2,
              }}
            />
          )}
          {images.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                px: 1,
                py: '1px',
                borderRadius: 1,
                fontSize: 14,
                zIndex: 3,
              }}
            >
              {images.length} ảnh
            </Box>
          )}
        </Box>
        <CardContent className="flex-grow">
          <Typography gutterBottom variant="h6" component="h3" color="text.primary">
            {product.product_name}
          </Typography>
          <Typography variant="h6" color="error" className="font-bold my-2">
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

// MainContent bảng sản phẩm
export const MainContent: React.FC = () => {
  const { items: products, loading, error, filters } = useAppSelector((state) => state.product)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  return (
    <div className="md:col-span-3 relative">
      <SectionHeader />

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : products.length === 0 ? (
        <Typography>Không có sản phẩm nào.</Typography>
      ) : (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10 rounded">
              <Typography className="text-gray-600">Đang tải sản phẩm...</Typography>
            </div>
          )}

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
              loading ? 'opacity-50 pointer-events-none' : 'opacity-100'
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MainContent
