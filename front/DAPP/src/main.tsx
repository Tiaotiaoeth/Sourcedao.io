import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { ThemeProvider } from '@mui/material/styles'
import '@fontsource/space-grotesk'
import '@fontsource/alfa-slab-one'
import store from '@store/index'
import theme from '@utils/theme'
import App from './App'

import '@css/main.less'


const root = createRoot((document.getElementById('root') as Element))
const persistor = persistStore(store)

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </HashRouter>
    </PersistGate>
  </Provider>
)
