import { motion } from 'framer-motion'
import { ShoppingCart, Coffee, Home, DollarSign, Film, Car, Zap, ShoppingBag, CreditCard, Utensils, Heart, Gift, Plane, Bookmark, CircleDollarSign, Wallet } from 'lucide-react'
import { useTransactionStore, useFilterStore } from '@/store/useStore'

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

const CategoryFilter = () => {
  const { categories } = useTransactionStore()
  const { selectedCategory, setCategory, clearFilters } = useFilterStore()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300">
          Categories
        </h3>
        {selectedCategory && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {categories.map((category, index) => {
          const Icon = iconMap[category.icon] || DollarSign
          const isSelected = selectedCategory === category.id

          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => isSelected ? setCategory(null) : setCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap min-w-[140px] justify-start
                transition-all duration-200 border
                ${isSelected 
                  ? 'bg-zinc-100 border-zinc-100 text-zinc-900' 
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900/80'
                }
              `}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ 
                  backgroundColor: isSelected ? '#18181b' : category.color 
                }}
              />
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryFilter
