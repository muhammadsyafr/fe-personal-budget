import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  ChevronLeft,
  ShoppingCart, 
  Coffee, 
  Home, 
  DollarSign, 
  Film, 
  Car, 
  Zap, 
  ShoppingBag,
  CreditCard,
  Utensils,
  Heart,
  Gift,
  Plane,
  Bookmark,
  CircleDollarSign,
  Wallet,
  Camera,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTransactionStore, useAuthStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

const iconOptions = [
  { icon: 'shopping-cart', component: ShoppingCart, label: 'Shopping Cart' },
  { icon: 'coffee', component: Coffee, label: 'Coffee' },
  { icon: 'home', component: Home, label: 'Home' },
  { icon: 'dollar-sign', component: DollarSign, label: 'Money' },
  { icon: 'film', component: Film, label: 'Entertainment' },
  { icon: 'car', component: Car, label: 'Transportation' },
  { icon: 'zap', component: Zap, label: 'Utilities' },
  { icon: 'shopping-bag', component: ShoppingBag, label: 'Shopping' },
  { icon: 'credit-card', component: CreditCard, label: 'Card' },
  { icon: 'utensils', component: Utensils, label: 'Food' },
  { icon: 'heart', component: Heart, label: 'Health' },
  { icon: 'gift', component: Gift, label: 'Gift' },
  { icon: 'plane', component: Plane, label: 'Travel' },
  { icon: 'bookmark', component: Bookmark, label: 'Education' },
  { icon: 'dollar-circle', component: CircleDollarSign, label: 'Finance' },
  { icon: 'wallet', component: Wallet, label: 'Wallet' },
]

const getIconComponent = (iconName) => {
  const found = iconOptions.find(opt => opt.icon === iconName)
  return found ? found.component : DollarSign
}

const SettingsScreen = ({ onBack }) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTransactionStore()
  const { user, updateProfile, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('categories')
  const [editingCategory, setEditingCategory] = useState(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: 'shopping-cart',
    color: '#10B981'
  })
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    avatarUrl: user?.avatarUrl || ''
  })
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null)
  const fileInputRef = useRef(null)

  const colorOptions = [
    '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', 
    '#06B6D4', '#EF4444', '#F97316', '#84CC16', '#6366F1'
  ]

  const handleAddCategory = () => {
    if (!formData.name.trim()) return
    
    const newCategory = {
      id: Date.now(),
      name: formData.name,
      icon: formData.icon,
      color: formData.color
    }
    
    addCategory(newCategory)
    setFormData({ name: '', icon: 'shopping-cart', color: '#10B981' })
    setIsAddingCategory(false)
  }

  const handleUpdateCategory = () => {
    if (!formData.name.trim() || !editingCategory) return
    
    updateCategory(editingCategory.id, {
      name: formData.name,
      icon: formData.icon,
      color: formData.color
    })
    
    setFormData({ name: '', icon: 'shopping-cart', color: '#10B981' })
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id) => {
    deleteCategory(id)
  }

  const startEdit = (category) => {
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color
    })
    setEditingCategory(category)
    setIsAddingCategory(false)
  }

  const startAdd = () => {
    setFormData({ name: '', icon: 'shopping-cart', color: '#10B981' })
    setEditingCategory(null)
    setIsAddingCategory(true)
  }

  const cancelForm = () => {
    setFormData({ name: '', icon: 'shopping-cart', color: '#10B981' })
    setEditingCategory(null)
    setIsAddingCategory(false)
  }

  const [uploadError, setUploadError] = useState(null)

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const MAX_SIZE = 500 * 1024 // 500KB
    
    if (file.size > MAX_SIZE) {
      setUploadError('Image must be less than 500KB')
      setTimeout(() => setUploadError(null), 3000)
      return
    }

    setUploadError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
      setProfileData(prev => ({ ...prev, avatarUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    const result = await updateProfile(profileData)
    if (result.success) {
      setIsEditingProfile(false)
    }
  }

  const handleSignOut = () => {
    logout()
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-zinc-100">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 pb-28">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-zinc-900/50 rounded-xl">
          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
              activeTab === 'categories' 
                ? 'bg-zinc-800 text-zinc-100' 
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
              activeTab === 'account' 
                ? 'bg-zinc-800 text-zinc-100' 
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            Account
          </button>
        </div>

        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-400">Manage Categories</h2>
              <Button size="sm" onClick={startAdd} className="h-9">
                <Plus className="w-4 h-4 mr-1.5" />
                Add
              </Button>
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
              {(isAddingCategory || editingCategory) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Category name"
                        className="bg-zinc-900/50 border-zinc-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-300">Icon</Label>
                      <div className="flex flex-wrap gap-2">
                        {iconOptions.map(opt => {
                          const Icon = opt.component
                          const isSelected = formData.icon === opt.icon
                          return (
                            <button
                              key={opt.icon}
                              type="button"
                              onClick={() => setFormData({ ...formData, icon: opt.icon })}
                              className={cn(
                                "p-2.5 rounded-xl border transition-all",
                                isSelected 
                                  ? 'bg-zinc-100 border-zinc-100 text-zinc-900' 
                                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-300">Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map(color => {
                          const isSelected = formData.color === color
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setFormData({ ...formData, color })}
                              className={cn(
                                "w-8 h-8 rounded-full border-2 transition-all",
                                isSelected ? 'border-white scale-110' : 'border-transparent'
                              )}
                              style={{ backgroundColor: color }}
                            />
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={cancelForm} className="flex-1">
                        <X className="w-4 h-4 mr-1.5" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={editingCategory ? handleUpdateCategory : handleAddCategory} className="flex-1">
                        <Check className="w-4 h-4 mr-1.5" />
                        {editingCategory ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category List */}
            <div className="space-y-2">
              {categories.map((category, index) => {
                const Icon = getIconComponent(category.icon)
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="
                      flex items-center gap-3 p-3.5 
                      bg-zinc-900/40 border border-zinc-800/50 rounded-2xl
                      hover:border-zinc-700/70 hover:bg-zinc-900/60 
                      transition-all duration-200
                    "
                  >
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: category.color }} />
                    </div>

                    <span className="flex-1 text-sm font-medium text-zinc-200">
                      {category.name}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-4">
            <Card className="p-6">
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-100">Edit Profile</h3>
                    <button
                      onClick={() => {
                        setIsEditingProfile(false)
                        setProfileData({ name: user?.name || '', avatarUrl: user?.avatarUrl || '' })
                        setAvatarPreview(user?.avatarUrl || null)
                      }}
                      className="text-zinc-400 hover:text-zinc-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-zinc-400">
                            {getInitials(profileData.name || user?.name)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 p-1.5 bg-zinc-700 rounded-full text-zinc-200 hover:bg-zinc-600 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">Tap to upload photo (max 500KB)</p>
                    {uploadError && (
                      <p className="text-xs text-red-400 mt-1">{uploadError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Name</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Your name"
                      className="bg-zinc-900/50 border-zinc-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Email</Label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="bg-zinc-900/30 border-zinc-800 text-zinc-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-300 flex items-center justify-center overflow-hidden">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-zinc-900">
                          {getInitials(user?.name)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        {user?.name || 'No name set'}
                      </h3>
                      <p className="text-sm text-zinc-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditingProfile(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-400" onClick={handleSignOut}>
                      <X className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default SettingsScreen
