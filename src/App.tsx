import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { ToastContainer } from './components/layout/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { AdmissionPage } from './pages/AdmissionPage';
import { CoursesPage } from './pages/CoursesPage';
import { SupportPage } from './pages/SupportPage';
import { VoicePage } from './pages/VoicePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'chat':
        return <ChatPage />;
      case 'knowledge':
        return <KnowledgeBasePage />;
      case 'admission':
        return <AdmissionPage />;
      case 'courses':
        return <CoursesPage />;
      case 'support':
        return <SupportPage />;
      case 'voice':
        return <VoicePage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-campus-dark text-slate-100 transition-colors duration-200">
      <DemoBanner />
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl mx-auto w-full transition-all">
          {renderPage()}
        </main>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
