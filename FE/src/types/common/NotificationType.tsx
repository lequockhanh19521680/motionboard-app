import { NotificationType } from '../../utils/constant'

export interface NotificationDialogProps {
  open: boolean
  type: NotificationType
  title: string
  message: string
  onClose: () => void
  onAutoClose?: () => void
  autoClose?: boolean
  autoCloseDuration?: number
}
