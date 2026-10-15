import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('admin_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/api/admin/auth/refresh`, {}, {
            headers: { Cookie: `refreshToken=${refreshToken}` },
            withCredentials: true,
          });
          localStorage.setItem('admin_access_token', res.data.accessToken);
          error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api.request(error.config);
        } catch {
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface Game {
  id: string;
  title: string;
  publisher: string;
  platforms: string[];
  ruLocalization: string;
  coverUrl: string;
  heroUrl?: string;
  discount: number;
  shelfTags: string[];
  editions: { name: string; prices: Record<string, number>; oldPrices?: Record<string, number> }[];
  isAutoSynced: boolean;
}

export interface RegionConfig {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  currencyCode: string;
  rateToBYN: number;
  denominations: { val: number; active: boolean }[];
}

export interface PaymentCredentials {
  cardNumber?: string;
  eripPath?: string;
  usdtAddress?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  items: any[];
  totalStore: number;
  totalFiat: number;
  currency: string;
  region: string;
  giftCards: Record<number, number>;
  remainder: number;
  paymentMethod: string;
  receiptFileId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED';
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
}

export interface GamesResponse {
  games: Game[];
  total: number;
  page: number;
  pages: number;
}