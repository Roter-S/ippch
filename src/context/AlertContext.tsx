import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { timerAlert } from '../constants/constants'
import MUISnackbar from '../components/common/MUISnackbar'

interface Alert {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

interface AlertContextType {
  showAlert: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void
  resetAlert: () => void // Agrega una función para resetear la alerta
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (context == null) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context.showAlert
}

interface AlertProviderProps {
  children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<Alert | null>(null)

  const showAlert = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    setAlert({ message, type })
  }

  const resetAlert = () => {
    setAlert(null)
  }

  return (
    <AlertContext.Provider value={{ showAlert, resetAlert }}>
      {children}
      {(alert != null) && <MUISnackbar autoHideDuration={timerAlert} vertical='top' horizontal='center' alert={alert} resetAlert={resetAlert} />}
    </AlertContext.Provider>
  )
}
