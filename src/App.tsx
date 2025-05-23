import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Welcome } from './pages/Welcome';
import { SignUp } from './pages/SignUp';
import { Onboarding } from './pages/Onboarding';
import { HabitTracker } from './pages/HabitTracker';
import { Tracks } from './pages/Tracks';
import { Community } from './pages/Community';
import { Rewards } from './pages/Rewards';
import { Insights } from './pages/Insights';
import { Profile } from './pages/Profile';
import { Navigation } from './components/Navigation';

const AppContent = () => {
  const location = useLocation();
  const showNavigationPaths = [
    '/dashboard',
    '/habits',
    '/tracks',
    '/community',
    '/rewards',
    '/insights',
    '/profile',
  ];
  const shouldShowNavigation = showNavigationPaths.includes(location.pathname);

  return (
    <div className={`flex flex-col min-h-screen ${shouldShowNavigation ? 'pb-20' : ''}`}>
      <main className="flex-grow">
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/tracks" element={<Tracks />} />
          <Route path="/community" element={<Community />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </main>
      {shouldShowNavigation && <Navigation />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;