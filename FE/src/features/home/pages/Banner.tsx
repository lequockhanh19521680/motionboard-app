import { Typography, Button, Box } from '@mui/material'
import Slider from 'react-slick'

export const Banner: React.FC = () => {
  const slides = [
    {
      title: 'Siêu sale tháng 10',
      subtitle: 'Giảm giá lên đến 50% cho tất cả sản phẩm',
      button: 'Mua ngay',
      image: 'https://tse2.mm.bing.net/th/id/OIP.Ooo5-vgtSQN5o8Dgp8h9VgHaDe?pid=Api&P=0&h=220', // đổi thành ảnh của bạn
    },
    {
      title: 'Black Friday',
      subtitle: 'Ưu đãi cực sốc lên đến 70%',
      button: 'Khám phá',
      image: 'https://tse2.mm.bing.net/th/id/OIP.FF0vo0hHEYMspvJ3HzyFdAHaDt?pid=Api&P=0&h=220',
    },
    {
      title: 'Hè rực rỡ',
      subtitle: 'Ưu đãi 30% cho đơn hàng đầu tiên',
      button: 'Bắt đầu mua sắm',
      image: 'https://tse3.mm.bing.net/th/id/OIP.4rJHObCMlOdUzg1cMUNsBQHaE8?pid=Api&P=0&h=220',
    },
  ]

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  }

  return (
    <Box sx={{ mb: 8 }}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              height: { xs: 300, md: 500 },
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            {/* background image */}
            <Box
              component="img"
              src={slide.image}
              alt={slide.title}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                top: 0,
                left: 0,
              }}
            />
            {/* overlay gradient */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2))',
              }}
            />
            {/* text content */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' },
                px: { xs: 2, md: 8 },
                color: '#fff',
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '3rem' } }}
              >
                {slide.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, maxWidth: { md: '50%' }, fontSize: { xs: '1rem', md: '1.5rem' } }}
              >
                {slide.subtitle}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  borderRadius: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                }}
              >
                {slide.button}
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  )
}
