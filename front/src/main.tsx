import 'core-js/es/map'
import 'core-js/es/set'

import React from 'react'
import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from '@store/index'
import App from './App'

import '@fontsource/space-grotesk'

import '@css/main.less'

const root = createRoot(document.getElementById('root') as Element)
const persistor = persistStore(store)

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        <App />
      </HashRouter>
    </PersistGate>
  </Provider>
)
