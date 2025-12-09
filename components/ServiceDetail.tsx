import React, { useState, useEffect } from 'react';
import { Copy, Check, Play, Edit2, X, Plus, Trash2, Save, CornerDownRight, Folder, FileText, Code, ArrowRightLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Endpoint, Parameter, DictionaryItem } from '../types';

// --- Helper Functions outside component to prevent re-renders ---

const updateParamInTree = (params: Parameter[], id: string, updater: (p: Parameter) => Parameter): Parameter[] => {
  return params.map(p => {
    if (p.id === id) return updater(p);
    if (p.children) return { ...p, children: updateParamInTree(p.children, id, updater) };
    return p;
  });
};

const deleteParamInTree = (params: Parameter[], id: string): Parameter[] => {
  return params.filter(p => p.id !== id).map(p => ({
    ...p,
    children: p.children ? deleteParamInTree(p.children, id) : undefined
  }));
};

const addChildParam = (params: Parameter[], parentId: string): Parameter[] => {
  return params.map(p => {
    if (p.id === parentId) {
      const newChild: Parameter = {
        id: Date.now().toString(),
        name: 'NewField',
        type: 'string',
        required: false,
        description: '',
        defaultValue: ''
      };
      return { ...p, children: [...(p.children || []), newChild] };
    }
    if (p.children) return { ...p, children: addChildParam(p.children, parentId) };
    return p;
  });
};

// --- Sub-Components moved outside ---

interface ParamEditorRowProps {
  param: Parameter;
  depth?: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updater: (p: Parameter) => Parameter) => void;
  onAddChild: (parentId: string) => void;
  dictionary: DictionaryItem[];
}

