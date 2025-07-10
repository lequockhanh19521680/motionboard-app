import React from 'react'
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  styled,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export interface InputProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard'
  showPasswordToggle?: boolean
}

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 4,
    marginTop: 6,
  },
}))

export const Input: React.FC<InputProps> = ({
  type = 'text',
  showPasswordToggle = false,
  variant = 'outlined',
  InputProps,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type

  const endAdornment = showPasswordToggle && type === 'password' ? (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleTogglePassword}
        edge="end"
        size="small"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  ) : InputProps?.endAdornment

  return (
    <StyledTextField
      variant={variant}
      type={inputType}
      InputProps={{
        ...InputProps,
        endAdornment,
      }}
      {...props}
    />
  )
}

export default Input