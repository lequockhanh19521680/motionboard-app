import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  Box,
  useTheme,
  SlideProps,
} from '@mui/material'
import { CheckCircle, Error, Info, Warning } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { NotificationDialogProps } from '../../types/common/NotificationType'

const Transition = React.forwardRef<HTMLDivElement, SlideProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

Transition.displayName = 'Transition'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(3),
    minWidth: 320,
    maxWidth: 400,
    textAlign: 'center',
    boxShadow: theme.shadows[10],
    border: `1px solid ${theme.palette.divider}`,
  },
}))
const IconContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 64,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
}))

const Title = styled(DialogTitle)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  padding: 0,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}))

const ContentText = styled(DialogContentText)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  marginBottom: theme.spacing(2),
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}))

const iconMap = {
  success: <CheckCircle color="success" />,
  error: <Error color="error" />,
  warning: <Warning color="warning" />,
  info: <Info color="info" />,
}

function NotificationDialog({
  open,
  type,
  title,
  message,
  onClose,
  autoClose = false,
  autoCloseDuration = 3000,
  onAutoClose,
}: NotificationDialogProps) {
  const theme = useTheme()

  useEffect(() => {
    if (autoClose && open) {
      const timer = setTimeout(() => {
        onClose?.()
        onAutoClose?.() // Thêm dòng này
      }, autoCloseDuration)
      return () => clearTimeout(timer)
    }
  }, [open, autoClose, autoCloseDuration, onClose, onAutoClose])

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box px={3} pt={2} pb={1}>
        <IconContainer>{iconMap[type]}</IconContainer>
        <Title id="alert-dialog-title">{title}</Title>
        <DialogContent>
          <ContentText id="alert-dialog-description">{message}</ContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: 0 }}>
          <ActionButton
            onClick={onClose}
            color="primary"
            variant="contained"
            fullWidth
            disableElevation
            sx={{
              backgroundColor: theme.palette[type].main,
              '&:hover': {
                backgroundColor: theme.palette[type].dark,
              },
            }}
          >
            Đóng
          </ActionButton>
        </DialogActions>
      </Box>
    </StyledDialog>
  )
}

NotificationDialog.displayName = 'NotificationDialog'

export default NotificationDialog
