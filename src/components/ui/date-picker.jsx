import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const DatePicker = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  
  const date = value ? new Date(value) : new Date()
  const [viewDate, setViewDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1))

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay()

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December']
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const selectedDate = value ? new Date(value) : null

  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const selectDate = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    onChange(newDate.toISOString().split('T')[0])
    setIsOpen(false)
  }

  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && 
      viewDate.getMonth() === today.getMonth() && 
      viewDate.getFullYear() === today.getFullYear()
  }

  const isSelected = (day) => {
    if (!selectedDate) return false
    return day === selectedDate.getDate() && 
      viewDate.getMonth() === selectedDate.getMonth() && 
      viewDate.getFullYear() === selectedDate.getFullYear()
  }

  const formatDisplayDate = () => {
    if (!value) return 'Select date'
    const d = new Date(value)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between gap-2
          h-11 px-4 py-2.5 rounded-xl
          bg-zinc-900/50 border border-zinc-800 
          hover:border-zinc-700 focus:border-zinc-600
          text-sm text-zinc-100 transition-all duration-200
        "
      >
        <span className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-zinc-500" />
          {formatDisplayDate()}
        </span>
        <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="
            absolute top-full left-0 right-0 mt-2 z-50
            bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/30
            p-4
          "
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-zinc-200">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs text-zinc-500 font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all duration-150
                    ${isSelected(day) 
                      ? 'bg-zinc-100 text-zinc-900' 
                      : isToday(day)
                        ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0]
                onChange(today)
                setIsOpen(false)
              }}
              className="flex-1 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                onChange(yesterday.toISOString().split('T')[0])
                setIsOpen(false)
              }}
              className="flex-1 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Yesterday
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DatePicker
