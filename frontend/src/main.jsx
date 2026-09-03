import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ClerkProvider } from '@clerk/react'
import {BrowserRouter} from "react-router"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider>
      <BrowserRouter>
                <App />

      </BrowserRouter>

    </ClerkProvider>
  </StrictMode>,
)
