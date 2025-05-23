import React from 'react';
import { motion } from 'framer-motion';
import { DailyQuote } from '../components/dashboard/DailyQuote';
import { VisualWorld } from '../components/dashboard/VisualWorld';
// Navigation is now handled globally in App.tsx
import { HabitForm } from '../components/HabitForm';
import { HabitList } from '../components/HabitList';
import { useStore } from '../lib/store';

export function Dashboard() {
  const user = useStore((state) => state.user);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    // pb-20 is handled by App.tsx when navigation is shown
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <main className="container mx-auto px-4 py-8 max-w-3xl"> {/* Increased max-width slightly */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
          className="mb-10 text-center" // Centered header
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome back, {user?.name || 'Friend'}!
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Your journey continues, one step at a time.</p>
        </motion.header>

        {/* User Goals Card */}
        {user?.goals && (
          <motion.section
            className="bg-white p-6 rounded-xl shadow-lg mb-8"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Goals</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{user.goals}</p>
          </motion.section>
        )}

        {/* VisualWorld Card */}
        <motion.section
          className="bg-white p-6 rounded-xl shadow-lg mb-8"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: user?.goals ? 0.35 : 0.2 }} // Adjust delay based on goals card presence
        >
          <VisualWorld />
        </motion.section>

        {/* Habits Section Card */}
        <motion.section
          className="bg-white p-6 rounded-xl shadow-lg mb-8"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: user?.goals ? 0.5 : 0.35 }} // Adjust delay
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Habits</h2>
          <HabitForm />
          <div className="mt-6"> {/* Added margin top for HabitList */}
            <HabitList />
          </div>
        </motion.section>

        {/* DailyQuote Card */}
        <motion.section
          className="bg-white p-6 rounded-xl shadow-lg"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: user?.goals ? 0.65 : 0.5 }} // Adjust delay
        >
          <DailyQuote />
        </motion.section>
      </main>
      {/* <Navigation /> Removed as it's global now */}
    </div>
  );
}