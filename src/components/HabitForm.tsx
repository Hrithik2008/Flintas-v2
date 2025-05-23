import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../lib/store';
import { motion } from 'framer-motion';

export function HabitForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [habitName, setHabitName] = useState('');
  const addHabit = useStore((state) => state.addHabit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      addHabit({
        name: habitName,
        completed: false,
        streak: 0,
        lastCompleted: null,
      });
      setHabitName('');
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Habit</span>
        </motion.button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-4 shadow-sm"
        >
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Enter habit name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Habit
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}