
import React, { useState, useEffect } from 'react';
import { HOT_TOPICS_LIST, HotTopic } from '../constants';

type CategoryType = 'Geral' | 'Clínica Médica' | 'Cirurgia Geral' | 'Ginecologia e Obstetrícia' | 'Pediatria' | 'Medicina Preventiva';

const HotTopics: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Geral');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [topics, setTopics] = useState<HotTopic[]>([]);
  const [isManageMode, setIsManageMode] = useState(false);
  
  // Estados para edição/adição
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', area: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({ name: '', area: '', category: 'Clínica Médica' as CategoryType });

  useEffect(() => {
    // Carregar progresso (checks)
    const savedChecks = localStorage.getItem('medstudy_hot_checked');
    if (savedChecks) setCheckedItems(JSON.parse(savedChecks));

    // Carregar temas customizados ou usar os padrões
    const savedTopics = localStorage.getItem('medstudy_custom_hot_topics');
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    } else {
      setTopics(HOT_TOPICS_LIST);
    }
  }, []);

  const saveTopics = (newTopics: HotTopic[]) => {
    setTopics(newTopics);
    localStorage.setItem('medstudy_custom_hot_topics', JSON.stringify(newTopics));
  };

  const toggleCheck = (itemName: string) => {
    if (isManageMode) return;
    const newChecked = { ...checkedItems, [itemName]: !checkedItems[itemName] };
    setCheckedItems(newChecked);
    localStorage.setItem('medstudy_hot_checked', JSON.stringify(newChecked));
  };

  const handleAddTopic = () => {
    if (!newTopicForm.name || !newTopicForm.area) return;
    const newTopic: HotTopic = {
      name: newTopicForm.name,
      area: newTopicForm.area,
      category: newTopicForm.category as any
    };
    saveTopics([...topics, newTopic]);
    setNewTopicForm({ name: '', area: '', category: activeCategory === 'Geral' ? 'Clínica Médica' : activeCategory });
    setShowAddForm(false);
  };

  const handleDeleteTopicFromList = (topic: HotTopic) => {
    const newTopics = topics.filter(t => t !== topic);
    saveTopics(newTopics);
  };

  const startEditFromList = (topic: HotTopic) => {
    const realIndex = topics.findIndex(t => t === topic);
    setEditingIndex(realIndex);
    setEditForm({ name: topic.name, area: topic.area });
  };

  const handleSaveEdit = (realIndex: number) => {
    const newTopics = topics.map((t, i) => {
      if (i === realIndex) {
        return { ...t, name: editForm.name, area: editForm.area };
      }
      return t;
    });
    saveTopics(newTopics);
    setEditingIndex(null);
  };

  const resetToDefault = () => {
    if (confirm("Deseja resetar todos os temas para o padrão do edital? Suas edições serão perdidas.")) {
      saveTopics(HOT_TOPICS_LIST);
    }
  };

  const categories: { id: CategoryType; label: string; icon: string; color: string }[] = [
    { id: 'Geral', label: 'Ver Tudo', icon: '🌐', color: 'slate' },
    { id: 'Clínica Médica', label: 'Clínica', icon: '🩺', color: 'blue' },
    { id: 'Cirurgia Geral', label: 'Cirurgia', icon: '🔪', color: 'red' },
    { id: 'Ginecologia e Obstetrícia', label: 'G.O.', icon: '🤰', color: 'pink' },
    { id: 'Pediatria', label: 'Pedi', icon: '👶', color: 'green' },
    { id: 'Medicina Preventiva', label: 'Prev', icon: '🏥', color: 'indigo' },
  ];

  const filteredTopics = activeCategory === 'Geral' ? topics : topics.filter(t => t.category === activeCategory);
  const completedAllCount = Object.values(checkedItems).filter(Boolean).length;
  const totalAllCount = topics.length;
  const progressPercent = totalAllCount > 0 ? Math.round((completedAllCount / totalAllCount) * 100) : 0;
  
  const categoryTopics = activeCategory === 'Geral' ? topics : filteredTopics;
  const categoryCompletedCount = categoryTopics.filter(t => checkedItems[t.name]).length;

  const getThemeColor = (category?: string) => {
    const cat = category || activeCategory;
    return categories.find(c => c.id === cat)?.color || 'orange';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Estilizado */}
      <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden transition-all duration-700`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-white/10 p-2 rounded-2xl backdrop-blur-md text-3xl border border-white/10">🔥</span>
              <h2 className="text-4xl font-black tracking-tight">CERMAM Hot Topics</h2>
            </div>
            <p className="text-gray-300 font-medium max-w-xl text-lg opacity-90">
              {activeCategory === 'Geral' 
                ? 'Visualização completa de todos os temas de maior recorrência.' 
                : `Temas de maior recorrência histórica em ${activeCategory}.`}
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 min-w-[220px] text-center shadow-inner">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-orange-400">Progresso Geral CERMAM</p>
            <div className="text-4xl font-black mb-1">{progressPercent}%</div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mt-3">
              <div className="bg-orange-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-[10px] mt-2 font-bold text-gray-400">{completedAllCount} de {totalAllCount} temas dominados</p>
          </div>
        </div>
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Toolbar / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 flex-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 gap-1 ${
                activeCategory === cat.id
                  ? `bg-white dark:bg-slate-800 border-${cat.color}-500 shadow-lg scale-105 z-10`
                  : 'bg-gray-50 dark:bg-slate-900 border-transparent text-gray-400 hover:bg-white hover:border-gray-200 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${activeCategory === cat.id ? `text-${cat.color}-600 dark:text-${cat.color}-400` : ''}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsManageMode(!isManageMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              isManageMode 
                ? 'bg-orange-600 border-orange-700 text-white shadow-lg' 
                : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-50'
            }`}
          >
            {isManageMode ? '✅ Salvar Edição' : '✏️ Gerenciar'}
          </button>
          {isManageMode && (
             <button 
              onClick={resetToDefault}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 transition-all"
            >
              🔄 Resetar
            </button>
          )}
        </div>
      </div>

      {/* Add Form (só visível em modo manage) */}
      {isManageMode && !showAddForm && (
        <button 
          onClick={() => {
            setShowAddForm(true);
            setNewTopicForm({...newTopicForm, category: activeCategory === 'Geral' ? 'Clínica Médica' : activeCategory});
          }}
          className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl text-gray-400 font-bold hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all animate-in fade-in"
        >
          + Adicionar Novo Tema à Lista
        </button>
      )}

      {showAddForm && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 p-6 rounded-3xl space-y-4 animate-in slide-in-from-top-4">
          <h4 className="font-bold text-orange-800 dark:text-orange-400 text-sm uppercase">Novo Tema</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Nome do Tema"
              className="px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-900/50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-400"
              value={newTopicForm.name}
              onChange={e => setNewTopicForm({...newTopicForm, name: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Sub-área (ex: CARDIOLOGIA)"
              className="px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-900/50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-400 uppercase text-xs"
              value={newTopicForm.area}
              onChange={e => setNewTopicForm({...newTopicForm, area: e.target.value})}
            />
            <select
              className="px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-900/50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-400 text-xs uppercase font-bold"
              value={newTopicForm.category}
              onChange={e => setNewTopicForm({...newTopicForm, category: e.target.value as CategoryType})}
            >
              {categories.filter(c => c.id !== 'Geral').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancelar</button>
            <button onClick={handleAddTopic} className="px-6 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 shadow-lg shadow-orange-200">Adicionar</button>
          </div>
        </div>
      )}

      {/* List Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl p-8 relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-${getThemeColor()}-50 dark:bg-${getThemeColor()}-900/20 flex items-center justify-center text-2xl`}>
              {categories.find(c => c.id === activeCategory)?.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
                {activeCategory === 'Geral' ? 'Visão Geral do Edital' : activeCategory}
              </h3>
              <p className="text-xs text-gray-400 font-bold">{isManageMode ? 'Modo de Gerenciamento Global' : 'Acompanhamento de Temas Estratégicos'}</p>
            </div>
          </div>
          <div className={`px-4 py-2 bg-${getThemeColor()}-50 dark:bg-${getThemeColor()}-900/20 rounded-xl text-xs font-black text-${getThemeColor()}-600 dark:text-${getThemeColor()}-400 border border-${getThemeColor()}-100 dark:border-${getThemeColor()}-800`}>
            {categoryCompletedCount} / {categoryTopics.length} ITENS
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-3">
          {filteredTopics.map((topic, idx) => {
            const realIdx = topics.findIndex(t => t === topic);
            const isEditing = editingIndex === realIdx;
            const topicColor = getThemeColor(topic.category);

            return (
              <div 
                key={`${topic.name}-${idx}`} 
                onClick={() => toggleCheck(topic.name)}
                className={`break-inside-avoid mb-3 flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group group/item ${
                  checkedItems[topic.name] && !isManageMode
                    ? `bg-${topicColor}-50/30 dark:bg-${topicColor}-900/10 border-${topicColor}-100 dark:border-${topicColor}-800/50 shadow-sm` 
                    : 'bg-gray-50/50 dark:bg-slate-800/30 border-transparent hover:border-gray-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md'
                }`}
              >
                {isEditing ? (
                  <div className="flex-1 space-y-2 animate-in fade-in" onClick={e => e.stopPropagation()}>
                    <input 
                      className="w-full text-xs font-black uppercase text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-800 bg-transparent outline-none p-1"
                      value={editForm.area}
                      onChange={e => setEditForm({...editForm, area: e.target.value})}
                    />
                    <input 
                      className="w-full text-sm font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-slate-700 bg-transparent outline-none p-1"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                    />
                    <div className="flex justify-end gap-1 pt-2">
                      <button onClick={() => setEditingIndex(null)} className="p-1 text-[10px] font-bold text-gray-400">Cancelar</button>
                      <button onClick={() => handleSaveEdit(realIdx)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold">Salvar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {!isManageMode && (
                      <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 ${
                        checkedItems[topic.name] 
                          ? `bg-${topicColor}-600 border-${topicColor}-600 text-white scale-110 shadow-lg shadow-${topicColor}-200 dark:shadow-none` 
                          : 'border-gray-200 dark:border-slate-700 text-transparent group-hover/item:border-gray-400 dark:group-hover/item:border-slate-500'
                      }`}>
                        {checkedItems[topic.name] ? '✓' : ''}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-[9px] font-black transition-all uppercase tracking-tighter ${
                          checkedItems[topic.name] && !isManageMode ? `text-${topicColor}-400 opacity-50` : `text-${topicColor}-600 dark:text-${topicColor}-400`
                        }`}>
                          {topic.area}
                        </p>
                        {activeCategory === 'Geral' && (
                          <span className={`text-[8px] font-black px-1.5 rounded-full bg-${topicColor}-100 dark:bg-${topicColor}-900/30 text-${topicColor}-700 dark:text-${topicColor}-300 border border-${topicColor}-200 dark:border-${topicColor}-800/50 uppercase`}>
                            {topic.category.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-bold leading-tight transition-all ${
                        checkedItems[topic.name] && !isManageMode ? 'text-gray-400 dark:text-slate-600 line-through' : 'text-gray-800 dark:text-slate-200'
                      }`}>
                        {topic.name}
                      </p>
                    </div>
                    {isManageMode && (
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => startEditFromList(topic)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">✏️</button>
                        <button onClick={() => handleDeleteTopicFromList(topic)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">🗑️</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        {filteredTopics.length === 0 && (
          <div className="py-20 text-center text-gray-400 flex flex-col items-center">
            <span className="text-4xl mb-2">📂</span>
            <p className="font-bold">Nenhum tema encontrado.</p>
            <p className="text-xs">Adicione novos temas ou resete para o padrão.</p>
          </div>
        )}
      </div>

      {/* Footer Box */}
      <div className={`rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl transition-all duration-500 bg-gray-900 border-b-8 border-${getThemeColor()}-600`}>
        <div className={`w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-5xl shrink-0 rotate-3 border border-white/10 shadow-2xl`}>
          🎯
        </div>
        <div>
          <h4 className="text-2xl font-black mb-3 italic">Estratégia CERMAM</h4>
          <p className="text-gray-400 leading-relaxed font-medium">
            Esta lista foi construída baseada na incidência histórica. Ao marcar um item, você não apenas concluiu um estudo, mas garantiu pontos preciosos em temas que a banca ama cobrar. Mantenha o foco nos itens vermelhos e azuis!
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/10 text-${getThemeColor()}-400`}>#FocoCermam</span>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/10 text-${getThemeColor()}-400`}># ChecklistGeral</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotTopics;
