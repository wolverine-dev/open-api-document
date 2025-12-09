import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DictionaryItem } from '../types';

const Dictionary: React.FC = () => {
  const { dictionary, addDictionaryItem, updateDictionaryItem, deleteDictionaryItem, status } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Empty form state
  const initialFormState: DictionaryItem = {
    id: '',
    key: '',
    description: '',
    type: 'string'
  };
  const [newItem, setNewItem] = useState<DictionaryItem>(initialFormState);
  const [editItem, setEditItem] = useState<DictionaryItem>(initialFormState);

  const filteredItems = dictionary.filter(item => 
    item.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = status === 'loading';

  const handleAdd = async () => {
    if (!newItem.key || !newItem.description) return;
    await addDictionaryItem({ ...newItem, id: Date.now().toString() }); // Temp ID
    setNewItem(initialFormState);
  };

  const startEdit = (item: DictionaryItem) => {
    setIsEditing(item.id);
    setEditItem(item);
  };

  const handleUpdate = async () => {
    await updateDictionaryItem(editItem);
    setIsEditing(null);
  };

  const typeColors: Record<string, string> = {
    string: 'bg-blue-100 text-blue-700',
    integer: 'bg-purple-100 text-purple-700',
    decimal: 'bg-green-100 text-green-700',
    boolean: 'bg-orange-100 text-orange-700',
    date: 'bg-pink-100 text-pink-700'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sözlük & Alan Tanımları</h2>
          <p className="text-slate-500 mt-1">Servislerde kullanılan alanların standart açıklamaları.</p>
        </div>
      </div>

      {/* Add New Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus size={18} className="text-blue-600" /> Yeni Tanım Ekle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Alan Adı (Key)</label>
            <input
              type="text"
              placeholder="Örn: AccountID"
              className="w-full border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newItem.key}
              onChange={e => setNewItem({ ...newItem, key: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Açıklama</label>
            <input
              type="text"
              placeholder="Alan ne işe yarar?"
              className="w-full border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newItem.description}
              onChange={e => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
             <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Veri Tipi</label>
              <select 
                className="w-full border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 outline-none"
                value={newItem.type}
                onChange={e => setNewItem({ ...newItem, type: e.target.value as any })}
              >
                <option value="string">String</option>
                <option value="integer">Integer</option>
                <option value="decimal">Decimal</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
              </select>
             </div>
             <button 
              onClick={handleAdd}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors h-[38px] mt-auto disabled:opacity-50"
            >
              Ekle
            </button>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
             <input 
               type="text"
               placeholder="Sözlükte ara..."
               className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="text-sm text-slate-500">
            Toplam <strong>{filteredItems.length}</strong> kayıt
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 w-1/4">Alan Adı</th>
              <th className="px-6 py-3 w-1/6">Tip</th>
              <th className="px-6 py-3">Açıklama</th>
              <th className="px-6 py-3 w-24 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                {isEditing === item.id ? (
                  <>
                    <td className="px-6 py-3">
                      <input 
                        value={editItem.key} 
                        onChange={e => setEditItem({...editItem, key: e.target.value})}
                        className="w-full border-slate-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <select 
                        value={editItem.type} 
                        onChange={e => setEditItem({...editItem, type: e.target.value as any})}
                        className="w-full border-slate-300 rounded px-2 py-1 text-sm"
                      >
                         <option value="string">String</option>
                        <option value="integer">Integer</option>
                        <option value="decimal">Decimal</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <input 
                        value={editItem.description} 
                        onChange={e => setEditItem({...editItem, description: e.target.value})}
                        className="w-full border-slate-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={handleUpdate} disabled={isLoading} className="text-green-600 hover:bg-green-50 p-1 rounded"><Save size={16} /></button>
                        <button onClick={() => setIsEditing(null)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-medium text-slate-700">{item.key}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[item.type]}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => startEdit(item)} className="text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                         <button onClick={async () => await deleteDictionaryItem(item.id)} className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
             {filteredItems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dictionary;