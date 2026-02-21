import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { useFilterStore } from '../../store/useStore';

const dateRanges = [
  { id: 'today', label: 'Today' },
  { id: 'this-week', label: 'This Week' },
  { id: 'this-month', label: 'This Month' },
  { id: 'this-year', label: 'This Year' },
  { id: 'custom', label: 'Custom' }
];

const DateRangeFilter = () => {
  const { dateRange, setDateRange, customStartDate, customEndDate, setCustomDateRange } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentRange = dateRanges.find(r => r.id === dateRange);

  const handleCustomDateChange = (field, value) => {
    if (field === 'start') {
      setCustomDateRange(value, customEndDate);
    } else {
      setCustomDateRange(customStartDate, value);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-4 py-2.5 
          bg-slate-800/50 border border-slate-700/50 rounded-xl
          text-sm font-medium text-slate-300
          hover:border-slate-600 transition-colors
        "
      >
        <Calendar className="w-4 h-4 text-slate-400" />
        <span>
          {dateRange === 'custom' && customStartDate && customEndDate 
            ? `${new Date(customStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(customEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : currentRange?.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            absolute top-full mt-2 left-0
            bg-slate-800 border border-slate-700 rounded-xl 
            shadow-xl shadow-black/20 overflow-hidden z-50
            min-w-[200px]
          "
        >
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => {
                setDateRange(range.id);
                if (range.id !== 'custom') {
                  setIsOpen(false);
                }
              }}
              className={`
                w-full px-4 py-2.5 text-left text-sm
                transition-colors flex items-center justify-between
                ${dateRange === range.id 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'text-slate-300 hover:bg-slate-700/50'
                }
              `}
            >
              {range.label}
              {range.id === 'custom' && <span className="text-xs opacity-60">→</span>}
            </button>
          ))}
          
          {dateRange === 'custom' && (
            <div className="p-3 border-t border-slate-700 space-y-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate || ''}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate || ''}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200"
                />
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={() => setIsOpen(false)}
              >
                Apply
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

import { Button } from '@/components/ui/button';

export default DateRangeFilter;
