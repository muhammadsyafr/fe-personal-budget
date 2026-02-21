import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, ShoppingCart, Coffee, Home, DollarSign, Film, Car, Zap, ShoppingBag, CreditCard, Utensils, Heart, Gift, Plane, Bookmark, CircleDollarSign, Wallet, ScanLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DatePicker from '@/components/ui/date-picker'
import { useTransactionStore } from '@/store/useStore'

const formatAmount = (value) => {
  const numericValue = value.replace(/[^0-9]/g, '')
  if (!numericValue) return ''
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const unformatAmount = (value) => {
  return value.replace(/[^0-9]/g, '')
}

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

const AddTransactionModal = ({ isOpen, onClose, editTransaction = null, onOpenScanner = null }) => {
  const { categories, addTransaction, isLoading } = useTransactionStore()
  
  const [formData, setFormData] = useState({
    merchant: '',
    amount: '',
    type: 'spending',
    categoryId: 1,
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        merchant: editTransaction.merchant,
        amount: formatAmount(editTransaction.amount.toString()),
        type: editTransaction.type,
        categoryId: editTransaction.categoryId,
        date: editTransaction.date
      })
    } else {
      setFormData({
        merchant: '',
        amount: '',
        type: 'spending',
        categoryId: 1,
        date: new Date().toISOString().split('T')[0]
      })
    }
  }, [editTransaction, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addTransaction({
      ...formData,
      amount: parseFloat(unformatAmount(formData.amount))
    })
    onClose()
  }

  const handleChange = (field, value) => {
    if (field === 'amount') {
      setFormData(prev => ({ ...prev, [field]: formatAmount(value) }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="
              fixed inset-x-0 bottom-0 z-50
              bg-zinc-950 border-t border-zinc-800
              rounded-t-3xl max-h-[90vh] overflow-y-auto
            "
          >
            <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-zinc-100">
                {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Type Toggle */}
              <div className="flex gap-2.5">
                {['spending', 'income'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('type', type)}
                    className={`
                      flex-1 py-3.5 rounded-xl font-medium capitalize transition-all duration-200
                      ${formData.type === type 
                        ? type === 'spending' 
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Merchant */}
              <div className="space-y-2">
                <Label htmlFor="merchant" className="text-zinc-300">Merchant</Label>
                <Input
                  id="merchant"
                  value={formData.merchant}
                  onChange={(e) => handleChange('merchant', e.target.value)}
                  placeholder="Enter merchant name"
                  className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 focus:border-zinc-600"
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-zinc-300">Amount (IDR)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">Rp</span>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="numeric"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="0"
                    className="pl-10 bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 focus:border-zinc-600"
                    required
                  />
                </div>
                {onOpenScanner && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onOpenScanner()
                    }}
                    className="mt-2 w-full py-2.5 flex items-center justify-center gap-2 text-sm text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <ScanLine className="w-4 h-4" />
                    Scan Receipt
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2.5">
                <Label className="text-zinc-300">Category</Label>
                <div className={`grid grid-cols-3 gap-2 ${categories.length > 3 ? 'max-h-48 overflow-y-auto pr-1' : ''}`}>
                  {categories.map(cat => {
                    const Icon = iconMap[cat.icon] || DollarSign
                    const isSelected = formData.categoryId === cat.id
                    
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleChange('categoryId', cat.id)}
                        className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap
                transition-all duration-200 border
                ${isSelected 
                  ? 'bg-zinc-100 border-zinc-100 text-zinc-900' 
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900/80'
                }
              `}
                      >
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: isSelected ? '#18181b' : cat.color }} 
                        />
                        <span 
                          className="text-sm text-center truncate w-full"
                          style={{ color: isSelected ? '#18181b' : '#71717a' }}
                        >
                          {cat.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Date</Label>
                <DatePicker
                  value={formData.date}
                  onChange={(date) => handleChange('date', date)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11.5 bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/70 hover:border-zinc-700"
                  icon={Camera}
                  onClick={() => {
                    if (onOpenScanner) {
                      onClose()
                      onOpenScanner()
                    }
                  }}
                >
                  Scan Receipt
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11.5"
                  loading={isLoading}
                >
                  {editTransaction ? 'Update' : 'Add'} Transaction
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddTransactionModal
