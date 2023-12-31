import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme/theme'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './assets/css/Main.css'
import { getCollection } from './utils/firestoreUtils'
import { type Setting } from './types/Types'
import { AlertProvider } from './context/AlertContext'

const rootElement = document.getElementById('root')
async function loadSettings () {
  try {
    const setting: Setting[] = await getCollection('settings', { filters: [], orderBy: [], limit: 1 }) as Setting[]
    if (setting.length > 0) {
      document.title = setting[0].name
    }
  } catch (error) {
    console.log(error)
  }
}
if (rootElement !== null) {
  loadSettings().catch((error) => {
    console.log(error)
  })

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <AlertProvider>
            <RouterProvider router={router} />
          </AlertProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
