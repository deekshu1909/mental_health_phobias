import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MentalHealthQuestionnaire from './components/MentalHealthQuestionnaire';
import PhobiaAssessment from './components/PhobiaAssessment';
import MentalHealthDashboard from './components/MentalHealthDashboard';
import PhobiaDashboard from './components/PhobiaDashboard';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { supabase } from './lib/supabase';

type Page =
  | 'home'
  | 'mental-health'
  | 'phobia'
  | 'mental-health-dashboard'
  | 'phobia-dashboard'
  | 'admin-login'
  | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
      }
      setCheckingAuth(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAdminAuthenticated(!!data.session?.user);
    setCheckingAuth(false);
  };

  const navigateTo = (page: string) => {
    if (page === 'admin') {
      if (isAdminAuthenticated) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('admin-login');
      }
    } else {
      setCurrentPage(page as Page);
    }
  };

  const navigateHome = async () => {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentPage('admin');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'home' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'mental-health' && (
        <MentalHealthQuestionnaire onBack={() => setCurrentPage('home')} onComplete={() => setCurrentPage('home')} />
      )}
      {currentPage === 'phobia' && (
        <PhobiaAssessment onBack={() => setCurrentPage('home')} onComplete={() => setCurrentPage('home')} />
      )}
      {currentPage === 'mental-health-dashboard' && (
        <MentalHealthDashboard onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'phobia-dashboard' && (
        <PhobiaDashboard onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'admin-login' && (
        <AdminLogin onLoginSuccess={handleAdminLogin} />
      )}
      {currentPage === 'admin' && isAdminAuthenticated && (
        <AdminPanel onBack={navigateHome} />
      )}
    </>
  );
}

export default App;
