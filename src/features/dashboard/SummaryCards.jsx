import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTransactionStore, useFilterStore } from '@/store/useStore'
import { formatCurrency } from '@/lib/currency'

const SummaryCards = () => {
  const { transactions, getTotalBalance, getTotalIncome, getTotalSpending } = useTransactionStore()
  const { dateRange, customStartDate, customEndDate } = useFilterStore()

  const filteredStats = useMemo(() => {
    let filtered = [...transactions]
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

    const balance = filtered.reduce((acc, t) => {
      return t.transactionType === 'income' ? acc + t.totalAmount : acc - t.totalAmount
    }, 0)

    const income = filtered
      .filter(t => t.transactionType === 'income')
      .reduce((acc, t) => acc + t.totalAmount, 0)

    const spending = filtered
      .filter(t => t.transactionType === 'spending')
      .reduce((acc, t) => acc + t.totalAmount, 0)

    return { balance, income, spending }
  }, [transactions, dateRange, customStartDate, customEndDate])

  const cards = [
    {
      title: 'Total Balance',
      amount: filteredStats.balance,
      icon: Wallet,
      trend: '+12.5%',
      trendUp: true,
      description: 'vs last period',
      gradient: 'from-emerald-500/20 to-emerald-600/5'
    },
    {
      title: 'Income',
      amount: filteredStats.income,
      icon: TrendingUp,
      trend: '+8.2%',
      trendUp: true,
      description: 'vs last period',
      gradient: 'from-violet-500/20 to-violet-600/5'
    },
    {
      title: 'Spending',
      amount: filteredStats.spending,
      icon: TrendingDown,
      trend: '-3.1%',
      trendUp: false,
      description: 'vs last period',
      gradient: 'from-orange-500/20 to-orange-600/5'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.3 }}
        >
          <Card className="p-5 relative overflow-hidden group hover:border-zinc-700/50 transition-all duration-300">
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${
                  card.trendUp 
                    ? 'bg-emerald-500/15 text-emerald-400' 
                    : 'bg-orange-500/15 text-orange-400'
                }`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  card.trendUp ? 'text-emerald-400' : 'text-orange-400'
                }`}>
                  {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.trend}
                </div>
              </div>
              
              <p className="text-sm text-zinc-400 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-zinc-50 tracking-tight">
                {formatCurrency(card.amount)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {card.description}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default SummaryCards
