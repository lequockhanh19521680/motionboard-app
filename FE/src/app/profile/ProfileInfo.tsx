import React, { useState, useEffect, useCallback } from 'react'
import { Box, Stack, TextField, Button, Typography, InputAdornment } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import LockIcon from '@mui/icons-material/Lock'
import ImageUploader from '../../components/common/ImageUploader'
import { useAppSelector, useAppDispatch } from '../../redux/hook'
import { uploadImage } from '../../redux/imageSlice'
import { updateProfile } from '../../redux/authSlice'
import { UpdateProfileRequest } from '../../types/request/UpdateProfileRequest'

const InputIcon = ({ icon }: { icon: React.ReactNode }) => (
  <InputAdornment position="start">{icon}</InputAdornment>
)

export default function ProfileInfo() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFullName(user?.full_name || '')
    setUsername(user?.username || '')
    setEmail(user?.email || '')
    setPhone(user?.phone || '')
    setAvatarUrl(user?.image || '')
  }, [user])

  const uploadFile = async (file: File, onProgress: (percent: number) => void) => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const url = await dispatch(uploadImage(formData)).unwrap()
      onProgress(100)
      return url
    } catch (error: any) {
      throw new Error(error || 'Upload thất bại')
    }
  }

  const handleUploadComplete = (url: string) => setAvatarUrl(url)

  const handleSave = useCallback(async () => {
    const validateField = () => {
      const newErrors: Record<string, string> = {}

      if (!username.trim()) newErrors.username = 'Tên đăng nhập là bắt buộc'
      if (!email.trim()) newErrors.email = 'Email là bắt buộc'
      if (phone && !/^\+?\d{7,15}$/.test(phone.trim()))
        newErrors.phone = 'Số điện thoại không hợp lệ'
      if (password && password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    if (!validateField()) return

    const payload: UpdateProfileRequest = {
      username,
      email,
      password,
      fullName: fullName || undefined,
      phone: phone || undefined,
    }

    try {
      await dispatch(updateProfile(payload)).unwrap()
      alert('Cập nhật thông tin thành công!')
      setPassword('')
    } catch (error: any) {
      alert('Cập nhật thất bại: ' + (error?.toString() || 'Lỗi không xác định'))
    }
  }, [username, email, password, fullName, phone, dispatch])

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4} textAlign="center" color="primary.main">
        Thông tin cá nhân
      </Typography>

      <Stack spacing={4}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.light',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: (theme) => `0 0 8px 3px ${theme.palette.primary.light}`,
              },
              width: 130,
              height: 130,
            }}
          >
            <ImageUploader
              maxFiles={1}
              previewSize={130}
              shape="circle"
              onUpload={uploadFile}
              defaultImages={avatarUrl ? [avatarUrl] : []}
              mode="avatar"
              onUploadComplete={handleUploadComplete}
            />
          </Box>
        </Box>

        <TextField
          label="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          InputProps={{ startAdornment: <InputIcon icon={<AccountCircleIcon color="action" />} /> }}
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
          label="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{ startAdornment: <InputIcon icon={<EmailIcon color="action" />} /> }}
        />

        <TextField
          label="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone}
          InputProps={{ startAdornment: <InputIcon icon={<PhoneIphoneIcon color="action" />} /> }}
        />

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!username.trim() || !email.trim()}
            sx={{
              px: 6,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: 4,
              textTransform: 'uppercase',
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: (theme) => `0 6px 14px ${theme.palette.primary.main}`,
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'grey.400',
                color: 'grey.700',
                boxShadow: 'none',
              },
            }}
          >
            Cập nhật thông tin
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
