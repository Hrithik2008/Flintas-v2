import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Trophy, User, BarChart2, Users } from 'lucide-react';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, path: '/dashboard', label: 'Home' },
    { icon: Compass, path: '/tracks', label: 'Tracks' },
    { icon: Users, path: '/community', label: 'Community' },
    { icon: Trophy, path: '/rewards', label: 'Rewards' },
    { icon: BarChart2, path: '/insights', label: 'Insights' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex justify-around py-3">
          {navItems.map(({ icon: Icon, path, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`p-2 flex flex-col items-center ${
                isActive(path) ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}