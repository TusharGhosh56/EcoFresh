// Smart Loading Status Component
import React from 'react'

interface SmartLoadingStatusProps {
  loadingProgress: {
    loaded: number
    total: number
    currentBatch: string
  }
  isLoading: boolean
}

export const SmartLoadingStatus: React.FC<SmartLoadingStatusProps> = ({ 
  loadingProgress, 
  isLoading 
}) => {
  if (!isLoading) return null

  const percentage = loadingProgress.total > 0 
    ? (loadingProgress.loaded / loadingProgress.total) * 100 
    : 0

  return (
    <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="text-center">
        <div className="mb-2 text-sm text-gray-300 flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
          {loadingProgress.currentBatch}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-400">
          {loadingProgress.loaded} of {loadingProgress.total} cities loaded ({Math.round(percentage)}%)
        </div>
        <div className="text-xs text-gray-500 mt-1">
          🧠 Learning your preferences for faster future loads
        </div>
      </div>
    </div>
  )
}

export default SmartLoadingStatus
