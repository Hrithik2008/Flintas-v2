import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Habit } from '../lib/store'; // Imported Habit type
import { Check, X, Edit3, TrendingUp, PlusCircle } from 'lucide-react';
import { HabitForm } from './HabitForm'; // Import HabitForm

export function HabitList() {
  const userHabits = useStore((state) => state.user?.habits || []);
  const toggleHabit = useStore((state) => state.toggleHabit);
  const removeHabit = useStore((state) => state.removeHabit);
  const updateHabitProgress = useStore((state) => state.updateHabitProgress); // Use new action

  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [numericalProgressValue, setNumericalProgressValue] = useState<string>('');


  const handleNumericalProgressSubmit = (habit: Habit) => {
    const addedValue = parseFloat(numericalProgressValue);
    if (!isNaN(addedValue) && habit.targetType === 'numerical') {
      updateHabitProgress(habit.id, addedValue);
      setNumericalProgressValue(''); // Reset input
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'bg-blue-100 text-blue-700';
      case 'Wellness': return 'bg-green-100 text-green-700';
      case 'Social Engagement': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  if (!userHabits.length && !editingHabit) { // Also check if not editing
    return (
      <p className="text-center text-gray-500 py-8">
        No habits added yet. Start by adding one!
      </p>
    );
  }

  if (editingHabit) {
    return (
      <HabitForm
        habitToEdit={editingHabit}
        onClose={() => setEditingHabit(undefined)}
        isOpenInitially={true}
      />
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {userHabits.map((habit) => (
          <motion.div
            key={habit.id}
            layout // Added layout for smoother animations on change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-white rounded-xl p-5 shadow-lg border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {habit.targetType === 'boolean' && (
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-7 h-7 mt-1 rounded-full border-2 flex items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-110 ${
                      habit.completed
                        ? 'bg-indigo-600 border-indigo-600 shadow-md'
                        : 'border-gray-300 hover:border-indigo-500'
                    }`}
                  >
                    {habit.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                )}
                 {habit.targetType === 'numerical' && (
                  <div className="mt-1 w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <TrendingUp size={16} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-lg font-semibold text-gray-800 ${habit.completed && habit.targetType === 'boolean' ? 'line-through text-gray-500' : ''}`}>
                      {habit.name}
                    </p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(habit.category)}`}>
                      {habit.category}
                    </span>
                  </div>
                  {habit.description && <p className="text-sm text-gray-600 mb-1">{habit.description}</p>}
                  
                  <p className="text-xs text-indigo-600 font-medium">Streak: {habit.streak} days</p>

                  {habit.targetType === 'numerical' && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                        <span>Progress: {habit.currentValue || 0} / {habit.targetValue || 'N/A'} {habit.targetUnit || ''}</span>
                        {habit.targetValue !== undefined && (habit.currentValue || 0) >= habit.targetValue && (
                           <span className="text-green-500 font-semibold flex items-center gap-1"><Check size={14}/> Target Met!</span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${habit.targetValue ? Math.min(((habit.currentValue || 0) / habit.targetValue) * 100, 100) : 0}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder={`Add ${habit.targetUnit || 'progress'}`}
                          value={numericalProgressValue}
                          onChange={(e) => setNumericalProgressValue(e.target.value)}
                          className="flex-grow px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handleNumericalProgressSubmit(habit)}
                          className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                          aria-label="Add progress"
                        >
                          <PlusCircle size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-2">
                 <button
                  onClick={() => setEditingHabit(habit)}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                  aria-label="Edit habit"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => removeHabit(habit.id)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Remove habit"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}