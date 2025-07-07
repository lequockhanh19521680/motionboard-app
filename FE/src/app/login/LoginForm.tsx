import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/authSlice'
import { loginApi } from '../../api/user/userApi'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { LockOutlined, PersonOutline, Visibility, VisibilityOff } from '@mui/icons-material'
import { NotificationType, PAGE_ROUTES, STORAGE_KEYS } from '../../utils/constant'
import NotificationDialog from '../../components/common/NotificationDialog'
import { LOGIN_TEXT } from './LoginText'

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

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
}))

const RegisterButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  fontWeight: 600,
  fontSize: '1rem',
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}))

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false,
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClickShowPassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { username, password } = formData
      const response = await loginApi(username, password)

      dispatch(loginSuccess(response))
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      localStorage.setItem(STORAGE_KEYS.ROLE, response.user.role)

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
          <TextField
            fullWidth
            required
            label={LOGIN_TEXT.USERNAME}
            name="username"
            variant="outlined"
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
          <TextField
            fullWidth
            required
            label={LOGIN_TEXT.PASSWORD}
            name="password"
            type={formData.showPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box textAlign="right" mb={2}>
          <Button
            variant="text"
            color="primary"
            onClick={() => console.log('Forgot password clicked')}
          >
            {LOGIN_TEXT.FORGOT_PASSWORD}
          </Button>
        </Box>

        <SubmitButton
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? LOGIN_TEXT.PROCESSING : LOGIN_TEXT.SUBMIT_BUTTON}
        </SubmitButton>

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
          <RegisterButton
            fullWidth
            variant="contained"
            onClick={() => navigate(PAGE_ROUTES.REGISTER)}
          >
            {LOGIN_TEXT.REGISTER_BUTTON}
          </RegisterButton>
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
