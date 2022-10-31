import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import '@fontsource/space-grotesk'

import '@css/main.less'

const root = createRoot(document.getElementById('root') as Element)

root.render(<App />)
