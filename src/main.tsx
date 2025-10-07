import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import theme from './theme'; // Your custom theme file
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>

    <App />
    </ConfigProvider>
  </StrictMode>,
)