const ParamEditorRow: React.FC<ParamEditorRowProps> = ({ param, depth = 0, onDelete, onUpdate, onAddChild, dictionary }) => {
  const isComplex = param.type === 'object' || param.type === 'array';

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    
    // We calculate the potential updates *before* calling set state to ensure we have the latest dictionary
    let newDescription = param.description;
    let newType = param.type;
    
    // Check if description is effectively empty (or equals the placeholder/default)
    const isDescriptionEmpty = !newDescription || newDescription.trim() === '';
    
    // Only attempt to auto-fill if description is empty and we have a name
    if (isDescriptionEmpty && newName.trim().length > 1) {
      const searchKey = newName.trim().toLowerCase();
      // Find exact match case-insensitive
      const found = dictionary.find(d => d.key.toLowerCase() === searchKey);
      
      if (found) {
        newDescription = found.description;
        // Auto-fill type if it's currently 'string' (default) or matches dictionary type exactly
        if (newType === 'string' || newType === found.type) {
           newType = found.type;
        }
      }
    }

    onUpdate(param.id, (prev) => ({
      ...prev, 
      name: newName,
      description: newDescription,
      type: newType
    }));
  };

  return (
    <div className="relative">
      {/* Indentation Guide Line */}
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 border-l border-slate-200" 
          style={{ left: `${(depth * 24) - 12}px` }} 
        />
      )}

      <div className={`grid grid-cols-12 gap-2 items-center py-2 border-b border-slate-100 hover:bg-slate-50 transition-colors ${depth > 0 ? 'bg-slate-50/30' : ''}`}>
        
        {/* Name & Hierarchy (3 Cols) */}
        <div className="col-span-3 flex items-center gap-2 pl-2 relative">
            <div style={{ marginLeft: `${depth * 24}px` }} className="flex items-center gap-2 w-full">
              {depth > 0 && <CornerDownRight size={14} className="text-slate-300 flex-shrink-0" />}
              {isComplex ? <Folder size={14} className="text-blue-300 flex-shrink-0" /> : <FileText size={14} className="text-slate-300 flex-shrink-0" />}
              <input 
                value={param.name}
                onChange={handleNameChange}
                className="w-full text-sm border-slate-200 rounded px-2 py-1 font-mono text-blue-700 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Alan Adı"
              />
            </div>
        </div>

        {/* Type (2 Cols) */}
        <div className="col-span-2">
          <select
            value={param.type}
            onChange={e => onUpdate(param.id, (p: any) => ({ ...p, type: e.target.value }))}
            className={`w-full text-xs border-slate-200 rounded px-2 py-1 bg-transparent focus:bg-white outline-none cursor-pointer ${isComplex ? 'font-bold text-blue-600' : ''}`}
          >
            <option value="string">String</option>
            <option value="integer">Integer</option>
            <option value="boolean">Boolean</option>
            <option value="decimal">Decimal</option>
            <option value="date">Date</option>
            <option value="object">Object</option>
            <option value="array">Array</option>
          </select>
        </div>

        {/* Required (1 Col) */}
        <div className="col-span-1 flex justify-center">
          <input 
            type="checkbox"
            checked={param.required}
            onChange={e => onUpdate(param.id, (p: any) => ({ ...p, required: e.target.checked }))}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* Default Value (2 Cols) - NEW */}
        <div className="col-span-2">
           <input 
            value={param.defaultValue || ''}
            onChange={e => onUpdate(param.id, (p: any) => ({ ...p, defaultValue: e.target.value }))}
            className="w-full text-xs border-slate-200 rounded px-2 py-1 text-slate-600 bg-transparent focus:bg-white outline-none font-mono"
            placeholder="Varsayılan"
            disabled={isComplex} // Objects/Arrays usually don't have simple defaults
          />
        </div>

        {/* Description (3 Cols) */}
        <div className="col-span-3">
            <input 
            value={param.description}
            onChange={e => onUpdate(param.id, (p: any) => ({ ...p, description: e.target.value }))}
            className="w-full text-xs border-slate-200 rounded px-2 py-1 text-slate-600 bg-transparent focus:bg-white outline-none"
            placeholder="Açıklama"
          />
        </div>

        {/* Actions (1 Col) */}
        <div className="col-span-1 flex justify-end gap-1 pr-2 opacity-60 hover:opacity-100 transition-opacity">
          {isComplex && (
              <button onClick={() => onAddChild(param.id)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" title="Alt Alan Ekle">
                <Plus size={14} />
              </button>
          )}
          <button onClick={() => onDelete(param.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Sil">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Render Children */}
      {param.children && param.children.map((child: any) => (
        <ParamEditorRow 
          key={child.id} 
          param={child} 
          depth={depth + 1} 
          onDelete={onDelete} 
          onUpdate={onUpdate}
          onAddChild={onAddChild}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
};

interface ParamEditorProps {
  listType: 'request' | 'response';
  editEndpoint: Endpoint | null;
  setEditEndpoint: (ep: Endpoint) => void;
  dictionary: DictionaryItem[];
}

const ParamEditor: React.FC<ParamEditorProps> = ({ listType, editEndpoint, setEditEndpoint, dictionary }) => {
  if (!editEndpoint) return null;
  
  const params = listType === 'request' ? editEndpoint.requestParams : editEndpoint.responseFields;
  
  const handleDelete = (id: string) => {
    const newList = deleteParamInTree(params, id);
    const updatedEp = { 
      ...editEndpoint, 
      [listType === 'request' ? 'requestParams' : 'responseFields']: newList 
    };
    setEditEndpoint(updatedEp);
  };

  const handleUpdate = (id: string, updater: any) => {
    const newList = updateParamInTree(params, id, updater);
    const updatedEp = { 
      ...editEndpoint, 
      [listType === 'request' ? 'requestParams' : 'responseFields']: newList 
    };
    setEditEndpoint(updatedEp);
  };

  const handleAddChild = (parentId: string) => {
    const newList = addChildParam(params, parentId);
    const updatedEp = { 
      ...editEndpoint, 
      [listType === 'request' ? 'requestParams' : 'responseFields']: newList 
    };
    setEditEndpoint(updatedEp);
  };

  const addRootParam = () => {
    const newParam: Parameter = {
      id: Date.now().toString(),
      name: 'NewField',
      type: 'string',
      required: false,
      description: '',
      defaultValue: ''
    };
    if (listType === 'request') {
      setEditEndpoint({ ...editEndpoint, requestParams: [...editEndpoint.requestParams, newParam] });
    } else {
      setEditEndpoint({ ...editEndpoint, responseFields: [...editEndpoint.responseFields, newParam] });
    }
  };

  return (
    <div className="border rounded-xl border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 grid grid-cols-12 gap-2 px-2 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-3 pl-4">Alan Adı</div>
        <div className="col-span-2">Tip</div>
        <div className="col-span-1 text-center">Zorunlu</div>
        <div className="col-span-2">Varsayılan</div>
        <div className="col-span-3">Açıklama</div>
        <div className="col-span-1"></div>
      </div>
      <div className="bg-white">
        {params.map(p => (
          <ParamEditorRow 
            key={p.id} 
            param={p} 
            onDelete={handleDelete} 
            onUpdate={handleUpdate}
            onAddChild={handleAddChild}
            dictionary={dictionary}
          />
        ))}
        {params.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">Parametre listesi boş.</div>
        )}
      </div>
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <button onClick={addRootParam} className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
          <Plus size={16} /> Yeni Kök Alan Ekle
        </button>
      </div>
    </div>
  );
};


const ServiceDetail: React.FC = () => {
  const { services, selectedServiceId, selectedEndpointId, updateEndpoint, dictionary } = useAppContext();
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'simulation'>('request');
  const [copied, setCopied] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editEndpoint, setEditEndpoint] = useState<Endpoint | null>(null);

  // Simulation State
  const [simLoading, setSimLoading] = useState(false);
  const [simResponse, setSimResponse] = useState<string | null>(null);
  const [simForm, setSimForm] = useState<Record<string, string>>({});
  const [resultTab, setResultTab] = useState<'response' | 'payload'>('response');

  const service = services.find(s => s.id === selectedServiceId);
  const endpoint = service?.endpoints.find(e => e.id === selectedEndpointId);

  // Helper to extract default values recursively
  const extractDefaultValues = (params: Parameter[]): Record<string, string> => {
    let defaults: Record<string, string> = {};
    params.forEach(p => {
       if (p.defaultValue) {
         defaults[p.id] = p.defaultValue;
       }
       if (p.children) {
         defaults = { ...defaults, ...extractDefaultValues(p.children) };
       }
    });
    return defaults;
  };

  useEffect(() => {
    setSimResponse(null);
    setActiveTab('request');
    setResultTab('response'); // Reset result tab
    setIsEditing(false);
    if (endpoint) {
      setEditEndpoint(JSON.parse(JSON.stringify(endpoint))); // Deep copy
      // Pre-fill simulation form with default values
      setSimForm(extractDefaultValues(endpoint.requestParams));
    } else {
      setSimForm({});
    }
  }, [selectedEndpointId, endpoint]);

  if (!service || !endpoint || !editEndpoint) {
    return <div className="text-center py-20 text-slate-400">Servis bulunamadı.</div>;
  }

  // --- Handlers ---

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(endpoint.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (selectedServiceId && editEndpoint) {
      updateEndpoint(selectedServiceId, editEndpoint);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditEndpoint(JSON.parse(JSON.stringify(endpoint))); // Revert
    setIsEditing(false);
  };

  // --- Simulation Logic ---

  // Build Request JSON from Flat Form Data + Tree Structure
  const buildRequestJson = (params: Parameter[]): any => {
    const result: any = {};
    params.forEach(p => {
      if (p.type === 'object') {
        result[p.name] = p.children ? buildRequestJson(p.children) : {};
      } else if (p.type === 'array') {
        // For simulation, we create an array with 1 item if children exist
        result[p.name] = p.children ? [buildRequestJson(p.children)] : [];
      } else {
         const rawVal = simForm[p.id];
         if (rawVal === undefined || rawVal === '') {
           if (p.required) result[p.name] = null;
           return;
         }

         // Simple type casting
         if (p.type === 'integer' || p.type === 'decimal') {
           const num = Number(rawVal);
           result[p.name] = isNaN(num) ? rawVal : num;
         } else if (p.type === 'boolean') {
           result[p.name] = rawVal === 'true' || rawVal === '1';
         } else {
           result[p.name] = rawVal;
         }
      }
    });
    return result;
  };

  const generateMockResponse = (params: Parameter[]): any => {
    const data: any = {};
    params.forEach(field => {
      if (field.type === 'object') {
        data[field.name] = field.children ? generateMockResponse(field.children) : {};
      } else if (field.type === 'array') {
        data[field.name] = [field.children ? generateMockResponse(field.children) : {}];
      } else {
        // Use default value if exists
        if (field.defaultValue) {
             if (field.type === 'integer' || field.type === 'decimal') {
                 const num = Number(field.defaultValue);
                 data[field.name] = isNaN(num) ? field.defaultValue : num;
             } else if (field.type === 'boolean') {
                 data[field.name] = field.defaultValue === 'true';
             } else {
                 data[field.name] = field.defaultValue;
             }
        } else {
            // Fallback random values
            if (field.type === 'boolean') {
                data[field.name] = true;
            } else if (field.type === 'integer') {
                data[field.name] = 100;
            } else if (field.type === 'date') {
                data[field.name] = new Date().toISOString();
            } else {
                data[field.name] = "sample string";
            }
        }
      }
    });
    return data;
  };

  const handleSimulate = () => {
    setSimLoading(true);
    setSimResponse(null);
    setResultTab('response'); // Switch to response tab when sending

    // Standard Response Envelope
    const responseEnvelope = {
      IsSuccessfull: true,
      ResponseCode: 0,
      Message: "Simülasyon Başarılı",
      Data: generateMockResponse(endpoint.responseFields)
    };

    setTimeout(() => {
      setSimResponse(JSON.stringify(responseEnvelope, null, 2));
      setSimLoading(false);
    }, 800);
  };

  // --- Recursive Simulation Input Renderer ---
  const RecursiveSimInput = ({ params, depth = 0 }: { params: Parameter[], depth?: number }) => {
    return (
      <div className="space-y-3">
        {params.map(param => {
          const isComplex = param.type === 'object' || param.type === 'array';
          
          if (isComplex) {
            return (
              <div key={param.id} className="relative">
                {depth > 0 && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 border-l border-slate-200" 
                    style={{ left: '-12px' }} 
                  />
                )}
                <div className="mb-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    {param.type === 'object' ? <Folder size={14} className="text-blue-400" /> : <CornerDownRight size={14} className="text-blue-400" />}
                    {param.name}
                    {param.required && <span className="text-red-500">*</span>}
                    <span className="text-xs font-normal text-slate-400 font-mono bg-slate-100 px-1.5 rounded">{param.type}</span>
                  </label>
                  {param.description && <p className="text-xs text-slate-500 ml-6 mb-1">{param.description}</p>}
                </div>
                
                {/* Recursive Container */}
                <div className="ml-4 border-l-2 border-blue-50 pl-3">
                  {param.children && param.children.length > 0 ? (
                    <RecursiveSimInput params={param.children} depth={depth + 1} />
                  ) : (
                    <div className="text-xs text-slate-400 italic py-1">Alt alan tanımı yok.</div>
                  )}
                </div>
              </div>
            );
          }

          // Primitive Input
          return (
            <div key={param.id} className="relative">
               {depth > 0 && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 border-l border-slate-200" 
                    style={{ left: '-12px' }} 
                  />
                )}
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                <span>
                    {param.name} {param.required && <span className="text-red-500">*</span>}
                </span>
                {param.defaultValue && (
                    <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-mono" title="Varsayılan Değer">
                        def: {param.defaultValue}
                    </span>
                )}
              </label>
              {param.type === 'boolean' ? (
                 <select 
                    className="w-full border-slate-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none border transition-shadow bg-white"
                    value={simForm[param.id] || ''}
                    onChange={e => setSimForm({...simForm, [param.id]: e.target.value})}
                 >
                    <option value="">Seçiniz</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                 </select>
              ) : (
                <input 
                  type={param.type === 'integer' || param.type === 'decimal' ? 'number' : 'text'}
                  className="w-full border-slate-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none border transition-shadow"
                  placeholder={param.description || `${param.type} değeri giriniz`}
                  value={simForm[param.id] || ''}
                  onChange={e => setSimForm({...simForm, [param.id]: e.target.value})}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Request JSON live generation
  const requestJsonPreview = JSON.stringify(buildRequestJson(endpoint.requestParams), null, 2);

  // --- View Helpers ---

  const methodColors = {
    GET: 'bg-blue-100 text-blue-700',
    POST: 'bg-green-100 text-green-700',
    PUT: 'bg-orange-100 text-orange-700',
    DELETE: 'bg-red-100 text-red-700'
  };

  const ParamTable = ({ params, depth = 0 }: { params: Parameter[], depth?: number }) => (
    <>
      {params.map((param, idx) => (
        <React.Fragment key={param.id}>
          <tr className="hover:bg-slate-50/50">
            <td className="px-6 py-4">
              <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
                 {depth > 0 && <CornerDownRight size={14} className="text-slate-300" />}
                 <span className={`font-mono font-medium ${param.type === 'object' || param.type === 'array' ? 'text-slate-800' : 'text-blue-600'}`}>
                    {param.name}
                 </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-xs font-mono border ${
                param.type === 'object' || param.type === 'array' 
                  ? 'bg-slate-100 text-slate-700 border-slate-200' 
                  : 'bg-purple-50 text-purple-700 border-purple-100'
              }`}>
                {param.type}
              </span>
            </td>
            <td className="px-6 py-4">
              {param.required ? (
                <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium border border-red-100">Zorunlu</span>
              ) : (
                <span className="text-slate-400 text-xs">Opsiyonel</span>
              )}
            </td>
            <td className="px-6 py-4">
               {param.defaultValue ? (
                 <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{param.defaultValue}</span>
               ) : (
                 <span className="text-slate-300">-</span>
               )}
            </td>
            <td className="px-6 py-4 text-slate-600">{param.description}</td>
          </tr>
          {param.children && <ParamTable params={param.children} depth={depth + 1} />}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          {isEditing ? (
             <select 
               value={editEndpoint!.method}
               onChange={e => setEditEndpoint({...editEndpoint!, method: e.target.value as any})}
               className="border border-slate-300 rounded px-2 py-1 text-sm font-bold bg-white"
             >
               <option value="GET">GET</option>
               <option value="POST">POST</option>
               <option value="PUT">PUT</option>
               <option value="DELETE">DELETE</option>
             </select>
          ) : (
            <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[endpoint.method] || 'bg-slate-100 text-slate-700'}`}>
              {endpoint.method}
            </span>
          )}
          <span className="text-slate-400 text-sm font-mono">v1.0</span>
        </div>
        
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-8">
            {isEditing ? (
              <div className="space-y-3">
                 <input 
                   value={editEndpoint!.name}
                   onChange={e => setEditEndpoint({...editEndpoint!, name: e.target.value})}
                   className="text-3xl font-bold text-slate-900 w-full border-b border-slate-300 focus:border-blue-500 outline-none pb-1 bg-transparent placeholder-slate-300"
                   placeholder="Servis Adı"
                 />
                 <input 
                   value={editEndpoint!.description}
                   onChange={e => setEditEndpoint({...editEndpoint!, description: e.target.value})}
                   className="text-lg text-slate-600 w-full border-b border-slate-300 focus:border-blue-500 outline-none pb-1 bg-transparent placeholder-slate-300"
                   placeholder="Kısa Açıklama"
                 />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{endpoint.name}</h1>
                <p className="text-slate-600 text-lg">{endpoint.description}</p>
              </>
            )}
          </div>
          <div className="flex gap-2">
             {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit2 size={20} />
                </button>
             ) : (
               <div className="flex items-center gap-2">
                 <button onClick={handleCancelEdit} className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="İptal">
                   <X size={20} />
                 </button>
                 <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Kaydet">
                   <Save size={20} />
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* URL Bar */}
      <div className="bg-[#0f172a] rounded-lg p-4 flex items-center justify-between text-slate-300 font-mono text-sm shadow-md transition-all hover:shadow-lg">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className={
            (isEditing ? editEndpoint! : endpoint).method === 'GET' ? 'text-blue-400' : 
            (isEditing ? editEndpoint! : endpoint).method === 'POST' ? 'text-green-400' : 'text-slate-400'
          }>{(isEditing ? editEndpoint! : endpoint).method}</span>
          
          {isEditing ? (
            <input 
              value={editEndpoint!.path}
              onChange={e => setEditEndpoint({...editEndpoint!, path: e.target.value})}
              className="bg-transparent border-b border-slate-600 text-white w-full focus:border-white outline-none"
            />
          ) : (
            <span className="text-white truncate">{endpoint.path}</span>
          )}
        </div>
        {!isEditing && (
          <button 
            onClick={handleCopyUrl}
            className="ml-4 text-slate-400 hover:text-white transition-colors"
            title="Kopyala"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          {['request', 'response', 'simulation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              disabled={isEditing && tab === 'simulation'} // Disable simulation while editing
              className={`pb-4 text-sm font-medium transition-all relative ${
                activeTab === tab 
                  ? 'text-blue-600' 
                  : (isEditing && tab === 'simulation') ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'simulation' && ' (Test)'}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === 'request' && (
          isEditing ? (
            <ParamEditor listType="request" editEndpoint={editEndpoint} setEditEndpoint={setEditEndpoint} dictionary={dictionary} />
          ) : (
            <div className="border rounded-xl overflow-hidden border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Alan Adı</th>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Tip</th>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Zorunluluk</th>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Varsayılan</th>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <ParamTable params={endpoint.requestParams} />
                  {endpoint.requestParams.length === 0 && (
                     <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Parametre tanımlanmamış.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
        
        {activeTab === 'response' && (
          isEditing ? (
             <ParamEditor listType="response" editEndpoint={editEndpoint} setEditEndpoint={setEditEndpoint} dictionary={dictionary} />
          ) : (
            <div className="border rounded-xl overflow-hidden border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Alan Adı</th>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Tip</th>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Zorunluluk</th>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Varsayılan</th>
                    <th className="px-6 py-3 uppercase text-xs tracking-wider">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <ParamTable params={endpoint.responseFields} />
                  {endpoint.responseFields.length === 0 && (
                     <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Response alanı tanımlanmamış.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit">
              <h3 className="font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">İstek Parametreleri</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {endpoint.requestParams.length === 0 && (
                   <div className="text-sm text-slate-400 italic">Bu servis parametre almamaktadır.</div>
                )}
                
                {/* Recursive Input Rendering */}
                <RecursiveSimInput params={endpoint.requestParams} />

              </div>
              
              <button 
                onClick={handleSimulate}
                disabled={simLoading}
                className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
              >
                {simLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" /> İsteği Gönder
                  </>
                )}
              </button>
            </div>

            {/* Result Panel (Tabs: Response vs Payload) */}
            <div className="flex flex-col h-full bg-[#0f172a] rounded-xl overflow-hidden shadow-md">
               <div className="flex items-center border-b border-slate-700 bg-slate-800/50">
                  <button 
                    onClick={() => setResultTab('response')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${resultTab === 'response' ? 'text-white bg-slate-700/50 border-b-2 border-green-500' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <ArrowRightLeft size={16} /> Response
                  </button>
                  <div className="w-[1px] h-4 bg-slate-700"></div>
                  <button 
                    onClick={() => setResultTab('payload')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${resultTab === 'payload' ? 'text-white bg-slate-700/50 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Code size={16} /> Request Payload
                  </button>
               </div>
              
              <div className="flex-1 p-4 overflow-auto min-h-[400px] text-sm font-mono relative custom-scrollbar">
                {resultTab === 'response' ? (
                   simResponse ? (
                    <pre className="text-green-400">
                      {simResponse}
                    </pre>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                      <span className="text-green-400/50 mr-2">//</span> İstek bekleniyor...
                    </div>
                  )
                ) : (
                   <pre className="text-blue-300">
                     {requestJsonPreview}
                   </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;