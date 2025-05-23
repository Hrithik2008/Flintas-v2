import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Settings, Bell, Shield, HelpCircle, Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';

export function Profile() {
  const { user, updateProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-semibold text-indigo-600">
                      {formData.name.charAt(0)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-indigo-600">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">Level {user?.level} • {user?.xp} XP</p>
                </div>
              </div>
              {user?.bio && (
                <p className="mt-4 text-gray-700">{user.bio}</p>
              )}
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Notifications</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Privacy</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-600" />
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