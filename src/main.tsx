import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ColorProvider } from './context/ColorContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorProvider>
      <App />
    </ColorProvider>
  </StrictMode>,
)
