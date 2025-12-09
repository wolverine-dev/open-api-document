import React from 'react';
import { Server, ArrowLeftRight, ShieldCheck } from 'lucide-react';
import { StatCardProps } from '../types';
import { useAppContext } from '../context/AppContext';

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, iconName }) => {
  const icons = {
    Server: <Server size={24} className="text-blue-500" />,
    ArrowLeftRight: <ArrowLeftRight size={24} className="text-emerald-500" />,
    ShieldCheck: <ShieldCheck size={24} className="text-purple-500" />
  };

  const bgColors = {
    Server: 'bg-blue-50',
    ArrowLeftRight: 'bg-emerald-50',
    ShieldCheck: 'bg-purple-50'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-40">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${bgColors[iconName]}`}>
          {icons[iconName]}
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-slate-800 block">{value}</span>
          {subValue && <span className="text-xs text-slate-400 font-medium">{subValue}</span>}
        </div>
      </div>
      <div className="text-slate-600 font-medium">
        {label}
      </div>
    </div>
  );
};

const StatsRow: React.FC = () => {
  const { services } = useAppContext();
  
  // Calculate total endpoints
  const totalEndpoints = services.reduce((acc, curr) => acc + curr.endpoints.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatCard 
        label="Toplam Servis" 
        value={totalEndpoints.toString()} 
        iconName="Server" 
      />
      <StatCard 
        label="Desteklenen Protokoller" 
        value="REST & SOAP" 
        iconName="ArrowLeftRight" 
      />
      <StatCard 
        label="API Versiyonu" 
        value="v1.0" 
        iconName="ShieldCheck" 
      />
    </div>
  );
};

export default StatsRow;
