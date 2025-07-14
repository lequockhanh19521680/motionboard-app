import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  styled,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import { useAppSelector, useAppDispatch } from '../../../redux/hook'
import { uploadPublicImage } from '../../../redux/imageSlice'
import { fetchProfile, updateProfile } from '../../../redux/authSlice'
import NotificationDialog from '../../../shared/components/feedback/NotificationDialog'
import { UpdateProfileRequest } from '../../../shared/types/request/UpdateProfileRequest'

const InputIcon = ({ icon }: { icon: React.ReactNode }) => (
  <InputAdornment position="start">{icon}</InputAdornment>
)

const SubmitButton = styled('button')(({ theme }) => ({
  marginTop: theme.spacing(5),
  padding: theme.spacing(1.5, 4),
  borderRadius: 12,
  fontWeight: 700,
  fontSize: '1rem',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.grey[700],
    cursor: 'not-allowed',
  },
}))

export default function ProfileInfo() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success')
  const [dialogMessage, setDialogMessage] = useState('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '')
      setUsername(user.username || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setAvatarUrl(user.image || '')
    }
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAvatarUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = useCallback(async () => {
    const validateField = () => {
      const newErrors: Record<string, string> = {}

      if (!username.trim()) newErrors.username = 'Tên đăng nhập là bắt buộc'
      if (!email.trim()) newErrors.email = 'Email là bắt buộc'
      if (phone && !/^\+?\d{7,15}$/.test(phone.trim()))
        newErrors.phone = 'Số điện thoại không hợp lệ'

      return Object.keys(newErrors).length === 0
    }

    if (!validateField()) return

    setIsLoading(true)

    let imageUrl = avatarUrl

    if (selectedFile) {
      const formData = new FormData()
      formData.append('image', selectedFile)
      try {
        imageUrl = await dispatch(uploadPublicImage(formData)).unwrap()
      } catch (error: any) {
        setDialogType('error')
        setDialogMessage('Upload ảnh thất bại: ' + error?.toString())
        setDialogOpen(true)
        setIsLoading(false)
        return
      }
    }

    const payload: UpdateProfileRequest = {
      username,
      email,
      fullName: fullName || undefined,
      phone: phone || undefined,
      image: imageUrl || undefined,
    }

    try {
      await dispatch(updateProfile(payload)).unwrap()
      await dispatch(fetchProfile()).unwrap()
      setSelectedFile(null)

      setDialogType('success')
      setDialogMessage('Thông tin đã được cập nhật.')
      setDialogOpen(true)
    } catch (error: any) {
      setDialogType('error')
      setDialogMessage('Cập nhật thất bại: ' + error?.toString())
      setDialogOpen(true)
    } finally {
      setIsLoading(false)
    }
  }, [username, email, fullName, phone, selectedFile, avatarUrl, dispatch])

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4} textAlign="center" color="primary.main">
        Thông tin cá nhân
      </Typography>

      <Stack spacing={4}>
        <Box display="flex" justifyContent="center">
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.light',
              overflow: 'hidden',
              width: 130,
              height: 130,
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: (theme) => `0 0 8px 3px ${theme.palette.primary.light}`,
              },
            }}
          >
            <img
              src={avatarUrl || '/default-avatar.png'}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Box>
        </Box>

        <TextField
          label="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: <InputIcon icon={<AccountCircleIcon color="action" />} />,
          }}
        />

        <TextField
          label="Tên đăng nhập"
          value={username}
          fullWidth
          disabled
          required
          error={!!errors.username}
          helperText={errors.username}
          InputProps={{
            startAdornment: <InputIcon icon={<AccountCircleIcon color="disabled" />} />,
          }}
        />

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: <InputIcon icon={<EmailIcon color="action" />} />,
          }}
        />

        <TextField
          label="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone}
          InputProps={{
            startAdornment: <InputIcon icon={<PhoneIphoneIcon color="action" />} />,
          }}
        />

        <Box textAlign="center" mt={5}>
          <SubmitButton
            disabled={isLoading || !username.trim() || !email.trim()}
            onClick={handleSave}
          >
            {isLoading && <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />}
            {isLoading ? 'Đang lưu...' : 'Cập nhật thông tin'}
          </SubmitButton>
        </Box>
      </Stack>

      <NotificationDialog
        open={dialogOpen}
        type={dialogType}
        title={dialogType === 'success' ? 'Thành công' : 'Lỗi'}
        message={dialogMessage}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  )
}
