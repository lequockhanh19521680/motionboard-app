import { Box, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 2, mt: 'auto' }}>
      <Typography variant="body2" align="center">
        © 2025 Your Company
      </Typography>
    </Box>
  )
}
