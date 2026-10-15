import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Settings, CreditCard, Database, LogOut, Users, RefreshCw } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Дашборд', icon: LayoutDashboard },
  { path: '/orders', label: 'Заказы', icon: ShoppingCart },
  { path: '/catalog', label: 'Каталог', icon: Database },
  { path: '/regions', label: 'Регионы и курсы', icon: Settings },
  { path: '/credentials', label: 'Реквизиты', icon: CreditCard },
];

export const Layout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex">
      <aside className="w-64 bg-[#121418] border-r border-white/10 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0070d1]/20 flex items-center justify-center">
              <span className="text-[#0070d1] font-bold text-lg">PSN</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-[#0070d1]/15 text-[#0070d1] border border-[#0070d1]/30' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Выйти
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};