import { useState } from 'react';
import { Tabs, TabsContent } from './components/ui/tabs'; 
import { Dashboard } from './components/Dashboard';
import { BuyBonds } from './components/BuyBonds';
import { Account } from './components/Account';
import { BoostEarnings } from './components/BoostEarnings';
import { P2PExchange } from './components/P2PExchange';
import { TaxCenter } from './components/TaxCenter';
import { EducationCenter } from './components/EducationCenter';
import { RegulatoryDashboard } from './components/RegulatoryDashboard';
import { UserRoleProvider, useUserRole } from './contexts/UserRoleContext';
import { LayoutDashboard, ShoppingCart, User } from 'lucide-react';


import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { OnboardingFlow } from './components/OnboardingFlow';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const { roleConfig } = useUserRole();
  
  const { user, loading } = useAuth();
  const [viewState, setViewState] = useState<'login' | 'register'>('login');

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-[#008753]">Loading...</div>;
  }

 
  if (!user) {
    if (viewState === 'register') {
      return <OnboardingFlow onComplete={() => setViewState('login')} />;
    }
    return <Login onSwitchToRegister={() => setViewState('register')} />;
  }
  

  const handleFeatureOpen = (feature: string) => {
    setActiveFeature(feature);
  };

  const handleFeatureClose = () => {
    setActiveFeature(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-[#008753]">Bond Token Nigeria</h1>
          <p className="text-gray-600 text-sm mt-1">Invest in Nigerian Government Bonds</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard" className="mt-0">
            {roleConfig.isRegulator ? (
              <RegulatoryDashboard onFeatureOpen={handleFeatureOpen} />
            ) : (
              <Dashboard onFeatureOpen={handleFeatureOpen} />
            )}
          </TabsContent>
          {roleConfig.canTrade && (
            <TabsContent value="buy-bonds" className="mt-0">
              <BuyBonds />
            </TabsContent>
          )}
          <TabsContent value="account" className="mt-0">
            <Account />
          </TabsContent>
        </Tabs>

        {/* Feature Modals/Views */}
        {activeFeature === 'boost-earnings' && (
          <BoostEarnings onClose={handleFeatureClose} />
        )}
        {activeFeature === 'p2p-exchange' && (
          <P2PExchange onClose={handleFeatureClose} />
        )}
        {activeFeature === 'tax-center' && (
          <TaxCenter onClose={handleFeatureClose} />
        )}
        {activeFeature === 'education-center' && (
          <EducationCenter onClose={handleFeatureClose} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'text-[#008753] bg-[#008753]/10'
                : 'text-gray-600'
            }`}
          >
            <LayoutDashboard size={24} />
            <span className="text-xs">Dashboard</span>
          </button>
          {roleConfig.canTrade && (
            <button
              onClick={() => setActiveTab('buy-bonds')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'buy-bonds'
                  ? 'text-[#008753] bg-[#008753]/10'
                  : 'text-gray-600'
              }`}
            >
              <ShoppingCart size={24} />
              <span className="text-xs">Buy Bonds</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('account')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'account'
                ? 'text-[#008753] bg-[#008753]/10'
                : 'text-gray-600'
            }`}
          >
            <User size={24} />
            <span className="text-xs">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    
    <AuthProvider>
      <UserRoleProvider>
        <AppContent />
      </UserRoleProvider>
    </AuthProvider>
  );
}