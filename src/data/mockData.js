export const MOCK_CATEGORIES = [
  { id: 1, name: 'Groceries', icon: 'shopping-cart', color: '#10B981' },
  { id: 2, name: 'Dining Out', icon: 'coffee', color: '#F59E0B' },
  { id: 3, name: 'Rent', icon: 'home', color: '#3B82F6' },
  { id: 4, name: 'Salary', icon: 'dollar-sign', color: '#8B5CF6' },
  { id: 5, name: 'Entertainment', icon: 'film', color: '#EC4899' },
  { id: 6, name: 'Transportation', icon: 'car', color: '#06B6D4' },
  { id: 7, name: 'Utilities', icon: 'zap', color: '#EF4444' },
  { id: 8, name: 'Shopping', icon: 'shopping-bag', color: '#F97316' }
];

export const MOCK_TRANSACTIONS = [
  {
    id: 't1',
    merchant: 'Whole Foods Market',
    amount: 1500000,
    type: 'spending',
    categoryId: 1,
    date: '2026-02-20',
    image_url: null
  },
  {
    id: 't2',
    merchant: 'Monthly Salary',
    amount: 15000000,
    type: 'income',
    categoryId: 4,
    date: '2026-02-01',
    image_url: null
  },
  {
    id: 't3',
    merchant: 'Starbucks',
    amount: 45000,
    type: 'spending',
    categoryId: 2,
    date: '2026-02-19',
    image_url: null
  },
  {
    id: 't4',
    merchant: 'Netflix Subscription',
    amount: 199000,
    type: 'spending',
    categoryId: 5,
    date: '2026-02-15',
    image_url: null
  },
  {
    id: 't5',
    merchant: 'Uber Ride',
    amount: 85000,
    type: 'spending',
    categoryId: 6,
    date: '2026-02-18',
    image_url: null
  },
  {
    id: 't6',
    merchant: 'Electric Bill',
    amount: 350000,
    type: 'spending',
    categoryId: 7,
    date: '2026-02-10',
    image_url: null
  },
  {
    id: 't7',
    merchant: 'Tokopedia Purchase',
    amount: 250000,
    type: 'spending',
    categoryId: 8,
    date: '2026-02-17',
    image_url: null
  },
  {
    id: 't8',
    merchant: 'Freelance Payment',
    amount: 5000000,
    type: 'income',
    categoryId: 4,
    date: '2026-02-12',
    image_url: null
  },
  {
    id: 't9',
    merchant: 'Trader Joe\'s',
    amount: 950000,
    type: 'spending',
    categoryId: 1,
    date: '2026-02-16',
    image_url: null
  },
  {
    id: 't10',
    merchant: 'Local Restaurant',
    amount: 175000,
    type: 'spending',
    categoryId: 2,
    date: '2026-02-14',
    image_url: null
  }
];

export const MOCK_USER = {
  id: 'u1',
  email: 'admin@test.com',
  name: 'John Doe',
  avatar: null,
  balance: 19450000
};
