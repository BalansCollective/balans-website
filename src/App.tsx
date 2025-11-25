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
import { RedForgeDemoPage } from './pages/website/RedForgeDemoPage';
import AIEscalationPage from './pages/website/AIEscalationPage';
import { ContactPage } from './pages/website/ContactPage';
import './i18n'; // Initialize i18n
import './App.css';

function AppContent() {
  const location = useLocation();
  // Match both with and without trailing slash
  const hideNavigation = location.pathname.startsWith('/red-forge-demo') || location.pathname.startsWith('/red-forge-advanced');

  return (
    <>
      {!hideNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/medical" element={<MedicalPage />} />
        <Route path="/ai-escalation" element={<AIEscalationPage />} />
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
        {/* Red Forge: Simple demo for SAAB, advanced IDE for internal (no link from demo) */}
        <Route path="/red-forge-demo" element={<RedForgeDemoPage />} />
        <Route path="/red-forge-advanced" element={<RedForgeIDEPage />} />
        {/* Legacy alias for old bookmarks */}
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
