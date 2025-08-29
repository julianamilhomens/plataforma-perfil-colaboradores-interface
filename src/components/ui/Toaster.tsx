'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { ToastMessage } from '@/types'

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove após duração especificada
    setTimeout(() => {
      hideToast(id)
    }, newToast.duration)
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onHide: (id: string) => void
}

function ToastContainer({ toasts, onHide }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </div>
  )
}

interface ToastProps {
  toast: ToastMessage
  onHide: (id: string) => void
}

function Toast({ toast, onHide }: ToastProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }

  return (
    <div className={`
      max-w-sm w-full border rounded-lg shadow-lg p-4 animate-slide-up
      ${bgColors[toast.type]}
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icons[toast.type]}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-semibold ${textColors[toast.type]}`}>
            {toast.title}
          </h3>
          {toast.message && (
            <p className={`mt-1 text-sm ${textColors[toast.type]} opacity-90`}>
              {toast.message}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onHide(toast.id)}
          className={`
            ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            ${bgColors[toast.type].includes('bg-') ? 'focus:ring-offset-' + bgColors[toast.type].split('bg-')[1].split(' ')[0] : ''}
          `}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Componente para ser usado no layout
export function Toaster() {
  return (
    <ToastProvider>
      <></>
    </ToastProvider>
  )
}