import React from 'react'
import { Card as MuiCard, CardProps as MuiCardProps, styled } from '@mui/material'

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'elevated' | 'outlined' | 'flat'
  hover?: boolean
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'hover' && prop !== 'customVariant',
})<{ hover?: boolean; customVariant?: string }>(({ theme, hover, customVariant = 'elevated' }) => ({
  borderRadius: 16,
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(customVariant === 'elevated' && {
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  }),
  ...(customVariant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
  ...(customVariant === 'flat' && {
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
  }),
  ...(hover && {
    cursor: 'pointer',
    '&:hover': {
      ...(customVariant === 'elevated' && {
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)',
      }),
      ...(customVariant === 'outlined' && {
        borderColor: theme.palette.primary.main,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }),
      ...(customVariant === 'flat' && {
        backgroundColor: theme.palette.action.hover,
      }),
    },
  }),
}))

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  hover = false,
  ...props
}) => {
  const getMuiVariant = () => {
    switch (variant) {
      case 'outlined':
        return 'outlined' as const
      case 'elevated':
      case 'flat':
      default:
        return 'elevation' as const
    }
  }

  return (
    <StyledCard variant={getMuiVariant()} hover={hover} customVariant={variant} {...props}>
      {children}
    </StyledCard>
  )
}

export default Card