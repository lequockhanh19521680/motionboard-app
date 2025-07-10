import React, { createContext, useCallback, useState, useEffect } from 'react'
import NotificationDialog from './NotificationDialog' // Đường dẫn đúng với dự án của bạn

// ==== GLOBAL NOTIFICATION HANDLER MODULE-SCOPE VAR & EXPORT ====
type NotificationType = 'success' | 'error' | 'warning' | 'info'
type HandlerType = (
  type: NotificationType,
  title: string,
  message: string,
  onAfterClose?: () => void
) => void

let globalNotificationHandler: HandlerType = () => {
  throw new Error('Notification handler has not been initialized yet.')
}

export function showGlobalNotification(...params: Parameters<HandlerType>) {
  globalNotificationHandler(...params)
}

export const NotificationContext = createContext<null>(null)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<NotificationType>('info')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [afterClose, setAfterClose] = useState<(() => void) | undefined>(undefined)

  const showDialog = useCallback(
    (_type: NotificationType, _title: string, _message: string, _onAfterClose?: () => void) => {
      setType(_type)
      setTitle(_title)
      setMessage(_message)
      setAfterClose(() => _onAfterClose)
      setOpen(true)
    },
    []
  )

  useEffect(() => {
    // Gắn hàm toàn cục cho handler đầu app
    globalNotificationHandler = showDialog
  }, [showDialog])

  const handleClose = () => {
    setOpen(false)
    if (afterClose) {
      afterClose()
      setAfterClose(undefined)
    }
  }

  return (
    <NotificationContext.Provider value={null}>
      {children}
      <NotificationDialog
        open={open}
        type={type}
        title={title}
        message={message}
        onClose={handleClose}
      />
    </NotificationContext.Provider>
  )
}
