import React, { useState } from 'react';
import { useRegions, useUpdateRegion } from '../hooks/useApi';
import { Save, Edit2, Check, X } from 'lucide-react';

export const Regions: React.FC = () => {
  const { data: regions, isLoading, refetch } = useRegions();
  const updateRegion = useUpdateRegion();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const startEdit = (region: any) => {
    setEditing(region.code);
    setFormData({ rateToBYN: region.rateToBYN, denominations: region.denominations });
  };

  const saveEdit = async (code: string) => {
    await updateRegion.mutateAsync({ code, data: { rateToBYN: formData.rateToBYN, denominations: formData.denominations } });
    setEditing(null);
    refetch();
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({});
  };

  const toggleDenom = (denoms: any[], val: number) => {
    const updated = denoms.map(d => d.val === val ? { ...d, active: !d.active } : d);
    setFormData(prev => ({ ...prev, denominations: updated }));
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070d1]" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Регионы и курсы</h1>
        <p className="text-white/50 text-sm mt-1">Настройка курсов валют к BYN и доступных номиналов карт</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {regions?.map(region => (
          <div key={region.code} className="bg-[#121418] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{region.flag}</span>
                <div>
                  <h2 className="font-bold text-lg text-white">{region.name} ({region.code})</h2>
                  <p className="text-white/50 text-sm">{region.currencyCode} — {region.symbol}</p>
                </div>
              </div>
              {editing === region.code ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => saveEdit(region.code)} disabled={updateRegion.isPending} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 flex items-center gap-1"><Check className="w-3 h-3" /> Сохранить</button>
                  <button onClick={cancelEdit} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 flex items-center gap-1"><X className="w-3 h-3" /> Отмена</button>
                </div>
              ) : (
                <button onClick={() => startEdit(region)} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1"><Edit2 className="w-3 h-3" /> Изменить</button>
              )}
            </div>

            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Курс к BYN</span>
                {editing === region.code ? (
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.rateToBYN}
                    onChange={e => setFormData(prev => ({ ...prev, rateToBYN: parseFloat(e.target.value) }))}
                    className="w-32 bg-black/30 border border-white/10 px-3 py-2 rounded-lg text-white text-sm outline-none focus:border-[#0070d1] text-right"
                  />
                ) : (
                  <span className="font-mono text-white text-sm">{region.rateToBYN} BYN за 1 {region.currencyCode}</span>
                )}
              </div>

              <div>
                <span className="text-white/60 text-sm block mb-2">Доступные номиналы карт</span>
                <div className="flex flex-wrap gap-2">
                  {region.denominations.map((d: any) => (
                    <button
                      key={d.val}
                      onClick={() => editing === region.code && toggleDenom(formData.denominations || region.denominations, d.val)}
                      disabled={editing !== region.code}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        (editing === region.code ? formData.denominations : region.denominations).find((x: any) => x.val === d.val)?.active
                          ? 'border-[#0070d1] bg-[#0070d1]/20 text-white'
                          : 'border-white/10 bg-black/40 text-white/30 line-through'
                      }`}
                    >
                      {d.val}{region.symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};