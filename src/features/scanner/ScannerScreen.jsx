import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Image as ImageIcon, Check, Loader, AlertCircle, Plus, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/store/useStore';
import { api } from '@/lib/api';

const formatAmount = (value) => {
  if (!value) return '';
  const numericValue = value.toString().replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const unformatAmount = (value) => {
  if (!value) return 0;
  return parseFloat(value.toString().replace(/[^0-9]/g, '')) || 0;
}

const ScannerScreen = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState('capture');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const { addTransaction, categories, fetchCategories, addCategory, isLoading } = useTransactionStore();

  useEffect(() => {
    return () => {
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      await addCategory({
        name: newCategoryName.trim(),
        icon: 'shopping-cart',
        color: '#10B981',
      });
      setNewCategoryName('');
      setShowNewCategory(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getCategoryIdFromName = (categoryName) => {
    const category = categories.find(c => 
      c.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    return category?.id || 1;
  };

  const handleCapture = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await processImage(file);
      }
    };
    
    input.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processImage(file);
    }
  };

  const processImage = async (file) => {
    setProcessing(true);
    setError(null);

    try {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      
      const result = await api.ocrProcess(file);
      
      if (result.status === 'success' || result.data) {
        const data = result.data || result;
        
        setOcrData({
          merchant: data.merchant_name || data.merchant || '',
          amount: data.total_amount || data.amount || 0,
          date: data.date || new Date().toISOString().split('T')[0],
          categoryId: getCategoryIdFromName(data.category || ''),
        });
        setStep('review');
      } else {
        setError(result.message || 'Failed to process receipt');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError(err.message || 'Failed to connect to OCR service. Make sure the backend is running.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
      await addTransaction({
        merchant: ocrData.merchant,
        amount: parseFloat(ocrData.amount),
        type: 'spending',
        categoryId: ocrData.categoryId,
        date: ocrData.date,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (field, value) => {
    setOcrData(prev => ({ ...prev, [field]: value }));
  };

  const handleRetry = () => {
    setError(null);
    setOcrData(null);
    setCapturedImage(null);
    setStep('capture');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-zinc-950 z-50 flex flex-col"
      >
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900/80 text-zinc-100 backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="px-4 py-2 rounded-full bg-zinc-900/80 text-zinc-100 text-sm backdrop-blur-sm">
            {step === 'capture' ? 'Scan Receipt' : 'Review Details'}
          </div>
          <div className="w-10" />
        </div>

        {step === 'capture' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-zinc-950" />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-sm aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {processing ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader className="w-12 h-12 text-emerald-400 animate-spin" />
                    <p className="text-zinc-400">Analyzing receipt...</p>
                    <p className="text-zinc-500 text-xs">This may take a few seconds</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center gap-4 px-6 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400" />
                    <p className="text-red-400">{error}</p>
                    <Button variant="outline" onClick={handleRetry} className="mt-2">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <Camera className="w-24 h-24 text-zinc-700" />
                )}
              </div>
              
              {!processing && !error && (
                <div className="absolute inset-0">
                  <div className="absolute top-8 left-8 right-8 bottom-24 border-2 border-dashed border-emerald-500/50 rounded-2xl" />
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-900 to-transparent">
                {!processing && !error && (
                  <>
                    <p className="text-center text-zinc-400 text-sm mb-4">
                      Align receipt within the frame
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Gallery
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleCapture}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Capture
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 p-6 overflow-y-auto"
          >
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-100">Receipt Scanned!</h2>
                <p className="text-zinc-400 text-sm">Review and edit the details below</p>
              </div>

              {capturedImage && (
                <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                  <label className="block text-sm text-zinc-400 mb-2">Receipt Image</label>
                  <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                    <img 
                      src={capturedImage} 
                      alt="Receipt" 
                      className="w-full h-48 object-contain bg-zinc-950"
                    />
                  </div>
                </div>
              )}

              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Merchant</label>
                  <input
                    type="text"
                    value={ocrData?.merchant || ''}
                    onChange={(e) => handleEdit('merchant', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Amount (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={ocrData?.amount ? formatAmount(ocrData.amount.toString()) : ''}
                      onChange={(e) => handleEdit('amount', unformatAmount(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100"
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEdit('amount', (ocrData?.amount || 0) * 1000)}
                    className="mt-2 w-full py-2 text-sm text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    + Add 000
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={ocrData?.date || ''}
                    onChange={(e) => handleEdit('date', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-zinc-400">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(!showNewCategory)}
                      className="text-xs text-emerald-400 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add New
                    </button>
                  </div>
                  
                  {showNewCategory && (
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category name"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                      />
                      <Button size="sm" onClick={handleAddCategory}>
                        Add
                      </Button>
                    </div>
                  )}
                  
                  {categories.length === 0 && !showNewCategory ? (
                    <p className="text-zinc-500 text-sm">No categories. Click "Add New" to create one.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleEdit('categoryId', cat.id)}
                          className={`
                            flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-xs
                            ${ocrData?.categoryId === cat.id 
                              ? 'bg-zinc-100 border-zinc-100 text-zinc-900' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            }
                          `}
                        >
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('capture')}
                >
                  Scan Again
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  loading={isLoading}
                >
                  Save Transaction
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ScannerScreen;
