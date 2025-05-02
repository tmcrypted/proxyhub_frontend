import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Proxies from './pages/Proxies'
import Auth from './pages/Auth'
// import Dashboard from './pages/Dashboard'
// import Pricing from './pages/Pricing'
// import { useAuthStore } from './store/authStore'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="proxies" element={<Proxies />} />
        <Route path="auth" element={<Auth />} />
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
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuthStore()

//   // if (!isAuthenticated) {
//   //   return <Navigate to="/" />
//   // }

//   return <>{children}</>
// }

export default App
