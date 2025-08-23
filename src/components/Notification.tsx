import { useEffect } from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
  onClose: () => void
}

export default function Notification({ message, type, show, onClose }: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000) // Auto-hide after 3 seconds
      
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500 text-green-100'
      case 'error':
        return 'bg-red-900/90 border-red-500 text-red-100'
      case 'info':
      default:
        return 'bg-blue-900/90 border-blue-500 text-blue-100'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`fixed top-20 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${getTypeStyles()}`}>
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getIcon()}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
