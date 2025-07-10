import React from 'react'
import { Box, CircularProgress, Typography, styled } from '@mui/material'

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullScreen?: boolean
  inline?: boolean
}

const LoadingContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullScreen' && prop !== 'inline',
})<{ fullScreen?: boolean; inline?: boolean }>(({ fullScreen, inline }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  ...(fullScreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
  }),
  ...(inline && {
    padding: 16,
  }),
  ...(!fullScreen && !inline && {
    padding: 32,
    minHeight: 200,
  }),
}))

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text,
  fullScreen = false,
  inline = false,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 24
      case 'medium':
        return 40
      case 'large':
        return 56
      default:
        return 40
    }
  }

  return (
    <LoadingContainer fullScreen={fullScreen} inline={inline}>
      <CircularProgress size={getSize()} color="primary" />
      {text && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {text}
        </Typography>
      )}
    </LoadingContainer>
  )
}

export default Loading