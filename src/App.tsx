import React, { useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CampusProvider } from './context/CampusContext';
import { AcademicPlannerView } from './views/AcademicPlannerView';
import { CampusGuideView } from './views/CampusGuideView';
import { ChallengeBoardView } from './views/ChallengeBoardView';
import { DashboardView } from './views/DashboardView';
import { EventsView } from './views/EventsView';
import { PeerLearningView } from './views/PeerLearningView';
import { ProfileView } from './views/ProfileView';
import { RidesView } from './views/RidesView';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeTab === 'academic-planner' && <AcademicPlannerView />}

          {activeTab === 'rides' && <RidesView />}

          {activeTab === 'challenge-board' && <ChallengeBoardView />}

          {activeTab === 'campus-guide' && <CampusGuideView />}

          {activeTab === 'peer-learning' && <PeerLearningView />}

          {activeTab === 'events' && <EventsView />}

          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* MiniMoth Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <MainApp />
    </CampusProvider>
  );
}
