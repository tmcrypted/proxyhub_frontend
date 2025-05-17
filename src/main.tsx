import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './shared/config/wagmi.ts'
import { ThemeProvider } from './contexts/ThemeContext'

import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
import App from './pages/App.tsx'

// Apply initial dark mode based on saved preference or system preference
const initializeTheme = () => {
  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem('theme');
    
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // If no saved theme, check system preference
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

// Initialize theme before rendering
initializeTheme();

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <BrowserRouter>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
