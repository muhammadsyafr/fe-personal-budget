import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await api.login(email, password);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  signup: async (email, password, name) => {
    set({ isLoading: true });
    try {
      const data = await api.register(email, password, name);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  logout: () => {
    api.clearToken();
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }
    try {
      const user = await api.getMe();
      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      api.clearToken();
      set({ user: null, isAuthenticated: false });
      return false;
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      console.log('Updating profile with:', data);
      const user = await api.updateProfile(data);
      console.log('Profile updated:', user);
      set({ user, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  checkBiometric: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
}));

let fetchingTransactions = false;
let fetchingCategories = false;

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  categories: [],
  isLoading: false,
  lastParams: null,
  
  fetchTransactions: async (params = {}) => {
    const key = JSON.stringify(params);
    if (fetchingTransactions && get().lastParams === key) return;
    fetchingTransactions = true;
    set({ isLoading: true, lastParams: key });
    try {
      const transactions = await api.getTransactions(params);
      set({ transactions, isLoading: false });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ isLoading: false });
    } finally {
      fetchingTransactions = false;
    }
  },
  
  fetchCategories: async () => {
    const { categories } = get();
    if (fetchingCategories || categories.length > 0) return;
    fetchingCategories = true;
    try {
      const categories = await api.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      fetchingCategories = false;
    }
  },
  
  addTransaction: async (transaction) => {
    set({ isLoading: true });
    try {
      const apiData = {
        merchantName: transaction.merchant,
        totalAmount: transaction.amount,
        transactionType: transaction.type,
        date: transaction.date,
        categoryId: transaction.categoryId,
      }
      const newTransaction = await api.createTransaction(apiData);
      set(state => ({
        transactions: [newTransaction, ...state.transactions],
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      console.error('Error creating transaction:', error);
      return { success: false, error: error.message };
    }
  },
  
  deleteTransaction: async (id) => {
    try {
      await api.deleteTransaction(id);
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  },
  
  getTotalBalance: () => {
    const { transactions } = get();
    return transactions.reduce((acc, t) => {
      return t.transactionType === 'income' ? acc + t.totalAmount : acc - t.totalAmount;
    }, 0);
  },
  
  getTotalSpending: () => {
    const { transactions } = get();
    return transactions
      .filter(t => t.transactionType === 'spending')
      .reduce((acc, t) => acc + t.totalAmount, 0);
  },
  
  getTotalIncome: () => {
    const { transactions } = get();
    return transactions
      .filter(t => t.transactionType === 'income')
      .reduce((acc, t) => acc + t.totalAmount, 0);
  },
  
  addCategory: async (category) => {
    try {
      const newCategory = await api.createCategory(category);
      set(state => ({
        categories: [...state.categories, newCategory]
      }));
    } catch (error) {
      console.error('Error creating category:', error);
    }
  },
  
  updateCategory: async (id, updates) => {
    try {
      const updated = await api.updateCategory(id, updates);
      set(state => ({
        categories: state.categories.map(cat => 
          cat.id === id ? updated : cat
        )
      }));
    } catch (error) {
      console.error('Error updating category:', error);
    }
  },
  
  deleteCategory: async (id) => {
    try {
      await api.deleteCategory(id);
      set(state => ({
        categories: state.categories.filter(cat => cat.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
}));

export const useFilterStore = create((set) => ({
  selectedCategory: null,
  dateRange: 'this-month',
  searchQuery: '',
  customStartDate: null,
  customEndDate: null,
  
  setCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setDateRange: (range) => set({ dateRange: range, 
    ...(range !== 'custom' ? { customStartDate: null, customEndDate: null } : {}) 
  }),
  setCustomDateRange: (startDate, endDate) => set({ 
    dateRange: 'custom', 
    customStartDate: startDate, 
    customEndDate: endDate 
  }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () => set({ selectedCategory: null, dateRange: 'this-month', searchQuery: '', customStartDate: null, customEndDate: null })
}));
