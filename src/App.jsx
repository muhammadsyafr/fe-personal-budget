import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, useTransactionStore, useFilterStore } from './store/useStore'
import LoginScreen from './features/auth/LoginScreen'
import SignupScreen from './features/auth/SignupScreen'
import DashboardLayout from './components/Layout'
import TransactionList from './features/transactions/TransactionList'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const AuthGuard = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

const Dashboard = () => {
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions)
  const fetchCategories = useTransactionStore((state) => state.fetchCategories)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useTransactionStore((state) => state.isLoading)
  const dateRange = useFilterStore((state) => state.dateRange)
  const customStartDate = useFilterStore((state) => state.customStartDate)
  const customEndDate = useFilterStore((state) => state.customEndDate)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories()
    }
  }, [isAuthenticated, fetchCategories])

  useEffect(() => {
    if (!isAuthenticated) return

    if (dateRange === 'custom' && (!customStartDate || !customEndDate)) {
      return
    }

    const now = new Date()
    let startDate, endDate

    switch (dateRange) {
      case 'today':
        startDate = now.toISOString().split('T')[0]
        endDate = now.toISOString().split('T')[0]
        break
      case 'this-week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        endDate = now.toISOString().split('T')[0]
        break
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        break
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
        break
      case 'custom':
        startDate = customStartDate
        endDate = customEndDate
        break
      default:
        startDate = null
        endDate = null
    }

    fetchTransactions({ startDate, endDate })
  }, [isAuthenticated, dateRange, customStartDate, customEndDate, fetchTransactions])
  
  return (
    <DashboardLayout>
      {isLoading && <div className="p-4 text-zinc-500">Loading...</div>}
      <TransactionList />
    </DashboardLayout>
  )
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthGuard><LoginScreen /></AuthGuard>} />
        <Route path="/signup" element={<AuthGuard><SignupScreen /></AuthGuard>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
