import RegisterForm from './RegisterForm'
import { Box } from '@mui/material'
export default function RegisternPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',

        background: `linear-gradient(
          to right,
          #a1c4fd 0%,
          #c2e9fb 50%,
          #fbc2eb 50%,
          #a6c1ee 100%
        )`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          minWidth: 350,
        }}
      >
        <RegisterForm />
      </Box>
    </Box>
  )
}
