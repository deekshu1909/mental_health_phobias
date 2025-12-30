import { useState } from 'react';
import LandingPage from './components/LandingPage';
import MentalHealthQuestionnaire from './components/MentalHealthQuestionnaire';
import PhobiaAssessment from './components/PhobiaAssessment';
import MentalHealthDashboard from './components/MentalHealthDashboard';
import PhobiaDashboard from './components/PhobiaDashboard';
import AdminPanel from './components/AdminPanel';

type Page =
  | 'home'
  | 'mental-health'
  | 'phobia'
  | 'mental-health-dashboard'
  | 'phobia-dashboard'
  | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: string) => {
    setCurrentPage(page as Page);
  };

  const navigateHome = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'mental-health' && (
        <MentalHealthQuestionnaire onBack={navigateHome} onComplete={navigateHome} />
      )}
      {currentPage === 'phobia' && (
        <PhobiaAssessment onBack={navigateHome} onComplete={navigateHome} />
      )}
      {currentPage === 'mental-health-dashboard' && (
        <MentalHealthDashboard onBack={navigateHome} />
      )}
      {currentPage === 'phobia-dashboard' && (
        <PhobiaDashboard onBack={navigateHome} />
      )}
      {currentPage === 'admin' && <AdminPanel onBack={navigateHome} />}
    </>
  );
}

export default App;
