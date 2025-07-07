import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/hook'
import { PAGE_ROUTES } from '../../utils/constant'

const SectionHeader: React.FC = () => {
  return (
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
}

export const MainContent: React.FC = () => {
  const { items: products, loading, error } = useAppSelector((state) => state.product)

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
              <Link
                key={product.product_id}
                to={PAGE_ROUTES.PRODUCT_DETAIL.replace(':id', product.product_id.toString())}
                style={{ textDecoration: 'none' }}
              >
                <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                  <CardMedia
                    component="img"
                    image={product.image ?? 'https://via.placeholder.com/150'}
                    alt={product.product_name}
                    className="h-48 object-contain p-4 bg-white"
                  />
                  <CardContent className="flex-grow">
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h3"
                      className="font-medium"
                      color="text.primary"
                    >
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
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
