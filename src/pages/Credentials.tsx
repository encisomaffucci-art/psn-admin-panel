import React, { useState } from 'react';
import { useCredentials, useUpdateCredentials } from '../hooks/useApi';
import { Save, Edit2, Check, X, CreditCard, FileText, Wallet } from 'lucide-react';

export const Credentials: React.FC = () => {
  const { data: creds, isLoading, refetch } = useCredentials();
  const updateCreds = useUpdateCredentials();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ cardNumber: '', eripPath: '', usdtAddress: '' });

  const startEdit = () => {
    setEditing(true);
    setFormData({ cardNumber: creds?.cardNumber || '', eripPath: creds?.eripPath || '', usdtAddress: creds?.usdtAddress || '' });
  };

  const saveEdit = async () => {
    await updateCreds.mutateAsync(formData);
    setEditing(false);
    refetch();
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormData({ cardNumber: '', eripPath: '', usdtAddress: '' });
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070d1]" /></div>;

  const fields = [
    { key: 'cardNumber', label: 'Номер карты (BYN)', icon: CreditCard, placeholder: '9112 3849 1029 4810', type: 'text' },
    { key: 'eripPath', label: 'Путь в ЕРИП', icon: FileText, placeholder: 'Банковские, финансовые услуги → Банки, НКФО → Пополнение счета', type: 'text' },
    { key: 'usdtAddress', label: 'USDT (TRC-20) адрес', icon: Wallet, placeholder: 'TX9kP2wL9vQ8mN4xR7sT1cB5zH3jF6gK9L', type: 'text' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Реквизиты оплаты</h1>
          <p className="text-white/50 text-sm mt-1">Настройка способов оплаты для клиентов</p>
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <button onClick={saveEdit} disabled={updateCreds.isPending} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 flex items-center gap-2"><Check className="w-4 h-4" /> Сохранить</button>
            <button onClick={cancelEdit} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 flex items-center gap-2"><X className="w-4 h-4" /> Отмена</button>
          </div>
        ) : (
          <button onClick={startEdit} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium border border-white/10 transition-colors flex items-center gap-2"><Edit2 className="w-4 h-4" /> Изменить</button>
        )}
      </div>

      <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 space-y-6">
        {fields.map(field => (
          <div key={field.key} className="space-y-2">
            <label className="flex items-center gap-2 text-white/60 text-sm font-medium">
              <field.icon className="w-4 h-4 text-white/50" />
              {field.label}
            </label>
            {editing ? (
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key]}
                onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-xl text-white text-sm outline-none focus:border-[#0070d1] font-mono"
              />
            ) : (
              <div className="bg-black/30 border border-white/10 px-4 py-3 rounded-xl text-white/70 text-sm font-mono select-all min-h-[48px] flex items-center">
                {formData[field.key] || creds?.[field.key] || <span className="text-white/40 italic">Не задано</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#121418] border border-white/10 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-3">Инструкция для клиентов</h3>
        <div className="space-y-2 text-sm text-white/60">
          <p>• <b>Карта BYN</b> — перевод с карты на карту (Белкарт, Visa, Mastercard белорусских банков)</p>
          <p>• <b>ЕРИП</b> — оплата через интернет-банкинг или М-банкинг без комиссии</p>
          <p>• <b>USDT TRC-20</b> — перевод в сети Tron, быстрый и с низкой комиссией</p>
        </div>
      </div>
    </div>
  );
};