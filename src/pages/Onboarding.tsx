import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, PlusCircle, XCircle, Sparkles } from 'lucide-react'; // Added Sparkles for interests
import { useStore, User } from '../lib/store'; // Imported User type

export function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile, addHabit, user } = useStore(); // Added user to get existing interests if any
  const [goals, setGoals] = useState(user?.goals || '');
  const [currentHabit, setCurrentHabit] = useState('');
  const [habitsList, setHabitsList] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);

  const availableInterests = ["Studying", "Exercise", "Meditation", "Reading", "Coding", "Music", "Art", "Travel", "Cooking", "Gaming"];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleAddHabit = () => {
    if (currentHabit.trim() !== '' && !habitsList.includes(currentHabit.trim())) {
      setHabitsList([...habitsList, currentHabit.trim()]);
      setCurrentHabit('');
    }
  };

  const handleRemoveHabit = (habitToRemove: string) => {
    setHabitsList(habitsList.filter(habit => habit !== habitToRemove));
  };

  const handleSubmit = () => {
    const profileUpdates: Partial<User> = {};
    if (goals.trim() !== '') {
      profileUpdates.goals = goals.trim();
    }
    if (selectedInterests.length > 0) {
      profileUpdates.interests = selectedInterests;
    }
    
    if (Object.keys(profileUpdates).length > 0) {
        updateProfile(profileUpdates);
    }

    habitsList.forEach(habitName => {
      addHabit({ name: habitName, category: 'Other' });
    });

    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Adjusted for more elements
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10" // Adjusted padding
        variants={itemVariants} // This main card will also animate
      >
        <motion.div
          className="flex flex-col items-center mb-6" // Centered icon and title
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          >
            <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 text-center"
            variants={itemVariants}
          >
            Let's Get to Know You!
          </motion.h1>
          
          <motion.p
            className="text-gray-600 text-md sm:text-lg mb-8 text-center"
            variants={itemVariants}
          >
            Tell us about your goals and the habits you want to build.
          </motion.p>
        </motion.div>

        {/* Goals Section */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label htmlFor="goals" className="block text-lg font-medium text-gray-700 mb-2">
            What are your main goals?
          </label>
          <textarea
            id="goals"
            name="goals"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Improve my fitness, learn a new skill, read more books..."
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </motion.div>

        {/* Interests Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            What are your interests? <span className="text-sm text-gray-500">(Select a few)</span>
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {availableInterests.map((interest) => (
              <motion.button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ease-in-out border-2
                  ${selectedInterests.includes(interest)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {interest}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Habits Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <label htmlFor="habit-input" className="block text-lg font-medium text-gray-700 mb-2">
            What habits do you want to track? <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <div className="flex items-center gap-2 mb-3">
            <input
              id="habit-input"
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Drink 8 glasses of water"
              value={currentHabit}
              onChange={(e) => setCurrentHabit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
            />
            <motion.button
              type="button"
              onClick={handleAddHabit}
              className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <PlusCircle size={24} />
            </motion.button>
          </div>
          {habitsList.length > 0 && (
            <motion.ul className="space-y-2" variants={containerVariants}> {/* Animate list appearance */}
              {habitsList.map((habit, index) => (
                <motion.li
                  key={index}
                  className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg"
                  variants={itemVariants} // Animate each list item
                  layout // Animate layout changes (add/remove)
                >
                  <span className="text-gray-700">{habit}</span>
                  <motion.button
                    type="button"
                    onClick={() => handleRemoveHabit(habit)}
                    className="text-red-500 hover:text-red-700"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <XCircle size={20} />
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
        
        <motion.button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants} // Animate button
        >
          Save & Continue to Dashboard
        </motion.button>
      </motion.div>
    </motion.div>
  );
}