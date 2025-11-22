import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/website/HomePage';
import { DefensePage } from './pages/website/DefensePage';
import RedForgePage from './pages/website/RedForgePage';
import { GuardianProtocolPage } from './pages/website/GuardianProtocolPage';
import { ForgeProtocolPage } from './pages/website/ForgeProtocolPage';
import NarrativesPage from './pages/website/NarrativesPage';
import { GroundAssaultPage } from './pages/website/GroundAssaultPage';
import { MorgansDilemmaPage } from './pages/website/MorgansDilemmaPage';
import { MedicalDashboardPage } from './pages/MedicalDashboardPage';
import './i18n'; // Initialize i18n
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/defense" element={<DefensePage />} />
        <Route path="/red-forge" element={<RedForgePage />} />
        <Route path="/guardian-protocol" element={<GuardianProtocolPage />} />
        <Route path="/forge-protocol" element={<ForgeProtocolPage />} />
        <Route path="/narratives" element={<NarrativesPage />} />
        <Route path="/narratives/ground-assault" element={<GroundAssaultPage />} />
        <Route path="/narratives/morgans-dilemma" element={<MorgansDilemmaPage />} />
        <Route path="/medical-dashboard" element={<MedicalDashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
