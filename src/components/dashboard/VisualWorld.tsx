import React from 'react';
import { Trees as TreeIcon, Cloud, Star, Sun } from 'lucide-react'; // Renamed Tree to TreeIcon to avoid conflict
import { useStore } from '../../lib/store';
import { motion } from 'framer-motion';

const XP_PER_LEVEL = 100; // Define XP needed to level up

export function VisualWorld() {
  const user = useStore((state) => state.user);

  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  const xpProgress = (currentXp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  const treeVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        type: 'spring',
        stiffness: 100,
      },
    }),
  };

  return (
    <div className="relative h-56 sm:h-64 bg-gradient-to-b from-sky-400 to-sky-600 rounded-xl overflow-hidden shadow-lg">
      {/* Sun/Moon (Optional: could be dynamic based on time) */}
      <motion.div
        className="absolute top-4 right-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Sun className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300" />
      </motion.div>

      {/* Clouds */}
      <motion.div
        className="absolute top-6 left-6 sm:top-8 sm:left-8"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 50 }}
      >
        <Cloud className="w-12 h-12 sm:w-16 sm:h-16 text-white/70" />
      </motion.div>
      <motion.div
        className="absolute top-12 right-12 sm:top-16 sm:right-16"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 50 }}
      >
        <Cloud className="w-10 h-10 sm:w-12 sm:h-12 text-white/60" />
      </motion.div>


      {/* Trees based on level */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 flex items-end justify-center gap-x-2 sm:gap-x-4 px-2">
        {/* Level 1: One small tree */}
        {currentLevel >= 1 && (
          <motion.div custom={0} variants={treeVariants} initial="hidden" animate="visible" className="mb-1">
            <TreeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
          </motion.div>
        )}
        {/* Level 2: One medium tree (replaces small or adds to it) */}
        {currentLevel >= 2 && (
          <motion.div custom={1} variants={treeVariants} initial="hidden" animate="visible" className="mb-0">
            <TreeIcon className="w-14 h-14 sm:w-16 sm:h-16 text-green-600" />
          </motion.div>
        )}
        {/* Level 3: Adds another small tree */}
        {currentLevel >= 3 && (
          <motion.div custom={2} variants={treeVariants} initial="hidden" animate="visible" className="mb-1 ml-[-10px] sm:ml-[-15px]">
            <TreeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-700" />
          </motion.div>
        )}
        {/* Level 4: Adds another medium tree */}
        {currentLevel >= 4 && (
          <motion.div custom={3} variants={treeVariants} initial="hidden" animate="visible" className="mb-0 mr-[-10px] sm:mr-[-15px]">
            <TreeIcon className="w-14 h-14 sm:w-16 sm:h-16 text-green-700" />
          </motion.div>
        )}
        {/* Level 5+: Adds a large tree */}
        {currentLevel >= 5 && (
          <motion.div custom={4} variants={treeVariants} initial="hidden" animate="visible" className="mb-[-5px]">
            <TreeIcon className="w-16 h-16 sm:w-20 sm:h-20 text-lime-600" />
          </motion.div>
        )}
      </div>
      
      {/* Stars for higher levels (optional flair) */}
      {currentLevel >= 3 && (
         <motion.div
            className="absolute top-16 left-1/3 sm:top-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
        </motion.div>
      )}
       {currentLevel >= 5 && (
         <motion.div
            className="absolute top-8 left-2/3 sm:top-12"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
        </motion.div>
      )}


      {/* Level and XP display */}
      <div className="absolute inset-x-0 top-4 sm:top-6 flex flex-col items-center justify-center z-10">
        <p className="text-white text-lg sm:text-xl font-semibold mb-1 sm:mb-2 drop-shadow-md">
          Level {currentLevel}
        </p>
        <div className="w-36 sm:w-48 bg-white/30 rounded-full h-2.5 sm:h-3 shadow-inner">
          <motion.div
            className="bg-yellow-400 rounded-full h-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-white/90 text-xs sm:text-sm mt-1 drop-shadow-sm">
          {currentXp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP
        </p>
      </div>
    </div>
  );
}