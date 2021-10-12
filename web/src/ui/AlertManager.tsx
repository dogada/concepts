import Alert, { AlertProps } from 'react-bootstrap/Alert'
import { useEffect } from 'react'

export type Message = {
  id: any
  variant: AlertProps['variant']
  content: string
}

type Props = {
  alerts: Message[]
  maxCount?: number
  autohide?: number
  className?: string
  onAlertClose: (message: Message) => void
}

type MAProps = {
  message: Message
  autohide: number
  onClose: () => void
}

const MessageAlert: React.FC<MAProps> = function ({
  message,
  autohide,
  onClose
}) {
  autohide &&
    useEffect(() => {
      const pid = setTimeout(onClose, autohide)
      return () => clearTimeout(pid)
    }, [])
  return (
    <Alert variant={message.variant} dismissible onClose={onClose}>
      {message.content}
    </Alert>
  )
}

const AlertManager: React.FC<Props> = ({
  alerts,
  maxCount = 2,
  autohide = 5000,
  onAlertClose,
  className
}) => {
  const visibleAlerts = alerts.slice(0, maxCount)
  return (
    <div className={className}>
      {visibleAlerts.map((alert) => (
        <MessageAlert
          key={alert.id}
          message={alert}
          autohide={autohide}
          onClose={onAlertClose.bind(null, alert)}
        />
      ))}
    </div>
  )
}

export default AlertManager
