
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.your-domain.com/api' 
  : 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Authentication interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    return apiClient.post('/auth/logout/');
  },
  register: (userData: any) => apiClient.post('/auth/register/', userData),
  getCurrentUser: () => apiClient.get('/profile/current/'),
};

export const stockService = {
  getAllStocks: () => apiClient.get('/stocks/'),
  getStock: (symbol: string) => apiClient.get(`/stocks/${symbol}/`),
  getTopGainers: () => apiClient.get('/stocks/top_gainers/'),
  getTopLosers: () => apiClient.get('/stocks/top_losers/'),
  getHistoricalData: (symbol: string, timeframe: string) => 
    apiClient.get(`/stocks/${symbol}/historical_data/?timeframe=${timeframe}`),
};

export const marketService = {
  getIndices: () => apiClient.get('/indices/'),
};

export const portfolioService = {
  getPortfolio: () => apiClient.get('/portfolio/'),
  getPortfolioSummary: (portfolioId: number) => apiClient.get(`/portfolio/${portfolioId}/summary/`),
};

export const orderService = {
  getOrders: () => apiClient.get('/orders/'),
  createOrder: (orderData: any) => apiClient.post('/orders/', orderData),
  cancelOrder: (orderId: number) => apiClient.post(`/orders/${orderId}/cancel/`),
};

export const watchlistService = {
  getWatchlists: () => apiClient.get('/watchlists/'),
  getWatchlist: (id: number) => apiClient.get(`/watchlists/${id}/`),
  createWatchlist: (data: any) => apiClient.post('/watchlists/', data),
  updateWatchlist: (id: number, data: any) => apiClient.put(`/watchlists/${id}/`, data),
  deleteWatchlist: (id: number) => apiClient.delete(`/watchlists/${id}/`),
};
