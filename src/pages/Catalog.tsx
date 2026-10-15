import React, { useState } from 'react';
import { useGames, useCreateGame, useUpdateGame, useSyncGames } from '../hooks/useApi';
import { Plus, Edit2, Trash2, RefreshCw, Loader2, Search, Filter, Save, X } from 'lucide-react';

export const Catalog: React.FC = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ search: '', autoSynced: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState<any | null>(null);
  const [formData, setFormData] = useState(initialForm());

  const { data, isLoading, refetch } = useGames(page, 20, filters);
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const syncGames = useSyncGames();

  function initialForm() {
    return {
      id: '',
      title: '',
      publisher: '',
      platforms: ['PS5'],
      ruLocalization: 'subtitles',
      coverUrl: '',
      heroUrl: '',
      discount: 0,
      shelfTags: ['latest'],
      editions: [{ name: 'Standard Edition', prices: { TR: 0, UA: 0, PL: 0, IN: 0 } }],
      isAutoSynced: false,
    };
  }

  const resetForm = () => {
    setFormData(initialForm());
    setEditingGame(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (game: any) => {
    setFormData({ ...game, editions: game.editions || initialForm().editions });
    setEditingGame(game);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (editingGame) {
      await updateGame.mutateAsync({ id: editingGame.id, data: formData });
    } else {
      await createGame.mutateAsync(formData);
    }
    setShowModal(false);
    refetch();
  };

  const handleEditionsChange = (editions: any[]) => {
    setFormData(prev => ({ ...prev, editions }));
  };

  const addEdition = () => {
    setFormData(prev => ({ ...prev, editions: [...prev.editions, { name: '', prices: { TR: 0, UA: 0, PL: 0, IN: 0 } }] }));
  };

  const removeEdition = (idx: number) => {
    setFormData(prev => ({ ...prev, editions: prev.editions.filter((_, i) => i !== idx) }));
  };

  if (isLoading && !data) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070d1]" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Каталог игр</h1>
          <p className="text-white/50 text-sm mt-1">Управление играми, ценками и изданиями</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { syncGames.mutate(); refetch(); }} disabled={syncGames.isPending} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${syncGames.isPending ? 'animate-spin' : ''}`} />
            Синхронизировать бестселлеры
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0070d1] hover:bg-[#005fb3] text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Добавить игру
          </button>
        </div>
      </div>

      <div className="bg-[#121418] border border-white/10 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value, page: 0 }))}
              className="w-full bg-black/30 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]"
            />
          </div>
          <select value={filters.autoSynced} onChange={e => setFilters(prev => ({ ...prev, autoSynced: e.target.value, page: 0 }))} className="bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1] w-auto">
            <option value="">Все</option>
            <option value="true">Авто (парсер)</option>
            <option value="false">Ручные</option>
          </select>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070d1]" /></div>
      ) : (
        <div className="bg-[#121418] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                  <th className="p-4">Обложка</th>
                  <th className="p-4">Название</th>
                  <th className="p-4">Издатель</th>
                  <th className="p-4">Платформы</th>
                  <th className="p-4">Скидка</th>
                  <th className="p-4">Цены (TR/UA/PL/IN)</th>
                  <th className="p-4">Тип</th>
                  <th className="p-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data?.games.map(game => (
                  <tr key={game.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <img src={game.coverUrl} alt={game.title} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                    </td>
                    <td className="p-4 font-medium text-white max-w-xs truncate">{game.title}</td>
                    <td className="p-4 text-white/60 text-sm">{game.publisher}</td>
                    <td className="p-4">
                      {game.platforms.map(p => <span key={p} className="px-1.5 py-0.5 text-[10px] font-bold bg-white/5 text-white rounded border border-white/10 mr-1">{p}</span>)}
                    </td>
                    <td className="p-4">
                      {game.discount > 0 ? <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-black rounded">-{game.discount}%</span> : <span className="text-white/40 text-sm">—</span>}
                    </td>
                    <td className="p-4 text-white/60 text-sm font-mono">
                      TR: {(game.editions[0]?.prices?.TR || 0).toLocaleString()} / UA: {(game.editions[0]?.prices?.UA || 0).toLocaleString()} / PL: {(game.editions[0]?.prices?.PL || 0).toLocaleString()} / IN: {(game.editions[0]?.prices?.IN || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${game.isAutoSynced ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {game.isAutoSynced ? 'Авто' : 'Ручная'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(game)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm('Удалить игру?')) { /* delete logic */ } }} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= data.pages - 1} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121418] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">{editingGame ? 'Редактировать игру' : 'Новая игра'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-white/60 text-sm block">ID (уникальный)</label><input value={formData.id} onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))} className="w-full bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]" /></div>
                <div className="space-y-2"><label className="text-white/60 text-sm block">Название</label><input value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-white/60 text-sm block">Издатель</label><input value={formData.publisher} onChange={e => setFormData(prev => ({ ...prev, publisher: e.target.value }))} className="w-full bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]" /></div>
                <div className="space-y-2"><label className="text-white/60 text-sm block">Русификация</label><select value={formData.ruLocalization} onChange={e => setFormData(prev => ({ ...prev, ruLocalization: e.target.value }))} className="w-full bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]"><option value="full">Полностью на русском</option><option value="subtitles">Русские субтитры</option><option value="none">Английский</option></select></div>
              </div>

              <div className="space-y-2"><label className="text-white/60 text-sm block">Платформы</label><div className="flex gap-2">{['PS5', 'PS4'].map(p => <label key={p} className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={formData.platforms.includes(p)} onChange={e => setFormData(prev => ({ ...prev, platforms: e.target.checked ? [...prev.platforms, p] : prev.platforms.filter(x => x !== p) }))} className="w-4 h-4 rounded border-white/30 bg-black/30 text-[#0070d1] focus:ring-[#0070d1]" />{p}</label>)}</div></div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-white/60 text-sm block">Обложка (URL)</label><input value={formData.coverUrl} onChange={e => setFormData(prev => ({ ...prev, coverUrl: e.target.value }))} className="w-full bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]" /></div>
                <div className="space-y-2"><label className="text-white/60 text-sm block">Hero баннер (URL)</label><input value={formData.heroUrl} onChange={e => setFormData(prev => ({ ...prev, heroUrl: e.target.value }))} className="w-full bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-white/60 text-sm block">Скидка %</label><input type="number" value={formData.discount} onChange={e => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) }))} className="w-full bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]" /></div>
                <div className="space-y-2"><label className="text-white/60 text-sm block">Теги полки</label><select value={formData.shelfTags.join(',')} onChange={e => setFormData(prev => ({ ...prev, shelfTags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="w-full bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]"><option value="latest">latest</option><option value="deals">deals</option><option value="collections">collections</option><option value="subscriptions">subscriptions</option></select></div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">Издания</h3>
                  <button onClick={addEdition} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"><Plus className="w-3 h-3" /> Добавить издание</button>
                </div>
                {formData.editions.map((ed: any, idx: number) => (
                  <div key={idx} className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">Издание #{idx + 1}</h4>
                      <button onClick={() => removeEdition(idx)} className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-white/60 text-sm block">Название издания</label><input value={ed.name} onChange={e => handleEditionsChange(formData.editions.map((x: any, i: number) => i === idx ? { ...x, name: e.target.value } : x))} className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {['TR', 'UA', 'PL', 'IN'].map(region => (
                        <div key={region} className="space-y-2">
                          <label className="text-white/60 text-sm block">{region} цена</label>
                          <input type="number" value={ed.prices?.[region] || 0} onChange={e => handleEditionsChange(formData.editions.map((x: any, i: number) => i === idx ? { ...x, prices: { ...x.prices, [region]: parseInt(e.target.value) } } : x))} className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm outline-none focus:border-[#0070d1]" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors">Отмена</button>
              <button onClick={handleSubmit} disabled={createGame.isPending || updateGame.isPending} className="px-6 py-2.5 rounded-xl bg-[#0070d1] hover:bg-[#005fb3] text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                {createGame.isPending || updateGame.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingGame ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};