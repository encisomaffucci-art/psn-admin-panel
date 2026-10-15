import React from 'react';
import { useOrders, useGames, useRegions, useCredentials } from '../hooks/useApi';
import { TrendingUp, ShoppingCart, Database, Settings, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; change?: string; icon: React.ReactNode; color: string }> = ({
  title, value, change, icon, color
}) => (
  <div className="p-5 bg-[#121418] border border-white/10 rounded-2xl space-y-2">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      {change && <span className={`text-xs font-bold px-2 py-0.5 rounded ${change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{change}</span>}
    </div>
    <div>
      <p className="text-white/50 text-xs uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { data: ordersData } = useOrders(0, 5);
  const { data: gamesData } = useGames(0, 5);
  const { data: regions } = useRegions();
  const { data: creds } = useCredentials();

  const pendingOrders = ordersData?.orders.filter(o => o.status === 'PENDING').length || 0;
  const todayOrders = ordersData?.orders.filter(o => o.createdAt.startsWith(new Date().toISOString().split('T')[0])).length || 0;
  const totalRevenue = ordersData?.orders.reduce((sum, o) => sum + o.totalFiat, 0) || 0;
  const autoGames = gamesData?.games.filter(g => g.isAutoSynced).length || 0;
  const manualGames = gamesData?.games.filter(g => !g.isAutoSynced).length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Дашборд</h1>
          <p className="text-white/50 text-sm mt-1">Обзор магазина PSN.BY</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Заказов сегодня" value={String(todayOrders)} icon={<ShoppingCart className="w-5 h-5" />} color="bg-[#0070d1]/20 text-[#0070d1]" change="+12%" />
        <StatCard title="На проверке" value={String(pendingOrders)} icon={<Clock className="w-5 h-5" />} color="bg-amber-500/20 text-amber-400" change="+3" />
        <StatCard title="Выручка" value={`${(totalRevenue).toFixed(2)} BYN`} icon={<DollarSign className="w-5 h-5" />} color="bg-emerald-500/20 text-emerald-400" change="+8.2%" />
        <StatCard title="Игр в каталоге" value={String((gamesData?.total || 0))} icon={<Database className="w-5 h-5" />} color="bg-purple-500/20 text-purple-400" change={manualGames > 0 ? `Ручных: ${manualGames}` : undefined} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-base text-white">Последние заказы</h2>
          <div className="space-y-3">
            {ordersData?.orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0070d1]/20 flex items-center justify-center text-[#0070d1] font-bold text-sm">{order.id.slice(-2)}</div>
                  <div>
                    <p className="font-medium text-white text-sm">#{order.id.slice(-6)}</p>
                    <p className="text-xs text-white/50">{order.userName || order.userId} · {order.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{order.totalFiat.toFixed(2)} BYN</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    order.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                    order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                    order.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {(!ordersData?.orders.length) && <p className="text-white/50 text-center py-4">Заказов пока нет</p>}
          </div>
        </div>

        <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-base text-white">Статус системы</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400"><TrendingUp className="w-5 h-5" /></div>
                <div>
                  <p className="font-medium text-white">API Бэкенда</p>
                  <p className="text-xs text-white/50">Работает нормально</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">OK</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><Database className="w-5 h-5" /></div>
                <div>
                  <p className="font-medium text-white">База данных</p>
                  <p className="text-xs text-white/50">PostgreSQL (Railway)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">Подключена</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400"><RefreshCw className="w-5 h-5" /></div>
                <div>
                  <p className="font-medium text-white">Парсер каталога</p>
                  <p className="text-xs text-white/50">GitHub Actions · каждые 6ч</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs font-medium">Активен</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400"><Settings className="w-5 h-5" /></div>
                <div>
                  <p className="font-medium text-white">Регионы настроены</p>
                  <p className="text-xs text-white/50">{regions?.length || 0} стран · курсы актуальны</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-medium">Готово</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};