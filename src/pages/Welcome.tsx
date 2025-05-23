import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

export function Welcome() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 flex flex-col items-center justify-center px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="text-center">
        <motion.div
          className="bg-white/20 p-4 rounded-full inline-block mb-8"
          variants={itemVariants}
        >
          <Sprout className="w-16 h-16 text-white" />
        </motion.div>
        <motion.h1
          className="text-4xl font-bold text-white mb-4"
          variants={itemVariants}
        >
          Welcome to Flintas
        </motion.h1>
        <motion.p
          className="text-white/90 text-lg mb-12"
          variants={itemVariants}
        >
          Your journey to better habits starts here
        </motion.p>
        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.button
            onClick={() => navigate('/signup')}
            className="w-full bg-white text-indigo-600 py-3 px-8 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
          <motion.button
            onClick={() => navigate('/signup?mode=login')}
            className="w-full bg-transparent border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            I already have an account
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}