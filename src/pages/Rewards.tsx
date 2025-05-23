import React from 'react';
import { Navigation } from '../components/Navigation';
import { Trophy, Star, Gift, Crown } from 'lucide-react';

export function Rewards() {
  const achievements = [
    {
      id: 1,
      title: "Early Bird",
      description: "Complete morning routine 7 days in a row",
      progress: 5,
      total: 7,
      icon: Star,
    },
    {
      id: 2,
      title: "Eco Warrior",
      description: "Track 30 sustainable actions",
      progress: 22,
      total: 30,
      icon: Crown,
    }
  ];

  const rewards = [
    {
      id: 1,
      title: "Custom Theme",
      description: "Unlock new visual themes for your world",
      xpRequired: 1000,
      currentXp: 850,
      icon: Gift,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
          <p className="text-gray-600">Your achievements and rewards</p>
        </header>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Current Achievements</h2>
            <Trophy className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {achievements.map(achievement => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="mt-2">
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className="h-2 bg-indigo-600 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.progress} / {achievement.total}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Available Rewards</h2>
            <Gift className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {rewards.map(reward => {
              const Icon = reward.icon;
              return (
                <div key={reward.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{reward.title}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <div className="mt-2">
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className="h-2 bg-indigo-600 rounded-full"
                            style={{ width: `${(reward.currentXp / reward.xpRequired) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {reward.currentXp} / {reward.xpRequired} XP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Navigation />
    </div>
  );
}