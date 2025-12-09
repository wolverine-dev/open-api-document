import React, { useState } from 'react';
import { Search, Hexagon, Circle, Settings, Book, LayoutDashboard, Database } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { services, navigateTo, currentView, openServiceDetail, selectedEndpointId } = useAppContext();

  const filteredGroups = services.map(group => ({
    ...group,
    endpoints: group.endpoints.filter(ep => 
      ep.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.endpoints.length > 0 || group.key.toLowerCase().includes(searchTerm.toLowerCase()));

  const navItemClass = (isActive: boolean) => 
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
      isActive 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-20">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 cursor-pointer" onClick={() => navigateTo('dashboard')}>
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Hexagon className="fill-blue-600 text-blue-600" size={24} />
          <span className="text-slate-800">API Portal</span> 
          <span className="text-blue-600">6176</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
          Menü
        </h3>
        <button onClick={() => navigateTo('dashboard')} className={navItemClass(currentView === 'dashboard')}>
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button onClick={() => navigateTo('services')} className={navItemClass(currentView === 'services')}>
          <Settings size={18} />
          Servis Yönetimi
        </button>
        <button onClick={() => navigateTo('dictionary')} className={navItemClass(currentView === 'dictionary')}>
          <Book size={18} />
          Sözlük & Tanımlar
        </button>
         <button onClick={() => navigateTo('settings')} className={navItemClass(currentView === 'settings')}>
          <Database size={18} />
          Veri Yönetimi
        </button>
      </div>

      <div className="border-t border-slate-100 my-2 mx-4"></div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Servis Ara..." 
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Service Links */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 custom-scrollbar">
        {filteredGroups.map((group) => (
          <div key={group.id}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              {group.key}
            </h3>
            <ul className="space-y-1">
              {group.endpoints.map((endpoint) => {
                const isActive = selectedEndpointId === endpoint.id && currentView === 'serviceDetail';
                return (
                  <li key={endpoint.id}>
                    <button
                      onClick={() => openServiceDetail(group.id, endpoint.id)} 
                      className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors group ${
                        isActive ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Circle size={6} className={`transition-colors ${isActive ? 'text-blue-500 fill-blue-500' : 'text-slate-300 group-hover:text-blue-500 group-hover:fill-blue-500'}`} />
                      {endpoint.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-8">
            Sonuç bulunamadı.
          </div>
        )}
      </nav>

      {/* User Profile (Bottom Sticky) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
            TP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">TPORT User</span>
            <span className="text-xs text-slate-500">Geliştirici</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;