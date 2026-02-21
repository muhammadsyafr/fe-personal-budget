export const iconMap = {
  'shopping-cart': 'ShoppingCart',
  'coffee': 'Coffee',
  'home': 'Home',
  'dollar-sign': 'DollarSign',
  'film': 'Film',
  'car': 'Car',
  'zap': 'Zap',
  'shopping-bag': 'ShoppingBag',
  'credit-card': 'CreditCard',
  'utensils': 'Utensils',
  'heart': 'Heart',
  'gift': 'Gift'
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName] || 'CreditCard';
};
