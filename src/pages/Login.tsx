import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) return;
    // Wait for Telegram WebApp script to load
    const checkScript = setInterval(() => {
      if ((window as any).Telegram?.LoginWidget) {
        clearInterval(checkScript);
        initWidget();
      }
    }, 100);
    return () => clearInterval(checkScript);
  }, [isAuthenticated]);

  const initWidget = () => {
    if (!widgetRef.current) return;
    (window as any).Telegram.LoginWidget?.('widget_ref', {
      auth_url: '/api/admin/auth/telegram',
      request_access: 'write',
      onAuth: async (user: any) => {
        setLoading(true);
        try {
          await login(user);
        } catch (e) {
          console.error('Login failed:', e);
          setLoading(false);
        }
      },
    });
  };

  if (isAuthenticated) return <div className="min-h-screen flex items-center justify-center"><CheckCircle className="w-12 h-12 text-emerald-400 animate-spin" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e14] px-4">
      <div className="w-full max-w-md p-8 bg-[#121418] border border-white/10 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0070d1]/20 flex items-center justify-center">
            <span className="text-[#0070d1] font-bold text-3xl">PSN</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Admin Panel</h1>
          <p className="text-white/50 text-sm">Войдите через Telegram для доступа к панели управления</p>
        </div>

        <div ref={widgetRef} id="widget_ref" className="w-full" />

        {loading && (
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Авторизация...</span>
          </div>
        )}

        <div className="text-center text-xs text-white/40 pt-4 border-t border-white/10">
          Доступ только для администратора магазина
        </div>
      </div>
    </div>
  );
};