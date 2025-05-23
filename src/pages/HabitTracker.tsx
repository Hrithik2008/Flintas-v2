import React from 'react';
import { Navigation } from '../components/Navigation';
import { HabitForm } from '../components/HabitForm';
import { HabitList } from '../components/HabitList';
import { motion } from 'framer-motion';

export function HabitTracker() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8 text-center">
            My Habit Dashboard
          </h1>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            {/* HabitForm for adding new habits. Editing is handled within HabitList. */}
            <HabitForm />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <HabitList />
          </motion.div>
        </div>
      </main>
    </div>
  );
}