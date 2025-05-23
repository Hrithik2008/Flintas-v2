import React from 'react';
import { Navigation } from '../components/Navigation';
import { Compass, Brain, Leaf, Heart, Book } from 'lucide-react';

export function Tracks() {
  const tracks = [
    {
      id: 1,
      name: 'Mental Wellness',
      description: 'Build habits for better mental health',
      icon: Brain,
      color: 'bg-purple-100 text-purple-600',
      progress: 65,
    },
    {
      id: 2,
      name: 'Climate Action',
      description: 'Develop eco-friendly daily practices',
      icon: Leaf,
      color: 'bg-green-100 text-green-600',
      progress: 40,
    },
    {
      id: 3,
      name: 'Self-Care',
      description: 'Prioritize your personal wellbeing',
      icon: Heart,
      color: 'bg-red-100 text-red-600',
      progress: 25,
    },
    {
      id: 4,
      name: 'Learning',
      description: 'Daily habits for continuous growth',
      icon: Book,
      color: 'bg-blue-100 text-blue-600',
      progress: 15,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Habit Tracks</h1>
          <p className="text-gray-600">Choose your path to growth</p>
        </header>

        <div className="space-y-4">
          {tracks.map(track => {
            const Icon = track.icon;
            return (
              <div key={track.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${track.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{track.name}</h3>
                    <p className="text-sm text-gray-600">{track.description}</p>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-2 bg-indigo-600 rounded-full"
                          style={{ width: `${track.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{track.progress}% Complete</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Navigation />
    </div>
  );
}