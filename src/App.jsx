import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingWhatsApp from './components/FloatingWhatsApp';

import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import SmileDesigning from './pages/SmileDesigning';
import AlignersBraces from './pages/AlignersBraces';
import DentalImplants from './pages/DentalImplants';
import BookingPage from './pages/BookingPage';
import AssessmentPage from './pages/Assessment';
import ResultsPage from './pages/Results';
import FAQPage from './pages/FAQ';
import ImageUpload from './components/ImageUpload';
import { Login, Register } from './pages/Placeholders';
import Admin from './pages/Admin';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/smile-designing" element={<SmileDesigning />} />
        <Route path="/aligners-braces" element={<AlignersBraces />} />
        <Route path="/dental-implants" element={<DentalImplants />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/ai-preview" element={<ImageUpload />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdmin && <FloatingWhatsApp />}
      {!isAdmin && <Chatbot />}
    </>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout />
    </Router>
  );
}

export default App;
