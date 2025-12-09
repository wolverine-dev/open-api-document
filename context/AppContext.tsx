import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceGroup, DictionaryItem, Endpoint, ApiSettings, SyncStatus } from '../types';
import { SERVICE_GROUPS, DICTIONARY_ITEMS } from '../constants';

interface AppContextType {
  services: ServiceGroup[];
  dictionary: DictionaryItem[];
  apiSettings: ApiSettings;
  updateApiSettings: (settings: ApiSettings) => void;
  
  // CRUD Operations
  fetchData: () => Promise<void>;
  addService: (service: ServiceGroup) => Promise<void>;
  updateService: (service: ServiceGroup) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updateEndpoint: (serviceId: string, endpoint: Endpoint) => Promise<void>;
  
  addDictionaryItem: (item: DictionaryItem) => Promise<void>;
  updateDictionaryItem: (item: DictionaryItem) => Promise<void>;
  deleteDictionaryItem: (id: string) => Promise<void>;
  
  // Navigation & UI
  currentView: 'dashboard' | 'services' | 'dictionary' | 'serviceDetail' | 'settings';
  navigateTo: (view: 'dashboard' | 'services' | 'dictionary' | 'settings') => void;
  openServiceDetail: (serviceId: string, endpointId: string) => void;
  selectedServiceId: string | null;
  selectedEndpointId: string | null;
  
  // Status
  status: SyncStatus;
  statusMessage: string | null;
  clearStatus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State ---
  const [services, setServices] = useState<ServiceGroup[]>([]);
  const [dictionary, setDictionary] = useState<DictionaryItem[]>([]);
  
  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('portal_api_settings');
    return saved ? JSON.parse(saved) : { baseUrl: 'http://localhost:5000/api' };
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'services' | 'dictionary' | 'serviceDetail' | 'settings'>('dashboard');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null);
  
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // --- Effects ---

  useEffect(() => {
    localStorage.setItem('portal_api_settings', JSON.stringify(apiSettings));
  }, [apiSettings]);

  // Initial Fetch
  useEffect(() => {
    fetchData();
  }, []); // Run once on mount

  // --- Helpers ---

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    // Add Authorization header here if needed for your .NET API
  });

  const handleError = (error: any, action: string) => {
    console.error(error);
    setStatus('error');
    setStatusMessage(`${action} başarısız: ${error.message}`);
    // If API fails, fall back to mock data only on initial load if empty
    if (services.length === 0 && action === 'Veri Çekme') {
       console.warn("API erişilemedi, mock data kullanılıyor.");
       setServices(SERVICE_GROUPS);
       setDictionary(DICTIONARY_ITEMS);
    }
  };

  const clearStatus = () => {
    setStatus('idle');
    setStatusMessage(null);
  };

  // --- API Actions ---

  const fetchData = async () => {
    setStatus('loading');
    try {
      // Parallel fetch
      const [servicesRes, dictRes] = await Promise.all([
        fetch(`${apiSettings.baseUrl}/services`, { headers: getHeaders() }),
        fetch(`${apiSettings.baseUrl}/dictionary`, { headers: getHeaders() })
      ]);

      if (!servicesRes.ok) throw new Error(`Services API Error: ${servicesRes.status}`);
      if (!dictRes.ok) throw new Error(`Dictionary API Error: ${dictRes.status}`);

      const servicesData = await servicesRes.json();
      const dictData = await dictRes.json();

      setServices(servicesData);
      setDictionary(dictData);
      setStatus('success');
      // setStatusMessage('Veriler güncellendi.');
      setTimeout(clearStatus, 2000);
    } catch (error: any) {
      handleError(error, 'Veri Çekme');
    }
  };

  const addService = async (service: ServiceGroup) => {
    setStatus('loading');
    try {
      const res = await fetch(`${apiSettings.baseUrl}/services`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(service)
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      setServices([...services, created]);
      setStatus('success');
      setStatusMessage('Servis oluşturuldu.');
    } catch (error) {
      handleError(error, 'Servis Ekleme');
    }
  };

  const updateService = async (service: ServiceGroup) => {
    setStatus('loading');
    try {
      const res = await fetch(`${apiSettings.baseUrl}/services/${service.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(service)
      });
      if (!res.ok) throw new Error('Update failed');
      
      setServices(services.map(s => s.id === service.id ? service : s));
      setStatus('success');
      setStatusMessage('Servis güncellendi.');
    } catch (error) {
      handleError(error, 'Servis Güncelleme');
    }
  };

  const deleteService = async (id: string) => {
    setStatus('loading');
    try {
      const res = await fetch(`${apiSettings.baseUrl}/services/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Delete failed');
      
      setServices(services.filter(s => s.id !== id));
      setStatus('success');
      setStatusMessage('Servis silindi.');
    } catch (error) {
      handleError(error, 'Servis Silme');
    }
  };

  const updateEndpoint = async (serviceId: string, endpoint: Endpoint) => {
    // Endpoints are part of the Service aggregate root.
    // So we find the service, update the endpoint list locally, then PUT the whole service.
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const updatedService = {
      ...service,
      endpoints: service.endpoints.map(ep => ep.id === endpoint.id ? endpoint : ep)
    };

    await updateService(updatedService);
  };

  // --- Dictionary Actions ---

  const addDictionaryItem = async (item: DictionaryItem) => {
    setStatus('loading');
    try {
      const res = await fetch(`${apiSettings.baseUrl}/dictionary`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      setDictionary([...dictionary, created]);
      setStatus('success');
      setStatusMessage('Tanım eklendi.');
    } catch (error) {
      handleError(error, 'Tanım Ekleme');
    }
  };

  const updateDictionaryItem = async (item: DictionaryItem) => {
    setStatus('loading');
    try {
      const res = await fetch(`${apiSettings.baseUrl}/dictionary/${item.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error('Update failed');
      
      setDictionary(dictionary.map(d => d.id === item.id ? item : d));
      setStatus('success');
      setStatusMessage('Tanım güncellendi.');
    } catch (error) {
      handleError(error, 'Tanım Güncelleme');
    }
  };

  const deleteDictionaryItem = async (id: string) => {
    setStatus('loading');
    try {
      const res = await fetch(`${apiSettings.baseUrl}/dictionary/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Delete failed');
      
      setDictionary(dictionary.filter(d => d.id !== id));
      setStatus('success');
      setStatusMessage('Tanım silindi.');
    } catch (error) {
      handleError(error, 'Tanım Silme');
    }
  };

  // --- Navigation ---

  const navigateTo = (view: 'dashboard' | 'services' | 'dictionary' | 'settings') => {
    setCurrentView(view);
    setSelectedServiceId(null);
    setSelectedEndpointId(null);
  };

  const openServiceDetail = (serviceId: string, endpointId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedEndpointId(endpointId);
    setCurrentView('serviceDetail');
  };

  return (
    <AppContext.Provider value={{
      services,
      dictionary,
      apiSettings,
      updateApiSettings: setApiSettings,
      fetchData,
      addService,
      updateService,
      deleteService,
      updateEndpoint,
      addDictionaryItem,
      updateDictionaryItem,
      deleteDictionaryItem,
      currentView,
      navigateTo,
      openServiceDetail,
      selectedServiceId,
      selectedEndpointId,
      status,
      statusMessage,
      clearStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};