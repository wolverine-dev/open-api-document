import React from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HeroSection from './components/HeroSection';
import StatsRow from './components/StatsRow';
import ServiceGroupsGrid from './components/ServiceGroupsGrid';
import ServiceManager from './components/ServiceManager';
import Dictionary from './components/Dictionary';
import ServiceDetail from './components/ServiceDetail';
import DataManagement from './components/DataManagement';
import { AppProvider, useAppContext } from './context/AppContext';

// Internal component to consume context safely
const AppContent: React.FC = () => {
  const { currentView } = useAppContext();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <TopBar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <>
                <HeroSection />
                <StatsRow />
                <ServiceGroupsGrid />
              </>
            )}
            
            {currentView === 'services' && <ServiceManager />}
            
            {currentView === 'dictionary' && <Dictionary />}

            {currentView === 'serviceDetail' && <ServiceDetail />}
            
            {currentView === 'settings' && <DataManagement />}
          </div>
          
          {/* Footer spacer */}
          <div className="h-12"></div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;