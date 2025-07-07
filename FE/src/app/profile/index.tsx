import { Box } from '@mui/material'
import ProfileLayout from './ProfileLayout'

export default function ProfilePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 128px)', // trừ header và footer
        width: '100%', // chiếm hết chiều ngang trong container
        bgcolor: 'background.default',
        color: 'text.primary',
        overflow: 'hidden',
      }}
    >
      <ProfileLayout />
    </Box>
  )
}
