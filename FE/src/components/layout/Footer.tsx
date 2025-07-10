import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import FacebookIcon from '@mui/icons-material/Facebook'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailIcon from '@mui/icons-material/Email'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,
        px: 2,
        mt: 'auto',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Box flex={1} minWidth={240}>
          <Typography variant="h6" gutterBottom>
            Công ty TNHH
          </Typography>
          <Typography variant="body2">
            Một mình Khanh. Giải pháp đell phải công nghệ giúp doanh nghiệp phát triển nhanh và bền
            vững. Chúng tôi luôn đồng hành cùng thành công của bạn.
          </Typography>
        </Box>
        <Box flex={1} minWidth={200}>
          <Typography variant="h6" gutterBottom>
            Liên kết hữu ích
          </Typography>
          <Stack spacing={1}>
            <Link href="/about" color="inherit" underline="hover">
              Về chúng tôi
            </Link>
            <Link href="/services" color="inherit" underline="hover">
              Dịch vụ
            </Link>
            <Link href="/contact" color="inherit" underline="hover">
              Liên hệ
            </Link>
            <Link href="/privacy" color="inherit" underline="hover">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" color="inherit" underline="hover">
              Điều khoản sử dụng
            </Link>
          </Stack>
        </Box>
        <Box flex={1} minWidth={220}>
          <Typography variant="h6" gutterBottom>
            Liên hệ
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <EmailIcon fontSize="small" />
            <Typography variant="body2">info@yourcompany.com</Typography>
          </Stack>
          <Typography variant="body2" mb={1}>
            123 Đường ABC, Quận 1, TP. HCM
          </Typography>
          <Stack direction="row" spacing={2}>
            <IconButton color="inherit" href="https://facebook.com" target="_blank" rel="noopener">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="https://twitter.com" target="_blank" rel="noopener">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" href="https://linkedin.com" target="_blank" rel="noopener">
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
      <Box mt={4}>
        <Typography variant="body2" color="inherit" align="center">
          © 2025 Your Company. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
