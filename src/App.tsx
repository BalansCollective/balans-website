import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/website/HomePage';
import { DefensePage } from './pages/website/DefensePage';
import RedForgePage from './pages/website/RedForgePage';
import { GuardianProtocolPage } from './pages/website/GuardianProtocolPage';
import { ForgeProtocolPage } from './pages/website/ForgeProtocolPage';
import NarrativesPage from './pages/website/NarrativesPage';
import { GroundAssaultPage } from './pages/website/GroundAssaultPage';
import { MorgansDilemmaPage } from './pages/website/MorgansDilemmaPage';
import { SkellefteaProtocolPage } from './pages/website/SkellefteaProtocolPage';
import FamilyPage from './pages/website/FamilyPage';
import { MedicalPage } from './pages/website/MedicalPage';
import { MedicalDashboardPage } from './pages/MedicalDashboardPage';
import { RedForgeIDEPage } from './pages/RedForgeIDEPage';
import './i18n'; // Initialize i18n
import './App.css';

function AppContent() {
  const location = useLocation();
  const hideNavigation = location.pathname === '/red-forge-ide';

  return (
    <>
      {!hideNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/medical" element={<MedicalPage />} />
        <Route path="/defense" element={<DefensePage />} />
        <Route path="/red-forge" element={<RedForgePage />} />
        <Route path="/guardian-protocol" element={<GuardianProtocolPage />} />
        <Route path="/forge-protocol" element={<ForgeProtocolPage />} />
        <Route path="/narratives" element={<NarrativesPage />} />
        <Route path="/narratives/ground-assault" element={<GroundAssaultPage />} />
        <Route path="/narratives/morgans-dilemma" element={<MorgansDilemmaPage />} />
        <Route path="/narratives/skelleftea-protocol" element={<SkellefteaProtocolPage />} />
        <Route path="/medical-dashboard" element={<MedicalDashboardPage />} />
        {/* TEMPORARY: /demo alias for doctor's research group link - remove after a few weeks (2025-12-15) */}
        <Route path="/demo" element={<MedicalDashboardPage />} />
        <Route path="/red-forge-ide" element={<RedForgeIDEPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
