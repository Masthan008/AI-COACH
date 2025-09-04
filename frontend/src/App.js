import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import ModeSelection from './pages/ModeSelection';
import PracticeSession from './pages/PracticeSession';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/modes" element={<ModeSelection />} />
            <Route path="/practice/:mode" element={<PracticeSession />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
