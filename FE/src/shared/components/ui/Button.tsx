import React from 'react'
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from '@mui/material'
import { CircularProgress } from '@mui/material'

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger'
  loading?: boolean
  fullWidth?: boolean
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'loading',
})<{ loading?: boolean }>(({ theme, loading }) => ({
  borderRadius: 12,
  fontWeight: 600,
  textTransform: 'none',
  minHeight: 44,
  position: 'relative',
  ...(loading && {
    color: 'transparent',
  }),
  '&.MuiButton-sizeLarge': {
    minHeight: 52,
    fontSize: '1.1rem',
  },
  '&.MuiButton-sizeSmall': {
    minHeight: 36,
    fontSize: '0.875rem',
  },
}))

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'inherit',
}))

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  ...props
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return { variant: 'contained' as const, color: 'primary' as const }
      case 'secondary':
        return { variant: 'contained' as const, color: 'secondary' as const }
      case 'outlined':
        return { variant: 'outlined' as const, color: 'primary' as const }
      case 'text':
        return { variant: 'text' as const, color: 'primary' as const }
      case 'danger':
        return { variant: 'contained' as const, color: 'error' as const }
      default:
        return { variant: 'contained' as const, color: 'primary' as const }
    }
  }

  return (
    <StyledButton
      {...getVariantProps()}
      disabled={disabled || loading}
      loading={loading}
      {...props}
    >
      {children}
      {loading && <LoadingSpinner size={20} />}
    </StyledButton>
  )
}

export default Button