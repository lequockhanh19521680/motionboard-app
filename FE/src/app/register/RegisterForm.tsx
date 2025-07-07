import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import {
  LockOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
  ArrowBack,
  BadgeOutlined,
  PhoneIphone,
  HomeOutlined,
  AlternateEmailOutlined,
} from '@mui/icons-material'
import { RegisterFormData } from '../../types/request/RegisterRequest'
import { useDispatch } from 'react-redux'
import { registerApi } from '../../api/user/userApi'
import { NotificationType, PAGE_ROUTES, STORAGE_KEYS } from '../../utils/constant'
import { registerSuccess } from '../../redux/authSlice'
import NotificationDialog from '../../components/common/NotificationDialog'
import { REGISTER_TEXT } from './RegisterText'

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  margin: 'auto',
  marginTop: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  position: 'relative',
}))

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  color: theme.palette.text.secondary,
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

const LoginLink = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  marginLeft: theme.spacing(0.5),
  padding: 0,
  minWidth: 'auto',
}))

export default function RegisterForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    showPassword: false,
    showConfirmPassword: false,
  })

  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
  })

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    missingRequired: false,
  })

  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'password' || name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        passwordMismatch: false,
        missingRequired: false,
      }))
    }
  }

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setFormData((prev) => ({
      ...prev,
      [field === 'password' ? 'showPassword' : 'showConfirmPassword']:
        !prev[field === 'password' ? 'showPassword' : 'showConfirmPassword'],
    }))
  }

  const validateForm = () => {
    const requiredFields = ['username', 'password', 'confirmPassword']
    const newErrors = {
      passwordMismatch: formData.password !== formData.confirmPassword,
      missingRequired: requiredFields.some(
        (field) =>
          !formData[field as keyof Omit<RegisterFormData, 'showPassword' | 'showConfirmPassword'>]
      ),
    }

    setErrors(newErrors)
    return !(newErrors.passwordMismatch || newErrors.missingRequired)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setApiError('')
    setIsLoading(true)

    try {
      const response = await registerApi(formData)
      dispatch(registerSuccess(response))
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      localStorage.setItem(STORAGE_KEYS.ROLE, response.user.role)

      setNotification({
        open: true,
        type: 'success',
        title: REGISTER_TEXT.SUCCESS_TITLE,
        message: REGISTER_TEXT.SUCCESS_MESSAGE,
      })
    } catch (error) {
      setNotification({
        open: true,
        type: 'error',
        title: REGISTER_TEXT.ERROR_TITLE,
        message: REGISTER_TEXT.ERROR_MESSAGE,
      })
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormContainer elevation={0}>
      <BackButton onClick={() => navigate(PAGE_ROUTES.LOGIN)}>
        <ArrowBack />
      </BackButton>

      <Box textAlign="center" mb={2}>
        <PersonOutline sx={{ fontSize: 60, color: 'primary.main' }} />
      </Box>

      <form onSubmit={handleSubmit}>
        <FormTitle variant="h4">{REGISTER_TEXT.TITLE}</FormTitle>

        <Box mb={3}>
          <TextField
            fullWidth
            label={REGISTER_TEXT.USERNAME}
            name="username"
            variant="outlined"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            error={errors.missingRequired && !formData.username}
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
            label={REGISTER_TEXT.EMAIL}
            name="email"
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            error={errors.missingRequired && !formData.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label={REGISTER_TEXT.PASSWORD}
            name="password"
            type={formData.showPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            error={errors.missingRequired && !formData.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePasswordVisibility('password')} edge="end">
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label={REGISTER_TEXT.CONFIRM_PASSWORD}
            name="confirmPassword"
            type={formData.showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            error={errors.passwordMismatch || (errors.missingRequired && !formData.confirmPassword)}
            helperText={errors.passwordMismatch ? REGISTER_TEXT.PASSWORD_MISMATCH : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    edge="end"
                  >
                    {formData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label={REGISTER_TEXT.FULLNAME}
            name="fullName"
            variant="outlined"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label={REGISTER_TEXT.PHONE}
            name="phone"
            variant="outlined"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isLoading}
            type="tel"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphone color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label={REGISTER_TEXT.ADDRESS}
            name="address"
            variant="outlined"
            value={formData.address}
            onChange={handleInputChange}
            disabled={isLoading}
            multiline
            rows={2}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <SubmitButton
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? REGISTER_TEXT.PROCESSING : REGISTER_TEXT.SUBMIT_BUTTON}
        </SubmitButton>

        {(errors.missingRequired || apiError || errors.passwordMismatch) && (
          <Box mt={2}>
            <Alert severity="error" variant="outlined">
              {errors.passwordMismatch
                ? REGISTER_TEXT.PASSWORD_MISMATCH
                : errors.missingRequired
                  ? REGISTER_TEXT.REQUIRED_FIELD
                  : apiError}
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
            {REGISTER_TEXT.OR_DIVIDER}
          </Typography>
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" display="inline">
            {REGISTER_TEXT.HAVE_ACCOUNT}
          </Typography>
          <LoginLink color="primary" onClick={() => navigate(PAGE_ROUTES.LOGIN)}>
            {REGISTER_TEXT.LOGIN_LINK}
          </LoginLink>
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
            navigate(PAGE_ROUTES.HOME)
          }
        }}
        autoClose={notification.type === 'success'}
        autoCloseDuration={2000}
        onAutoClose={() => {
          if (notification.type === 'success') {
            navigate(PAGE_ROUTES.HOME)
          }
        }}
      />
    </FormContainer>
  )
}
