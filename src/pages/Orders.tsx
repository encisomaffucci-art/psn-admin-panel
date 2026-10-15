import React, { useState } from 'react';
import { useOrders, useUpdateOrder } from '../hooks/useApi';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, Edit, RefreshCw } from 'lucide-react';

export const Orders: React.FC = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ status: '', region: '', search: '' });
  const { data, isLoading, refetch } = useOrders(page, 20, filters);
  const updateOrder = useUpdateOrder();

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-500/20 text-amber-400',
    CONFIRMED: 'bg-blue-500/20 text-blue-400',
    COMPLETED: 'bg-emerald-500/20 text-emerald-400',
    REJECTED: 'bg-red-500/20 text-red-400',
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (status === 'COMPLETED') {
      const codes = prompt('Введите коды пополнения (через пробел или новой строкой):');
      if (!codes) return;
      await updateOrder.mutateAsync({ id, data: { status, adminNote: codes } });
      refetch();
    } else if (status === 'REJECTED') {
      const reason = prompt('Введите причину отказа:');
      if (!reason) return;
      await updateOrder.mutateAsync({ id, data: { status, adminNote: reason } });
      refetch();
    } else {
      await updateOrder.mutateAsync({ id, data: { status } });
      refetch();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Заказы</h1>
          <p className="text-white/50 text-sm mt-1">Управление заказами и выдача кодов</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
      </div>

      <div className="bg-[#121418] border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Поиск по ID, пользователю, телефону..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value, page: 0 }))}
              className="w-full bg-black/30 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]"
            />
          </div>
          <select value={filters.status} onChange={e => setFilters(prev => ({ ...prev, status: e.target.value, page: 0 }))} className="bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1] w-auto">
            <option value="">Все статусы</option>
            <option value="PENDING">На проверке</option>
            <option value="CONFIRMED">Подтверждено</option>
            <option value="COMPLETED">Выдано</option>
            <option value="REJECTED">Отклонено</option>
          </select>
          <select value={filters.region} onChange={e => setFilters(prev => ({ ...prev, region: e.target.value, page: 0 }))} className="bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1] w-auto">
            <option value="">Все регионы</option>
            <option value="TR">🇹🇷 Турция</option>
            <option value="UA">🇺🇦 Украина</option>
            <option value="PL">🇵🇱 Польша</option>
            <option value="IN">🇮🇳 Индия</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070d1]" /></div>
      ) : (
        <div className="bg-[#121418] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Пользователь</th>
                  <th className="p-4">Состав</th>
                  <th className="p-4">Сумма</th>
                  <th className="p-4">Регион</th>
                  <th className="p-4">Способ</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Дата</th>
                  <th className="p-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data?.orders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm text-white/70">#{order.id.slice(-6)}</td>
                    <td className="p-4">
                      <p className="font-medium text-white">{order.userName || order.userId}</p>
                      <p className="text-xs text-white/50">{order.items.length} позиций</p>
                    </td>
                    <td className="p-4 text-white/70 text-sm max-w-xs truncate">
                      {order.items.map(i => `${i.editionName || i.gameId} x${i.quantity}`).join(', ')}
                    </td>
                    <td className="p-4 font-mono text-white">{order.totalFiat.toFixed(2)} {order.currency}</td>
                    <td className="p-4 text-white/70">{order.region}</td>
                    <td className="p-4 text-white/70">{order.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/60 text-sm">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleStatusChange(order.id, 'COMPLETED')} disabled={order.status !== 'PENDING' || updateOrder.isPending} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Выдать
                        </button>
                        <button onClick={() => handleStatusChange(order.id, 'REJECTED')} disabled={order.status !== 'PENDING' || updateOrder.isPending} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Отклонить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && data.pages > 1 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-white/50 text-sm">Страница {page + 1} из {data.pages} · Всего: {data.total}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= data.pages - 1} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};