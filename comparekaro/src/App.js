import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DomainPage from './pages/DomainPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/compare/:domainName" element={<DomainPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
