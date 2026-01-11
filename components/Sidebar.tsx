
import React, { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabLabels: Record<string, string>;
  onUpdateLabel: (id: string, newLabel: string) => void;
  isDarkMode: boolean;
  appName: string;
  appSubtitle: string;
  onUpdateAppName: (name: string) => void;
  onUpdateAppSubtitle: (subtitle: string) => void;
  primaryColor: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  tabLabels, 
  onUpdateLabel, 
  isDarkMode,
  appName,
  appSubtitle,
  onUpdateAppName,
  onUpdateAppSubtitle,
  primaryColor
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState('');
  
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);

  const tabs = [
    { id: 'dashboard', icon: '📊' },
    { id: 'schedule', icon: '📅' },
    { id: 'hot-topics', icon: '🔥' },
    { id: 'topics', icon: '📚' },
    { id: 'flashcards', icon: '🃏' },
    { id: 'edital', icon: '📂' },
    { id: 'videos', icon: '📺' },
    { id: 'exams', icon: '🎯' },
    { id: 'summaries', icon: '📝' },
    { id: 'notes', icon: '📒' },
    { id: 'assistant', icon: '🤖' },
    { id: 'portal', icon: '🌐' },
  ];

  const startEditing = (e: React.MouseEvent, id: string, label: string) => {
    e.stopPropagation();
    setEditingId(id);
    setTempLabel(label);
  };

  const saveLabel = (id: string) => {
    if (tempLabel.trim()) {
      onUpdateLabel(id, tempLabel.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-r border-gray-100 dark:border-slate-800 h-full hidden md:flex flex-col z-20 transition-colors duration-500">
      <div className="p-6">
        <div className="group relative">
          {isEditingBrand ? (
            <input 
              autoFocus
              className={`text-2xl font-bold text-${primaryColor}-600 dark:text-${primaryColor}-400 bg-gray-50 dark:bg-slate-800 outline-none w-full rounded-lg px-2`}
              value={appName}
              onChange={(e) => onUpdateAppName(e.target.value)}
              onBlur={() => setIsEditingBrand(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingBrand(false)}
            />
          ) : (
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl font-black text-${primaryColor}-600 dark:text-${primaryColor}-400 flex items-center gap-2 truncate`}>
                <span>🩺</span> {appName}
              </h1>
              <button 
                onClick={() => setIsEditingBrand(true)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-blue-500 transition-opacity"
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        <div className="group relative mt-1">
          {isEditingSubtitle ? (
            <input 
              autoFocus
              className="text-xs text-gray-500 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 outline-none w-full rounded px-2"
              value={appSubtitle}
              onChange={(e) => onUpdateAppSubtitle(e.target.value)}
              onBlur={() => setIsEditingSubtitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingSubtitle(false)}
            />
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-widest font-black truncate">
                {appSubtitle}
              </p>
              <button 
                onClick={() => setIsEditingSubtitle(true)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-300 hover:text-gray-600 transition-opacity"
              >
                ✏️
              </button>
            </div>
          )}
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
        {tabs.map((tab) => (
          <div key={tab.id} className="group relative">
            {editingId === tab.id ? (
              <div className={`flex items-center gap-2 px-4 py-3 bg-${primaryColor}-50 dark:bg-${primaryColor}-900/30 rounded-xl`}>
                <span className="text-lg">{tab.icon}</span>
                <input 
                  autoFocus
                  type="text"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                  onBlur={() => saveLabel(tab.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveLabel(tab.id)}
                  className={`bg-white dark:bg-slate-800 border-none focus:ring-1 focus:ring-${primaryColor}-400 rounded px-1 py-0.5 text-sm w-full font-medium dark:text-white`}
                />
              </div>
            ) : (
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
                  activeTab === tab.id
                    ? `bg-${primaryColor}-600 text-white shadow-lg shadow-${primaryColor}-200 dark:shadow-${primaryColor}-900/20`
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="text-lg shrink-0">{tab.icon}</span>
                <span className="text-left leading-tight flex-1 truncate">{tabLabels[tab.id] || tab.id}</span>
                <button 
                  onClick={(e) => startEditing(e, tab.id, tabLabels[tab.id])}
                  className={`p-1 transition-opacity ${
                    activeTab === tab.id 
                    ? 'opacity-60 hover:opacity-100 text-white' 
                    : `opacity-0 group-hover:opacity-100 text-gray-400 hover:text-${primaryColor}-600 dark:hover:text-${primaryColor}-400`
                  }`}
                  title="Renomear"
                >
                  ✏️
                </button>
              </button>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/30 transition-colors">
        <div className="bg-orange-50/80 dark:bg-orange-900/20 backdrop-blur-sm rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30 shadow-inner text-center">
          <p className="text-[10px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest mb-1">Status Prova</p>
          <p className="text-xs font-bold text-gray-800 dark:text-slate-200 italic">Organize seus Editais</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
