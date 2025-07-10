import React from 'react'
import { Box, Button, Typography } from '@mui/material'

interface LogoutTabProps {
  onLogout: () => void
}

export default function LogoutTab({ onLogout }: LogoutTabProps) {
  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Đăng xuất
      </Typography>
      <Typography variant="body1" sx={{ mt: 3 }}>
        Bạn có thể xử lý đăng xuất ở đây.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="error" onClick={onLogout}>
          Đăng xuất
        </Button>
      </Box>
    </>
  )
}
