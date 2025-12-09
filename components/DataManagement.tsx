import React from 'react';
import { Database, FileJson, Link2, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DataManagement: React.FC = () => {
  const { 
      services, 
      dictionary, 
      apiSettings, 
      updateApiSettings, 
      fetchData 
  } = useAppContext();

  const handleDownloadBackup = () => {
      const data = { services, dictionary, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `api-portal-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Veri Yönetimi & Ayarlar</h2>
        <p className="text-slate-500 mt-1">
          API bağlantı ayarları ve yedekleme işlemleri.
        </p>
      </div>

      {/* --- API Configuration --- */}
      <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
        <div className="bg-blue-50/50 p-6 border-b border-blue-100 flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded text-white"><Link2 size={20} /></div>
            <div>
                <h3 className="text-lg font-bold text-slate-800">API Bağlantısı</h3>
                <p className="text-sm text-slate-500">
                Verilerin okunacağı ve yazılacağı .NET API adresini yapılandırın.
                </p>
            </div>
        </div>

        <div className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Base URL</label>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        className="flex-1 border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none border transition-all"
                        placeholder="http://localhost:5000/api"
                        value={apiSettings.baseUrl}
                        onChange={e => updateApiSettings({...apiSettings, baseUrl: e.target.value})}
                    />
                    <button 
                        onClick={fetchData} 
                        className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                        Bağlantıyı Test Et & Yenile
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                    Uygulama bu adresteki <code>/services</code> ve <code>/dictionary</code> endpoint'lerini kullanacaktır.
                </p>
            </div>
        </div>
      </div>

      <div className="border-t border-slate-200 my-8"></div>

      {/* Local Backup */}
      <h3 className="font-bold text-slate-700 mb-4">Veri Yedekleme</h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
              <h4 className="font-medium text-slate-800">Mevcut Veriyi İndir</h4>
              <p className="text-sm text-slate-500">Olası veri kayıplarına karşı geçerli veriyi JSON formatında saklayın.</p>
          </div>
          <button onClick={handleDownloadBackup} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm border border-slate-200">
            <FileJson size={16} /> JSON Olarak İndir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;