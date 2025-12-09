import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, ChevronDown, Check, User, FileText, Megaphone, Calculator, CreditCard, Users, Server, Database, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ServiceGroup, Endpoint } from '../types';

// Icon picker component
const IconOption = ({ name, icon: Icon, selected, onClick }: any) => (
  <div 
    onClick={() => onClick(name)}
    className={`p-2 rounded-lg cursor-pointer border flex flex-col items-center gap-1 transition-all ${selected ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
  >
    <Icon size={20} />
    <span className="text-[10px] font-medium">{name}</span>
  </div>
);

const ServiceManager: React.FC = () => {
  const { services, addService, updateService, deleteService, status } = useAppContext();
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialFormState: ServiceGroup = {
    id: '',
    title: '',
    key: '',
    iconName: 'Server',
    description: '',
    endpoints: []
  };
  const [formData, setFormData] = useState<ServiceGroup>(initialFormState);
  const [endpointInput, setEndpointInput] = useState('');

  const handleEdit = (service: ServiceGroup) => {
    setFormData(service);
    setEditingId(service.id);
    setViewState('form');
  };

  const handleCreate = () => {
    setFormData({ ...initialFormState, id: '' }); // ID will be handled by backend usually, but for now we might send empty
    setEditingId(null);
    setViewState('form');
  };

  const handleSave = async () => {
    if (!formData.title || !formData.key) {
      alert("Lütfen başlık ve key alanlarını doldurunuz.");
      return;
    }

    // Temporary ID generation if new, though backend should handle real ID
    const serviceToSave = editingId ? formData : { ...formData, id: formData.id || Date.now().toString() };

    if (editingId) {
      await updateService(serviceToSave);
    } else {
      await addService(serviceToSave);
    }
    setViewState('list');
  };

  const addEndpoint = () => {
    if (!endpointInput.trim()) return;
    const newEndpoint: Endpoint = {
      id: Date.now().toString(),
      name: endpointInput.trim(),
      method: 'GET',
      path: '',
      description: '',
      requestParams: [],
      responseFields: []
    };
    setFormData({
      ...formData,
      endpoints: [...formData.endpoints, newEndpoint]
    });
    setEndpointInput('');
  };

  const removeEndpoint = (id: string) => {
    setFormData({
      ...formData,
      endpoints: formData.endpoints.filter(ep => ep.id !== id)
    });
  };

  const isLoading = status === 'loading';

  // Render List View
  if (viewState === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Servis Yönetimi</h2>
            <p className="text-slate-500">Mevcut servisleri düzenleyin veya yenisini ekleyin.</p>
          </div>
          <button 
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} /> Yeni Servis Grubu
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {services.map(service => (
            <div key={service.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 border border-slate-100">
                  {/* We render a generic icon if dynamic mapping is tricky, but here we can try basic mapping */}
                  <div className="font-bold text-xs">{service.iconName.substring(0,2)}</div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{service.title}</h3>
                  <div className="text-sm text-slate-500 flex gap-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-slate-600">{service.key}</span>
                    <span>{service.endpoints.length} Endpoint</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(service)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={20} />
                </button>
                <button onClick={async () => { if(window.confirm('Silmek istediğinize emin misiniz?')) await deleteService(service.id)}} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Form View
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{editingId ? 'Servisi Düzenle' : 'Yeni Servis Ekle'}</h2>
        <button onClick={() => setViewState('list')} className="text-slate-500 hover:text-slate-800">İptal</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-8">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grup Başlığı</label>
                <input 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
                  placeholder="Örn: Müşteri İşlemleri"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dahili Anahtar (KEY)</label>
                <input 
                  value={formData.key}
                  onChange={e => setFormData({...formData, key: e.target.value.toUpperCase()})}
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border font-mono"
                  placeholder="Örn: CUSTOMER_OPS"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">İkon Seçimi</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { n: 'User', i: User }, { n: 'FileText', i: FileText }, 
                  { n: 'Megaphone', i: Megaphone }, { n: 'Calculator', i: Calculator },
                  { n: 'CreditCard', i: CreditCard }, { n: 'Users', i: Users },
                  { n: 'Server', i: Server }, { n: 'Database', i: Database },
                  { n: 'Activity', i: Activity }
                ].map((opt) => (
                  <IconOption 
                    key={opt.n} 
                    name={opt.n} 
                    icon={opt.i} 
                    selected={formData.iconName === opt.n}
                    onClick={(n: any) => setFormData({...formData, iconName: n})}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Endpoints */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Endpoint Listesi</h3>
            
            <div className="flex gap-2">
              <input 
                value={endpointInput}
                onChange={e => setEndpointInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEndpoint()}
                placeholder="Endpoint adı yazın (Örn: GetCustomerById)"
                className="flex-1 border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border font-mono text-sm"
              />
              <button 
                onClick={addEndpoint}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium"
              >
                Ekle
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg border border-slate-200 min-h-[100px] p-2 space-y-2">
              {formData.endpoints.length === 0 && (
                <div className="text-center text-slate-400 py-8 text-sm">Henüz endpoint eklenmedi.</div>
              )}
              {formData.endpoints.map(ep => (
                <div key={ep.id} className="bg-white p-3 rounded border border-slate-200 flex justify-between items-center text-sm shadow-sm">
                  <span className="font-mono text-blue-700">{ep.name}</span>
                  <button onClick={() => removeEndpoint(ep.id)} className="text-slate-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
        
        {/* Footer Actions */}
        <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={() => setViewState('list')} className="px-5 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-white hover:shadow-sm transition-all">İptal</button>
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 hover:shadow shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;