import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Alert,
  Divider,
  InputAdornment,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { LockOutlined, PersonOutline } from '@mui/icons-material'
import { NotificationType, PAGE_ROUTES, STORAGE_KEYS } from '../../../shared/constants'
import NotificationDialog from '../../../shared/components/feedback/NotificationDialog'
import { Button, Input } from '../../../shared/components/ui'
import { LOGIN_TEXT } from './LoginText'
import { fetchProfile, loginUser } from '../../../redux/authSlice'
import { AppDispatch } from '../../../redux/store'

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 450,
  margin: 'auto',
  marginTop: theme.spacing(8),
  borderRadius: 16,
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  position: 'relative',
}))

const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  fontWeight: 700,
  color: theme.palette.primary.main,
  fontSize: '1.8rem',
}))

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
  })

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { username, password } = formData

      const response = await dispatch(loginUser({ username, password })).unwrap()
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      await dispatch(fetchProfile())

      setNotification({
        open: true,
        type: 'success',
        title: LOGIN_TEXT.SUCCESS_TITLE,
        message: LOGIN_TEXT.SUCCESS_MESSAGE,
      })
    } catch (error) {
      setNotification({
        open: true,
        type: 'error',
        title: LOGIN_TEXT.ERROR_TITLE,
        message: LOGIN_TEXT.ERROR_MESSAGE,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormContainer elevation={0}>
      <Box textAlign="center" mb={2}>
        <LockOutlined sx={{ fontSize: 60, color: 'primary.main' }} />
      </Box>

      <form onSubmit={handleSubmit}>
        <FormTitle variant="h4">{LOGIN_TEXT.TITLE}</FormTitle>

        <Box mb={3}>
          <Input
            fullWidth
            required
            label={LOGIN_TEXT.USERNAME}
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={3}>
          <Input
            fullWidth
            required
            label={LOGIN_TEXT.PASSWORD}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            showPasswordToggle
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box textAlign="right" mb={2}>
          <Button
            variant="text"
            onClick={() => console.log('Forgot password clicked')}
          >
            {LOGIN_TEXT.FORGOT_PASSWORD}
          </Button>
        </Box>

        <Button
          fullWidth
          variant="primary"
          type="submit"
          loading={isLoading}
          sx={{ mt: 3 }}
        >
          {LOGIN_TEXT.SUBMIT_BUTTON}
        </Button>

        {error && (
          <Box mt={2}>
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          </Box>
        )}

        <Box mt={3} mb={3} position="relative">
          <Divider />
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'background.paper',
              px: 2,
              color: 'text.secondary',
            }}
          >
            {LOGIN_TEXT.OR_DIVIDER}
          </Typography>
        </Box>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {LOGIN_TEXT.NO_ACCOUNT}
          </Typography>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => navigate(PAGE_ROUTES.REGISTER)}
            sx={{ mt: 1 }}
          >
            {LOGIN_TEXT.REGISTER_BUTTON}
          </Button>
        </Box>
      </form>

      <NotificationDialog
        open={notification.open}
        type={notification.type as NotificationType}
        title={notification.title}
        message={notification.message}
        onClose={() => {
          setNotification((prev) => ({ ...prev, open: false }))
          if (notification.type === 'success') {
            navigate(PAGE_ROUTES.AFTER_LOGIN)
          }
        }}
        autoClose={notification.type === 'success'}
        autoCloseDuration={2000}
        onAutoClose={() => {
          if (notification.type === 'success') {
            navigate(PAGE_ROUTES.AFTER_LOGIN)
          }
        }}
      />
    </FormContainer>
  )
}
