'use client';

// HABTA - Reabilitação Urbana | v2.2.8 - InsightDetail Props Fixed
// Build: 2025-11-04T16:20:00Z
import { useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { PageTransition } from './components/PageTransition';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { Router, useRouter } from './components/Router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { designSystem } from './components/design-system';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PortfolioDetailPage } from './pages/PortfolioDetailPage';
import { ProcessPage } from './pages/ProcessPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { InsightsPage } from './pages/InsightsPage';
import { InsightDetailPage } from './pages/InsightDetailPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPanel } from './components/AdminPanelNew';
import { Login } from './components/Login';

function AppContent() {
  const { currentRoute } = useRouter();

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const renderPage = () => {
    switch (currentRoute) {
      case 'services':
        return <ServicesPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'portfolio-detail':
        return <PortfolioDetailPage />;
      case 'process':
        return <ProcessPage />;
      case 'testimonials':
        return <TestimonialsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'insight-detail':
        return <InsightDetailPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPanel />;
      case 'login':
        return <Login />;
      default:
        return <HomePage />;
    }
  };

  // Admin e Login não precisam de header/footer públicos
  const isAdminRoute = currentRoute === 'admin' || currentRoute === 'login';

  return (
    <ErrorBoundary>
      <PageTransition>
        <div className="min-h-screen">
          {!isAdminRoute && <ScrollProgress />}
          {!isAdminRoute && <Header />}
          <main>
            {renderPage()}
          </main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <WhatsAppButton />}
          {!isAdminRoute && <BackToTop />}
          <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              color: '#0F1729',
              border: '1px solid rgba(26, 62, 92, 0.12)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(26, 62, 92, 0.15)',
            },
          }}
        />
        </div>
      </PageTransition>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
