import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import WelcomePopup from './components/WelcomePopup';
import LanguageSwitch from './components/LanguageSwitch';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import Earn from './pages/Earn';
import FAQ from './pages/FAQ';
import Discord from './pages/Discord';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <WelcomePopup />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/discord" element={<Discord />} />
          <Route path="/auth/callback" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <LanguageSwitch />
      </div>
    </Router>
  );
};

export default App;