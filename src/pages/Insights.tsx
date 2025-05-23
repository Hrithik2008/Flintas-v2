import React from 'react';
import { Navigation } from '../components/Navigation';
import { BarChart2, TrendingUp, Calendar, BookOpen } from 'lucide-react';

export function Insights() {
  const weeklyStats = {
    completedHabits: 15,
    totalHabits: 21,
    streakDays: 5,
    xpGained: 450,
  };

  const reflections = [
    {
      id: 1,
      date: "2024-03-15",
      prompt: "What habit had the biggest impact this week?",
      response: "Morning meditation helped me stay focused",
    },
    {
      id: 2,
      date: "2024-03-14",
      prompt: "What challenges did you overcome?",
      response: "Started meal prepping despite busy schedule",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <p className="text-gray-600">Track your progress and reflect</p>
        </header>

        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-gray-700">Completion Rate</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((weeklyStats.completedHabits / weeklyStats.totalHabits) * 100)}%
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-gray-700">Current Streak</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.streakDays} days</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Weekly Reflections</h2>
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {reflections.map(reflection => (
              <div key={reflection.id} className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">{reflection.date}</p>
                <p className="font-medium text-gray-800 mt-1">{reflection.prompt}</p>
                <p className="text-gray-600 mt-2">{reflection.response}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Navigation />
    </div>
  );
}