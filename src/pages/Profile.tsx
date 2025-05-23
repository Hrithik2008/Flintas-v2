import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Settings, Bell, Shield, HelpCircle, Camera, Save, UserCircle, Activity, Award, CalendarDays, Edit3, Sparkles } from 'lucide-react'; // Added icons
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';

// Placeholder for Achievement Timeline Item
const AchievementItem = ({ title, date, icon }: { title: string; date: string; icon: React.ReactNode }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  </div>
);


export function Profile() {
  const { user, updateProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    interests: user?.interests || [], // Added interests
    avatarUrl: user?.avatarUrl || '', // Added avatarUrl
  });

  const handleInterestsChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Assuming updateProfile can handle the new fields.
    // This might require an update to the Zustand store's updateProfile action.
    updateProfile({
      name: formData.name,
      bio: formData.bio,
      interests: formData.interests,
      avatarUrl: formData.avatarUrl, // Potentially handle avatar upload separately
    });
    setIsEditing(false);
  };

  const availableInterests = ["Studying", "Exercise", "Meditation", "Reading", "Coding", "Music"];


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-3xl"> {/* Increased max-width for more space */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1> {/* Updated title */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {isEditing ? <Save className="w-6 h-6" /> : <Edit3 className="w-6 h-6" />}
            </button>
          </div>
        </motion.header>

        {/* User Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8" // Enhanced shadow
        >
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover" />
                  ) : (
                    <div className="w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center">
                       <UserCircle className="w-16 h-16 text-indigo-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    // onClick={() => {/* Implement avatar upload logic */}}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Camera className="w-5 h-5 text-indigo-600" />
                  </button>
                </div>
                 <input
                    type="text"
                    placeholder="Avatar URL (optional)"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="mt-2 w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About Me</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Interests</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {availableInterests.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestsChange(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                        ${formData.interests.includes(interest)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>


              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data if needed
                    setFormData({
                        name: user?.name || '',
                        bio: user?.bio || '',
                        interests: user?.interests || [],
                        avatarUrl: user?.avatarUrl || '',
                      });
                  }}
                  className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="flex flex-col items-center mb-4">
                 {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-3" />
                  ) : (
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                       <UserCircle className="w-12 h-12 text-indigo-500" />
                    </div>
                  )}
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User Name'}</h2>
                <p className="text-gray-600">Level {user?.level || 1} • {user?.xp || 0} XP</p>
              </div>
              {user?.bio && (
                <p className="mt-2 text-gray-700 max-w-md mx-auto">{user.bio}</p>
              )}
              {user?.interests && user.interests.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Interests</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {user.interests.map(interest => (
                      <span key={interest} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* Summary of Tracked Habits - Placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Tracked Habits Summary</h3>
          </div>
          <p className="text-gray-600">Your habit tracking summary will appear here. (e.g., current streaks, completion rates).</p>
          {/* Placeholder content, to be developed later */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700">Start tracking habits to see your progress!</p>
          </div>
        </motion.section>

        {/* Achievement Timeline - Structural Basis */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <Award className="w-7 h-7 text-yellow-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Achievement Timeline</h3>
          </div>
          <div className="space-y-4">
            {/* Placeholder items - these would be dynamically generated */}
            <AchievementItem title="Joined 'Study Squad' Club" date="May 20, 2025" icon={<Sparkles className="w-5 h-5 text-indigo-500" />} />
            <AchievementItem title="Completed '7-Day Meditation Streak'" date="May 15, 2025" icon={<CalendarDays className="w-5 h-5 text-indigo-500" />} />
            <AchievementItem title="Reached Level 2!" date="May 10, 2025" icon={<Award className="w-5 h-5 text-indigo-500" />} />
            <p className="text-center text-gray-500 pt-2">More achievements will appear here as you earn them!</p>
          </div>
        </motion.section>


        {/* Settings Section - Kept from original, can be refactored if needed */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">App Settings</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Notifications</span>
              </div>
              {/* Add arrow or indicator if it navigates */}
            </button>

            <button className="w-full flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Privacy & Security</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Help & Support</span>
              </div>
            </button>
          </div>
        </motion.section>
      </main>
      <Navigation />
    </div>
  );
}