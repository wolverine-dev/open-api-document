export interface Parameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
  children?: Parameter[];
}

export interface Endpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestParams: Parameter[];
  responseFields: Parameter[];
}

export interface ServiceGroup {
  id: string;
  title: string;
  key: string;
  iconName: 'User' | 'FileText' | 'Megaphone' | 'Calculator' | 'CreditCard' | 'Users' | 'Server' | 'Database' | 'Activity';
  description?: string;
  endpoints: Endpoint[];
}

export interface DictionaryItem {
  id: string;
  key: string;
  description: string;
  type: 'string' | 'integer' | 'boolean' | 'decimal' | 'date';
}

export interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  iconName: 'Server' | 'ArrowLeftRight' | 'ShieldCheck';
}

export interface ApiSettings {
  baseUrl: string; // e.g., "http://localhost:5000/api"
}

export type ViewState = 'dashboard' | 'services' | 'dictionary' | 'serviceDetail' | 'settings';

export type SyncStatus = 'idle' | 'loading' | 'success' | 'error';