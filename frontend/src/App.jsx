import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import CommandCenter from './pages/CommandCenter';
import Oracle from './pages/Oracle';
import Archives from './pages/Archives';
import Network from './pages/Network';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/oracle" element={<Oracle />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/network" element={<Network />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
