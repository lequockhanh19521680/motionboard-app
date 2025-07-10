import React from 'react'
import { Typography } from '@mui/material'

export default function Notifications() {
  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Thông báo
      </Typography>
      <Typography variant="body1" sx={{ mt: 3 }}>
        Mục Thông báo đang phát triển...
      </Typography>
    </>
  )
}
