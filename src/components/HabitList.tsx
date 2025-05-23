import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { Check, X } from 'lucide-react';

export function HabitList() {
  const userHabits = useStore((state) => state.user?.habits || []);
  const toggleHabit = useStore((state) => state.toggleHabit);
  const removeHabit = useStore((state) => state.removeHabit);

  if (!userHabits.length) {
    return (
      <p className="text-center text-gray-500">
        No habits added yet. Add some from the form above or during onboarding!
      </p>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-3">
        {userHabits.map((habit) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  habit.completed
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'border-gray-300 hover:border-indigo-500'
                }`}
              >
                {habit.completed && <Check className="w-4 h-4 text-white" />}
              </button>
              <div>
                <p className={`text-gray-800 ${habit.completed ? 'line-through' : ''}`}>
                  {habit.name}
                </p>
                <p className="text-sm text-gray-500">Streak: {habit.streak} days</p>
              </div>
            </div>
            <button
              onClick={() => removeHabit(habit.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}