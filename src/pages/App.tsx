import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import { useAuthStore } from '../pages/auth/store/authStore'
import Auth from '../pages/auth/Auth'
import GoogleCallback from '../pages/auth/GoogleCallback'
import Home from '../pages/home/Home'
import Proxies from '../pages/proxies/Proxies'
import Dashboard from '../pages/dashboard/Dashboard'
import Profile from '../pages/profile/Profile'
import ProfileBalance from '../pages/profile/ProfileBalance'
import ProfileTransactions from '../pages/profile/ProfileTransactions'
import ProfileOrders from '../pages/profile/ProfileOrders'
import ProfileReferrals from '../pages/profile/ProfileReferrals'
import ProfileSettings from '../pages/profile/ProfileSettings'
import useIsAdmin from '../hooks/useIsAdmin'

// Admin pages
import AdminProxies from '../pages/admin/AdminProxies'
import AdminBranches from '../pages/admin/AdminBranches'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminOrders from '../pages/admin/AdminOrders'
import AdminPricing from '../pages/admin/AdminPricing'
import AdminPromoCodes from '../pages/admin/AdminPromoCodes'

function App() {
  const isAdmin = useIsAdmin();
  
  return (
    <div className="app-wrapper dark-force-bg dark-force-text">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {!isAdmin && <Route path="proxies" element={<Proxies />} />}
          <Route path="auth" element={<Auth />} />
          <Route path="auth/google/callback" element={<GoogleCallback />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          >
            {!isAdmin && (
              <>
                <Route index element={<ProfileBalance />} />
                <Route path="transactions" element={<ProfileTransactions />} />
                <Route path="orders" element={<ProfileOrders />} />
                <Route path="referrals" element={<ProfileReferrals />} />
                <Route path="settings" element={<ProfileSettings />} />
              </>
            )}
            
            {/* Admin routes */}
            <Route path="admin/proxies" element={<AdminProxies />} />
            <Route path="admin/branches" element={<AdminBranches />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/pricing" element={<AdminPricing />} />
            <Route path="admin/promo-codes" element={<AdminPromoCodes />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

// Component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/auth" />
  }

  return <>{children}</>
}

// Component for admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return <Navigate to="/profile" />
  }

  return <>{children}</>
}

export default App
