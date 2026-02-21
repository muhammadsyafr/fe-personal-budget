import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Coffee, Home, DollarSign, Film, Car, Zap, ShoppingBag, CreditCard, Utensils, Heart, Gift, Plane, Bookmark, CircleDollarSign, Wallet, Trash2, Edit3, Search, Filter, Calendar, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTransactionStore, useFilterStore } from '@/store/useStore'
import { formatCurrency } from '@/lib/currency'

const iconMap = {
  'shopping-cart': ShoppingCart,
  'coffee': Coffee,
  'home': Home,
  'dollar-sign': DollarSign,
  'film': Film,
  'car': Car,
  'zap': Zap,
  'shopping-bag': ShoppingBag,
  'credit-card': CreditCard,
  'utensils': Utensils,
  'heart': Heart,
  'gift': Gift,
  'plane': Plane,
  'bookmark': Bookmark,
  'dollar-circle': CircleDollarSign,
  'wallet': Wallet
}

const HistoryScreen = ({ onEdit }) => {
  const { transactions, categories, deleteTransaction } = useTransactionStore()
  const { selectedCategory, dateRange, searchQuery, customStartDate, customEndDate, setCategory, clearFilters } = useFilterStore()
  const [showFilters, setShowFilters] = useState(false)

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]
    
    if (selectedCategory) {
      filtered = filtered.filter(t => t.categoryId === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.merchantName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    const now = new Date()
    filtered = filtered.filter(t => {
      const txDate = new Date(t.date)
      switch (dateRange) {
        case 'today':
          return txDate.toDateString() === now.toDateString()
        case 'this-week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return txDate >= weekAgo
        }
        case 'this-month': {
          return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
        }
        case 'this-year': {
          return txDate.getFullYear() === now.getFullYear()
        }
        case 'custom': {
          if (customStartDate && customEndDate) {
            const start = new Date(customStartDate)
            const end = new Date(customEndDate)
            end.setHours(23, 59, 59, 999)
            return txDate >= start && txDate <= end
          }
          return true
        }
        default:
          return true
      }
    })

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, selectedCategory, dateRange, searchQuery, customStartDate, customEndDate])

  const groupedByDate = useMemo(() => {
    const groups = {}
    filteredTransactions.forEach(t => {
      const dateKey = t.date ? new Date(t.date).toISOString().split('T')[0] : 'unknown'
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(t)
    })
    return groups
  }, [filteredTransactions])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    deleteTransaction(id)
  }

  const hasActiveFilters = selectedCategory || dateRange !== 'this-month' || searchQuery

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">Transaction History</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl ${hasActiveFilters ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-900/60 border border-zinc-800/50 text-zinc-400'} transition-all`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Category</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setCategory(null)}
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                    !selectedCategory 
                      ? 'bg-zinc-100 text-zinc-900' 
                      : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-zinc-100 text-zinc-900' 
                        : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Date Range</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['today', 'this-week', 'this-month', 'this-year'].map(range => (
                  <button
                    key={range}
                    onClick={() => useFilterStore.getState().setDateRange(range)}
                    className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                      dateRange === range 
                        ? 'bg-zinc-100 text-zinc-900' 
                        : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {range.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-zinc-500 hover:text-zinc-300"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-zinc-500">
        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
      </p>

      {/* Transaction List */}
      {Object.keys(groupedByDate).length === 0 ? (
        <Card className="p-12 text-center border-zinc-800/50 bg-zinc-900/30">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-1">
            No transactions found
          </h3>
          <p className="text-sm text-zinc-500">
            {hasActiveFilters ? 'Try adjusting your filters' : 'Add your first transaction to get started'}
          </p>
        </Card>
      ) : (
        Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-zinc-500 mb-3">
              {formatDate(date)}
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {items.map((transaction, index) => {
                  const category = categories.find(c => c.id === transaction.categoryId)
                  const Icon = iconMap[category?.icon] || DollarSign
                  const isIncome = transaction.transactionType === 'income'

                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      onClick={() => onEdit?.(transaction)}
                      className="
                        group flex items-center gap-3.5 p-3.5 
                        bg-zinc-900/40 border border-zinc-800/50 rounded-2xl
                        hover:border-zinc-700/70 hover:bg-zinc-900/60 
                        cursor-pointer transition-all duration-200
                      "
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                        style={{ 
                          backgroundColor: isIncome 
                            ? 'rgba(16, 185, 129, 0.12)' 
                            : `${category?.color}12`
                        }}
                      >
                        <Icon 
                          className="w-5 h-5" 
                          style={{ 
                            color: isIncome ? '#34d399' : category?.color 
                          }} 
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-100 truncate">
                          {transaction.merchantName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={isIncome ? 'success' : 'secondary'} className="text-[10px] px-1.5 py-0">
                            {category?.name}
                          </Badge>
                          <span className="text-xs text-zinc-600">
                            {new Date(transaction.date).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${
                          isIncome 
                            ? 'text-emerald-400' 
                            : 'text-zinc-100'
                        }`}>
                          {isIncome ? '+' : '-'}{formatCurrency(transaction.totalAmount)}
                        </p>
                      </div>

                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDelete(transaction.id, e)}
                        className="
                          p-2 rounded-xl opacity-0 group-hover:opacity-100
                          text-zinc-600 hover:text-red-400
                          hover:bg-red-500/10
                          transition-all duration-200
                        "
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default HistoryScreen
