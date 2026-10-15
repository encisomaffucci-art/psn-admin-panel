import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Game, RegionConfig, PaymentCredentials, Order, OrdersResponse, GamesResponse } from '../api/client';

export const useRegions = () => useQuery({
  queryKey: ['regions'],
  queryFn: async () => (await api.get<RegionConfig[]>('/api/admin/regions')).data,
});

export const useUpdateRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: Partial<RegionConfig> }) => api.patch(`/api/admin/regions/${code}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['regions'] }),
  });
};

export const useCredentials = () => useQuery({
  queryKey: ['credentials'],
  queryFn: async () => (await api.get<PaymentCredentials>('/api/admin/credentials')).data,
});

export const useUpdateCredentials = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PaymentCredentials>) => api.patch('/api/admin/credentials', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['credentials'] }),
  });
};

export const useOrders = (page = 0, limit = 20, filters: { status?: string; region?: string } = {}) => useQuery({
  queryKey: ['orders', page, limit, filters],
  queryFn: async () => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    return (await api.get<OrdersResponse>(`/api/admin/orders?${params}`)).data;
  },
});

export const useUpdateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; adminNote?: string } }) => api.patch(`/api/admin/orders/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useGames = (page = 0, limit = 20, filters: { search?: string; autoSynced?: boolean } = {}) => useQuery({
  queryKey: ['games', page, limit, filters],
  queryFn: async () => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    return (await api.get<GamesResponse>(`/api/admin/games?${params}`)).data;
  },
});

export const useCreateGame = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Game>) => api.post('/api/admin/games', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['games'] }),
  });
};

export const useUpdateGame = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Game> }) => api.patch(`/api/admin/games/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['games'] }),
  });
};

export const useSyncGames = () => useMutation({
  mutationFn: () => api.post('/api/admin/games/sync'),
});