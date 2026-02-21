const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const OCR_SERVICE_API_URL = import.meta.env.VITE_OCR_SERVICE_API_URL || 'http://localhost:8000'

const getToken = () => localStorage.getItem('token')

export const api = {
  setToken(token) {
    localStorage.setItem('token', token)
  },

  clearToken() {
    localStorage.removeItem('token')
  },

  async ocrProcess(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${OCR_SERVICE_API_URL}/v1/ocr/process`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'OCR processing failed')
    }

    return response.json()
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    if (data.token) {
      this.setToken(data.token)
    }
    return data
  },

  async register(email, password, name) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    if (data.token) {
      this.setToken(data.token)
    }
    return data
  },

  async getMe() {
    const token = getToken()
    if (!token) {
      throw new Error('No token found')
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      this.clearToken()
      throw new Error('Failed to fetch user')
    }

    return response.json()
  },

  async updateProfile(data) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        avatarUrl: data.avatarUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update profile')
    }

    return response.json()
  },

  async getTransactions(params = {}) {
    const token = getToken()
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/api/transactions?${queryString}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
      } : {},
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }
    
    return response.json()
  },

  async createTransaction(data) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        merchantName: data.merchantName,
        totalAmount: data.totalAmount,
        transactionType: data.transactionType || 'spending',
        date: data.date,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create transaction')
    }

    return response.json()
  },

  async updateTransaction(id, data) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        merchantName: data.merchantName,
        totalAmount: data.totalAmount,
        transactionType: data.transactionType,
        date: data.date,
        categoryId: data.categoryId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update transaction')
    }

    return response.json()
  },

  async deleteTransaction(id) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
      method: 'DELETE',
      headers: token ? {
        'Authorization': `Bearer ${token}`,
      } : {},
    })

    if (!response.ok) {
      throw new Error('Failed to delete transaction')
    }

    return response.json()
  },

  async getCategories() {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
      } : {},
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    
    return response.json()
  },

  async createCategory(data) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        name: data.name,
        icon: data.icon,
        color: data.color,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create category')
    }

    return response.json()
  },

  async updateCategory(id, data) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        name: data.name,
        icon: data.icon,
        color: data.color,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update category')
    }

    return response.json()
  },

  async deleteCategory(id) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: token ? {
        'Authorization': `Bearer ${token}`,
      } : {},
    })

    if (!response.ok) {
      throw new Error('Failed to delete category')
    }

    return response.json()
  },
}

export default api
