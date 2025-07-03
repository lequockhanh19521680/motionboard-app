import { Button, Card, CardContent, CardMedia, Paper, Typography } from '@mui/material'

export const MainContent: React.FC = () => {
  // Dummy data for products
  const products = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      price: '25.990.000đ',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S22',
      price: '21.990.000đ',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'MacBook Pro M1',
      price: '42.990.000đ',
      image: 'https://via.placeholder.com/150',
    },
    { id: 4, name: 'AirPods Pro', price: '5.990.000đ', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'iPad Air', price: '15.990.000đ', image: 'https://via.placeholder.com/150' },
    {
      id: 6,
      name: 'Apple Watch Series 7',
      price: '12.990.000đ',
      image: 'https://via.placeholder.com/150',
    },
  ]

  return (
    <div className="md:col-span-3">
      <Paper
        elevation={3}
        className="p-8 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
      >
        <Typography variant="h4" component="h2" className="font-bold mb-4">
          Siêu sale tháng 10
        </Typography>
        <Typography variant="h6" className="mb-6">
          Giảm giá lên đến 50%
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2563eb', // Tailwind blue-600
            color: '#fff', // chữ trắng
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#1d4ed8', // Tailwind blue-700
            },
          }}
        >
          Mua ngay
        </Button>
      </Paper>

      {/* Products */}
      <div>
        <Typography variant="h6" className="font-bold mb-6">
          Sản phẩm nổi bật
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300"
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                className="h-48 object-contain p-4"
              />
              <CardContent className="flex-grow">
                <Typography gutterBottom variant="h6" component="h3" className="font-medium">
                  {product.name}
                </Typography>
                <Typography variant="h6" color="error" className="font-bold my-2">
                  {product.price}
                </Typography>
              </CardContent>
              <div className="p-4">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#2563eb', // Tailwind blue-600
                    color: '#fff', // chữ trắng
                    fontWeight: 'bold',
                    py: 1.3,
                    '&:hover': {
                      backgroundColor: '#1d4ed8', // Tailwind blue-700
                    },
                  }}
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
