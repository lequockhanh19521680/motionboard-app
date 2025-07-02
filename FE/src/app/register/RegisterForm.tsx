import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LockOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
  ArrowBack,
  BadgeOutlined,
  PhoneIphone,
  HomeOutlined
} from '@mui/icons-material';
import { RegisterFormData } from '../../types/request/registerRequest';

// Constants
const FORM_LABELS = {
  TITLE: 'Đăng ký tài khoản',
  USERNAME: 'Tên đăng nhập',
  PASSWORD: 'Mật khẩu',
  CONFIRM_PASSWORD: 'Xác nhận mật khẩu',
  FULLNAME: 'Họ và tên',
  PHONE: 'Số điện thoại',
  ADDRESS: 'Địa chỉ',
  SUBMIT_BUTTON: 'Đăng ký',
  ERROR_MESSAGE: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
  PASSWORD_MISMATCH: 'Mật khẩu không khớp!',
  REQUIRED_FIELD: 'Trường này là bắt buộc',
  HAVE_ACCOUNT: 'Đã có tài khoản?',
  LOGIN_LINK: 'Đăng nhập ngay',
  OR_DIVIDER: 'HOẶC'
};

const ROUTES = {
  LOGIN: '/login'
};

// Styled components
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  margin: 'auto',
  marginTop: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  position: 'relative'
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  color: theme.palette.text.secondary
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  fontWeight: 700,
  color: theme.palette.primary.main,
  fontSize: '1.8rem'
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
  }
}));

const LoginLink = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  marginLeft: theme.spacing(0.5),
  padding: 0,
  minWidth: 'auto'
}));


export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    showPassword: false,
    showConfirmPassword: false
  });
  
  const [errors, setErrors] = useState({
    passwordMismatch: false,
    missingRequired: false
  });
  
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset errors when user types
    if (name === 'password' || name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        passwordMismatch: false,
        missingRequired: false
      }));
    }
  };

  // Sửa lỗi TypeScript bằng cách dùng switch case
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setFormData(prev => ({
        ...prev,
        showPassword: !prev.showPassword
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        showConfirmPassword: !prev.showConfirmPassword
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = ['username', 'password', 'confirmPassword'];
    const newErrors = {
      passwordMismatch: formData.password !== formData.confirmPassword,
      missingRequired: requiredFields.some(field => !formData[field as keyof Omit<RegisterFormData, 'showPassword' | 'showConfirmPassword'>])
    };
    
    setErrors(newErrors);
    return !(newErrors.passwordMismatch || newErrors.missingRequired);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setApiError('');
    setIsLoading(true);
    
    try {
      // Gọi API đăng ký tại đây
      // await registerApi({
      //   username: formData.username,
      //   password: formData.password,
      //   fullName: formData.fullName,
      //   phone: formData.phone,
      //   address: formData.address
      // });
      
      // Giả lập thành công
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);
      
    } catch (error) {
      setApiError(FORM_LABELS.ERROR_MESSAGE);
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer elevation={0}>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowBack />
      </BackButton>
      
      <Box textAlign="center" mb={2}>
        <PersonOutline sx={{ fontSize: 60, color: 'primary.main' }} />
      </Box>
      
      <form onSubmit={handleSubmit}>
        <FormTitle variant="h4">
          {FORM_LABELS.TITLE}
        </FormTitle>
        
        {/* Required fields */}
        <Box mb={3}>
          <TextField
            fullWidth
            label={FORM_LABELS.USERNAME}
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
              )
            }}
          />
        </Box>
        
        <Box mb={3}>
          <TextField
            fullWidth
            label={FORM_LABELS.PASSWORD}
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
                  <IconButton
                    onClick={() => togglePasswordVisibility('password')}
                    edge="end"
                  >
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        <Box mb={3}>
          <TextField
            fullWidth
            label={FORM_LABELS.CONFIRM_PASSWORD}
            name="confirmPassword"
            type={formData.showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            error={errors.passwordMismatch || (errors.missingRequired && !formData.confirmPassword)}
            helperText={errors.passwordMismatch ? FORM_LABELS.PASSWORD_MISMATCH : ''}
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
              )
            }}
          />
        </Box>
        
        {/* Optional fields */}
        <Box mb={3}>
          <TextField
            fullWidth
            label={FORM_LABELS.FULLNAME}
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
              )
            }}
          />
        </Box>
        
        <Box mb={3}>
          <TextField
            fullWidth
            label={FORM_LABELS.PHONE}
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
              )
            }}
          />
        </Box>
        
        <Box mb={3}>
          <TextField
            fullWidth
            label={FORM_LABELS.ADDRESS}
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
              )
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
          {isLoading ? 'Đang xử lý...' : FORM_LABELS.SUBMIT_BUTTON}
        </SubmitButton>
        
        {(errors.missingRequired || apiError || errors.passwordMismatch) && (
          <Box mt={2}>
            <Alert severity="error" variant="outlined">
              {errors.passwordMismatch 
                ? FORM_LABELS.PASSWORD_MISMATCH 
                : errors.missingRequired 
                  ? FORM_LABELS.REQUIRED_FIELD 
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
              color: 'text.secondary'
            }}
          >
            {FORM_LABELS.OR_DIVIDER}
          </Typography>
        </Box>
        
        <Box mt={2} textAlign="center">
          <Typography variant="body2" display="inline">
            {FORM_LABELS.HAVE_ACCOUNT}
          </Typography>
          <LoginLink 
            color="primary" 
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            {FORM_LABELS.LOGIN_LINK}
          </LoginLink>
        </Box>
      </form>
    </FormContainer>
  );
}