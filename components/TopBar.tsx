import React from 'react';
import { BookOpen, Bell, ChevronRight, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TopBar: React.FC = () => {
  const { 
    currentView, 
    navigateTo, 
    selectedServiceId, 
    selectedEndpointId, 
    services,
    fetchData,
    status,
    statusMessage,
    clearStatus
  } = useAppContext();

  const getBreadcrumbs = () => {
    const base = (
      <span onClick={() => navigateTo('dashboard')} className="hover:text-slate-800 cursor-pointer">
        Ana Sayfa
      </span>
    );

    if (currentView === 'dashboard') {
        return <>{base} <ChevronRight size={14} className="mx-2 text-slate-300" /> <span className="font-medium text-slate-800">Dashboard</span></>;
    }
    
    if (currentView === 'services') {
        return <>{base} <ChevronRight size={14} className="mx-2 text-slate-300" /> <span className="font-medium text-slate-800">Servis Yönetimi</span></>;
    }

    if (currentView === 'dictionary') {
        return <>{base} <ChevronRight size={14} className="mx-2 text-slate-300" /> <span className="font-medium text-slate-800">Sözlük</span></>;
    }
    
    if (currentView === 'settings') {
        return <>{base} <ChevronRight size={14} className="mx-2 text-slate-300" /> <span className="font-medium text-slate-800">Veri Yönetimi</span></>;
    }

    if (currentView === 'serviceDetail' && selectedServiceId && selectedEndpointId) {
        const service = services.find(s => s.id === selectedServiceId);
        const endpoint = service?.endpoints.find(e => e.id === selectedEndpointId);
        
        return (
            <>
                {base}
                <ChevronRight size={14} className="mx-2 text-slate-300" />
                <span className="hover:text-slate-800 cursor-default">{service?.title || 'Servis'}</span>
                <ChevronRight size={14} className="mx-2 text-slate-300" />
                <span className="font-medium text-slate-800">{endpoint?.name || 'Detay'}</span>
            </>
        );
    }

    return base;
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500">
        {getBreadcrumbs()}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* Status / Refresh */}
        <div className="flex items-center gap-2">
            {statusMessage && (
                <div 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300 cursor-pointer ${status === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`} 
                    onClick={clearStatus}
                >
                    {status === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                    {statusMessage}
                </div>
            )}
            
            <button 
                onClick={fetchData}
                disabled={status === 'loading'}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors disabled:opacity-50"
                title="Verileri Yenile"
            >
               <RefreshCw size={18} className={status === 'loading' ? 'animate-spin' : ''} />
            </button>
        </div>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        <button 
          onClick={() => navigateTo('dictionary')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          <BookOpen size={18} />
          <span>Sözlük</span>
        </button>
        
        <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4"></span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;