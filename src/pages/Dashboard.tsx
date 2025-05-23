import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DailyQuote } from '../components/dashboard/DailyQuote';
import { VisualWorld } from '../components/dashboard/VisualWorld';
// Navigation is now handled globally in App.tsx
import { HabitForm } from '../components/HabitForm';
import { HabitList } from '../components/HabitList';
import { useStore, fallbackDailyTasks, DailyTask } from '../lib/store';
import { supabase } from '../lib/supabaseClient';

export function Dashboard() {
  const user = useStore((state) => state.user);
  const currentDailyTask = useStore((state) => state.currentDailyTask);
  const setCurrentDailyTask = useStore((state) => state.setCurrentDailyTask);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  // TODO: Persist task completion status and reset daily

  useEffect(() => {
    const fetchOrSetDailyTask = async () => {
      if (currentDailyTask) {
        // Potentially add a check here to see if the task is for the current day
        // For now, if a task exists, we assume it's the current one.
        return;
      }

      if (!user) return; // Wait for user data

      try {
        const userContext: { interest?: string; goal?: string } = {};
        if (user.interests && user.interests.length > 0) {
          userContext.interest = user.interests[0];
        }
        if (user.goals) {
          userContext.goal = user.goals;
        }

        const { data, error } = await supabase.functions.invoke('get-daily-task', {
          body: userContext,
        });

        if (error) throw error;

        if (data && data.task) {
          setCurrentDailyTask({
            id: `llm-${new Date().toISOString()}`, // Simple unique ID
            text: data.task,
            source: 'llm',
          });
        } else {
          throw new Error("LLM did not return a task.");
        }
      } catch (err) {
        console.warn("Failed to fetch LLM task, using fallback:", err);
        const randomIndex = Math.floor(Math.random() * fallbackDailyTasks.length);
        const fallbackTask = fallbackDailyTasks[randomIndex];
        setCurrentDailyTask({
          id: `fallback-${randomIndex}-${new Date().toISOString()}`,
          text: fallbackTask.text,
          category_tags: fallbackTask.category_tags,
          source: 'fallback',
        });
      }
    };

    fetchOrSetDailyTask();
  }, [user, currentDailyTask, setCurrentDailyTask]);

  const handleCompleteTask = () => {
    setIsTaskCompleted(true);
    console.log("Daily task marked as completed:", currentDailyTask);
    // Future: Integrate with XP/rewards system
  };

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

        {/* Daily Task Card */}
        {currentDailyTask && (
          <motion.section
            className="bg-white p-6 rounded-xl shadow-lg mb-8"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.15 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold text-gray-800">Your Daily Task</h2>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${currentDailyTask.source === 'llm' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {currentDailyTask.source === 'llm' ? 'Personalized' : 'From Bank'}
              </span>
            </div>
            <p className="text-gray-700 text-lg mb-4">{currentDailyTask.text}</p>
            <button
              onClick={handleCompleteTask}
              disabled={isTaskCompleted}
              className={`w-full px-4 py-2 rounded-md font-semibold transition-colors
                ${isTaskCompleted
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
            >
              {isTaskCompleted ? 'Completed!' : 'Mark as Completed'}
            </button>
          </motion.section>
        )}

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