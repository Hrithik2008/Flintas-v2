import React from 'react';
import { Quote } from 'lucide-react';

export function DailyQuote() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <Quote className="w-6 h-6 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Daily Inspiration</h2>
      </div>
      <p className="text-gray-600 italic">
        "Small steps every day become big changes over time."
      </p>
    </div>
  );
}