import React from 'react';
import { Navigation } from '../components/Navigation';

export function HabitTracker() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Habit Tracker</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Track your daily habits and build consistency.</p>
        </div>
      </main>
    </div>
  );
}