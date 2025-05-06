import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import { useAuthStore } from '../store/authStore'
import Auth from './auth/Auth'
import GoogleCallback from './auth/GoogleCallback'
import Home from './home/Home'
import Proxies from './proxies/Proxies'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="proxies" element={<Proxies />} />
        <Route path="auth" element={<Auth />} />
        <Route path="auth/google/callback" element={<GoogleCallback />} />
        {/* <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
      </Route>
    </Routes>
  )
}

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()

  // if (!isAuthenticated) {
  //   return <Navigate to="/" />
  // }

  return <>{children}</>
}

export default App
