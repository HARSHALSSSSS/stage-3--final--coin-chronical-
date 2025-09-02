const API_BASE_URL = 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Transaction API functions
export const transactionAPI = {
  // Get all transactions
  getAll: () => apiRequest('/transactions'),
  
  // Get transaction by ID
  getById: (id: string) => apiRequest(`/transactions/${id}`),
  
  // Create new transaction
  create: (transaction: Omit<Transaction, 'id'>) => 
    apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),
  
  // Update transaction
  update: (id: string, transaction: Partial<Transaction>) => 
    apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    }),
  
  // Delete transaction
  delete: (id: string) => 
    apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    }),
  
  // Get transactions by category
  getByCategory: (category: string) => 
    apiRequest(`/transactions/category/${category}`),
  
  // Get transactions by type
  getByType: (type: 'income' | 'expense') => 
    apiRequest(`/transactions/type/${type}`),
  
  // Get monthly summary
  getMonthlySummary: (year: number, month: number) => 
    apiRequest(`/transactions/summary/monthly?year=${year}&month=${month}`),
};

// Budget API functions
export const budgetAPI = {
  // Get all budgets
  getAll: () => apiRequest('/budgets'),
  
  // Get budget by ID
  getById: (id: string) => apiRequest(`/budgets/${id}`),
  
  // Create new budget
  create: (budget: Omit<Budget, 'id'>) => 
    apiRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    }),
  
  // Update budget
  update: (id: string, budget: Partial<Budget>) => 
    apiRequest(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget),
    }),
  
  // Delete budget
  delete: (id: string) => 
    apiRequest(`/budgets/${id}`, {
      method: 'DELETE',
    }),
  
  // Toggle budget active status
  toggleActive: (id: string) => 
    apiRequest(`/budgets/${id}/toggle`, {
      method: 'PATCH',
    }),
  
  // Get active budgets only
  getActive: () => apiRequest('/budgets/active/only'),
  
  // Get budget by category
  getByCategory: (category: string) => 
    apiRequest(`/budgets/category/${category}`),
};

// Health check
export const healthCheck = () => apiRequest('/health');

// Export types for use in components
export interface Transaction {
  _id?: string;
  id?: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date | string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  _id?: string;
  id?: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  color: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
} 