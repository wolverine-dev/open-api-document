import React from 'react';
import { User, FileText, Megaphone, Calculator, CreditCard, Users, ArrowRight, Server, Database, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ServiceGroup } from '../types';

const GroupCard: React.FC<{ group: ServiceGroup }> = ({ group }) => {
  const { navigateTo } = useAppContext();

  const iconMap: Record<string, React.ReactNode> = {
    User: <User className="text-slate-500 group-hover:text-blue-600" size={20} />,
    FileText: <FileText className="text-slate-500 group-hover:text-blue-600" size={20} />,
    Megaphone: <Megaphone className="text-slate-500 group-hover:text-blue-600" size={20} />,
    Calculator: <Calculator className="text-slate-500 group-hover:text-blue-600" size={20} />,
    CreditCard: <CreditCard className="text-slate-500 group-hover:text-blue-600" size={20} />,
    Users: <Users className="text-slate-500 group-hover:text-blue-600" size={20} />,
    Server: <Server className="text-slate-500 group-hover:text-blue-600" size={20} />,
    Database: <Database className="text-slate-500 group-hover:text-blue-600" size={20} />,
    Activity: <Activity className="text-slate-500 group-hover:text-blue-600" size={20} />,
  };

  return (
    <div 
      onClick={() => navigateTo('services')}
      className="bg-white border border-slate-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer flex flex-col h-full justify-between"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
            {iconMap[group.iconName] || <Server size={20} />}
          </div>
          <h3 className="font-semibold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
            {group.title}
          </h3>
        </div>
        <div className="text-sm text-slate-500 mb-4 pl-1">
          {group.endpoints.length} Servis
        </div>
      </div>
      
       <div className="border-t border-slate-50 pt-3 mt-2">
         <div className="flex justify-between items-center text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
           <span>Yönet</span>
           <ArrowRight size={14} />
         </div>
       </div>
    </div>
  );
};

const ServiceGroupsGrid: React.FC = () => {
  const { services } = useAppContext();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Servis Grupları</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default ServiceGroupsGrid;
