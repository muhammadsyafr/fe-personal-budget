import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Receipt, 
  ScanLine, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Plus,
  Wallet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthStore, useFilterStore } from '@/store/useStore'
import SummaryCards from '@/features/dashboard/SummaryCards'
import CategoryFilter from '@/features/dashboard/CategoryFilter'
import DateRangeFilter from '@/features/dashboard/DateRangeFilter'
import TransactionList from '@/features/transactions/TransactionList'
import HistoryScreen from '@/features/history/HistoryScreen'
import AddTransactionModal from '@/features/transactions/AddTransactionModal'
import ScannerScreen from '@/features/scanner/ScannerScreen'
import SettingsScreen from '@/features/settings/SettingsScreen'

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuthStore()
  const { searchQuery, setSearchQuery } = useFilterStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'transactions', icon: Receipt, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  const renderContent = () => {
    if (activeTab === 'settings') {
      return <SettingsScreen onBack={() => setActiveTab('dashboard')} />
    }

    if (activeTab === 'transactions') {
      return (
        <main className="max-w-2xl mx-auto px-4 py-5 pb-28">
          <HistoryScreen onEdit={(transaction) => {
            setShowAddModal(true)
          }} />
        </main>
      )
    }

    return (
      <>
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-800/50">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-300 flex items-center justify-center shadow-lg shadow-white/5 overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-zinc-900">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-zinc-50">
                    SpendSmart
                  </h1>
                  <p className="text-xs text-zinc-500">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button 
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="
                  w-full bg-zinc-900/60 border border-zinc-800/50 rounded-xl
                  pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500
                  focus:outline-none focus:border-zinc-700/70 focus:bg-zinc-900/80
                  transition-all duration-200
                "
              />
            </div>

            <div className="mt-3">
              <DateRangeFilter />
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-5 pb-28">
          <div className="space-y-5">
            <SummaryCards />
                        <CategoryFilter />
            {children}
          </div>
        </main>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowScanner(true)}
          className="
            fixed bottom-20 right-6 z-20
            w-14 h-14 rounded-2xl
            bg-gradient-to-br from-zinc-100 to-zinc-200
            flex items-center justify-center
            shadow-xl shadow-white/10
            border border-zinc-300/20
          "
        >
          <ScanLine className="w-6 h-6 text-zinc-900" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="
            fixed bottom-20 left-6 z-20
            w-14 h-14 rounded-2xl
            bg-zinc-900/80 backdrop-blur
            flex items-center justify-center
            shadow-xl shadow-black/20
            border border-zinc-800/50
          "
        >
          <Plus className="w-6 h-6 text-zinc-100" />
        </motion.button>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <AnimatePresence>
        {showScanner && (
          <ScannerScreen 
            onClose={() => setShowScanner(false)} 
            onSuccess={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <AddTransactionModal 
            isOpen={showAddModal} 
            onClose={() => setShowAddModal(false)}
            onOpenScanner={() => setShowScanner(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      {activeTab !== 'settings' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800/50 z-20">
          <div className="max-w-2xl mx-auto flex justify-around py-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all duration-200
                  ${activeTab === item.id 
                    ? 'text-zinc-100 bg-zinc-900/60 border border-zinc-800/50' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default DashboardLayout
