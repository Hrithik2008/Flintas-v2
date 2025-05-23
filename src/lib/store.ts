import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfDay, isAfter } from 'date-fns';

export interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  xp: number;
  avatarUrl?: string; // Changed from avatar to avatarUrl and made optional
  bio?: string;
  goals?: string; // Added goals property
  interests?: string[]; // Added interests, optional array of strings
  habits: Habit[]; // Habits are now part of the User
}

export interface Comment { // Exported
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: string[];
}

export interface Post { // Exported
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  created_at: string;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  joined_at: string;
  role: 'admin' | 'member';
}

// Define Habit Categories
export type HabitCategory = 'Academic' | 'Wellness' | 'Social Engagement' | 'Other';

export interface Habit {
  id: string;
  name: string;
  description?: string; // Optional description
  category: HabitCategory; // Added category
  
  completed: boolean; // For daily check-off habits / overall completion status
  streak: number;
  lastCompleted: string | null; // Timestamp of last completion

  // For habits with specific targets (e.g., study 2 hours, run 5 km)
  targetType?: 'boolean' | 'numerical'; // To differentiate habit types, defaults to 'boolean'
  targetValue?: number; // e.g., 2 (hours), 5 (km) - for numerical habits
  currentValue?: number; // e.g., 1.5 (hours), 3 (km) - current progress for numerical habits
  targetUnit?: string; // e.g., "hours", "km", "pages" - for numerical habits

  reminderTime?: string; // Optional reminder time (e.g., "09:00")
  // Future considerations: frequency (daily, weekly, specific days), icon, creationDate
}

export interface DailyTask {
  id: string;
  text: string;
  category_tags?: string[];
  source: 'llm' | 'fallback';
}

export const fallbackDailyTasks: Omit<DailyTask, 'id' | 'source'>[] = [
  { text: "Take a 5-minute stretching break.", category_tags: ["wellness", "physical"] },
  { text: "Write down one thing you're grateful for today.", category_tags: ["mindfulness", "wellness"] },
  { text: "Read one article or blog post related to your interests.", category_tags: ["learning", "personal_growth"] },
  { text: "Drink a glass of water right now.", category_tags: ["health", "wellness"] },
  { text: "Spend 10 minutes tidying up your workspace.", category_tags: ["productivity", "organization"] },
  { text: "Reach out to a friend or family member you haven't spoken to recently.", category_tags: ["social", "connection"] },
  { text: "Learn one new word or concept.", category_tags: ["learning"] },
  { text: "Step outside for 5 minutes of fresh air.", category_tags: ["wellness", "nature"] },
  { text: "Plan one small, healthy meal for tomorrow.", category_tags: ["health", "planning"] },
  { text: "Reflect on one accomplishment from the past week.", category_tags: ["mindfulness", "reflection"] }
];


interface AppState {
  user: User | null;
  // habits: Habit[]; // Removed global habits
  posts: Post[];
  groups: Group[]; // For discoverable groups
  userMemberships: GroupMember[]; // For current user's memberships
  currentDailyTask: DailyTask | null; // Added for daily task
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateProfile: (updates: Partial<User>) => void; // Allow updating any part of the user profile, habits still managed separately by specific actions
  // setHabits: (habits: Habit[]) => void; // Removed setHabits
  toggleHabit: (habitId: string) => void; // Primarily for boolean habits or marking numerical as "done for the day"
  addHabit: (newHabitData: {
    name: string;
    category: HabitCategory;
    description?: string;
    targetType?: 'boolean' | 'numerical';
    targetValue?: number;
    targetUnit?: string;
    reminderTime?: string;
  }) => void;
  updateHabit: (habitId: string, updates: Partial<Omit<Habit, 'id'>>) => void;
  updateHabitProgress: (habitId: string, addedValue: number) => void; // New action for numerical progress
  removeHabit: (habitId: string) => void;
  resetDailyHabits: () => void;
  setPosts: (posts: Post[]) => void; // New action to set all posts
  addPost: (post: Post) => void; // Modified to accept a Post object
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void; // Modified to accept a Comment object
  likeComment: (postId: string, commentId: string) => void;
  setCurrentDailyTask: (task: DailyTask | null) => void; // Added for daily task

  // Group Actions
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void; // Adds a newly created group to the local store
  setUserMemberships: (memberships: GroupMember[]) => void;
  addUserMembership: (membership: GroupMember) => void;
  removeUserMembership: (groupId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      // habits: [], // Removed global habits
      posts: [],
      groups: [],
      userMemberships: [],
      currentDailyTask: null, // Added for daily task
      isAuthenticated: false,
      setUser: (newUserFromAction) => {
        if (!newUserFromAction) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        // Destructure to separate known properties and allow for potential existing ones
        // Ensure id, email, name are present as they are not optional in User interface (excluding other optionals)
        const { id, email, name, habits, level, xp, ...restOfNewUser } = newUserFromAction;
        
        set({
          user: {
            id, // id is required
            email, // email is required
            name, // name is required
            ...restOfNewUser, // Spread the rest of the provided properties
            habits: habits ?? [], // Default to empty array if habits is undefined or null
            level: level ?? 1,     // Default to 1 if level is undefined or null
            xp: xp ?? 0,         // Default to 0 if xp is undefined or null
          },
          isAuthenticated: true,
        });
      },
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      // setHabits: (habits) => set({ habits }), // Removed
      toggleHabit: (habitId) =>
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              habits: state.user.habits.map((habit) =>
                habit.id === habitId
                  ? {
                      ...habit,
                      completed: !habit.completed,
                      lastCompleted: !habit.completed ? new Date().toISOString() : habit.lastCompleted,
                      streak: !habit.completed ? habit.streak + 1 : (habit.completed ? habit.streak -1 : habit.streak), // Adjust streak correctly
                    }
                  : habit
              ),
            },
          };
        }),
      addHabit: (newHabitData) =>
            set((state) => {
              if (!state.user) return {};
              const newHabit: Habit = {
                id: Math.random().toString(36).substr(2, 9),
                name: newHabitData.name,
                category: newHabitData.category,
                description: newHabitData.description,
                targetType: newHabitData.targetType ?? 'boolean',
                targetValue: newHabitData.targetValue,
                currentValue: 0, // Initialize currentValue to 0
                targetUnit: newHabitData.targetUnit,
                reminderTime: newHabitData.reminderTime,
                completed: false, // New habits start as not completed for the day
                streak: 0,
                lastCompleted: null,
              };
              return {
                user: {
              ...state.user,
              habits: [...state.user.habits, newHabit],
            },
          };
        }),
      removeHabit: (habitId) =>
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              habits: state.user.habits.filter((habit) => habit.id !== habitId),
            },
          };
        }),
      updateHabit: (habitId, updates) =>
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              habits: state.user.habits.map((habit) =>
                habit.id === habitId ? { ...habit, ...updates } : habit
              ),
            },
          };
        }),
      updateHabitProgress: (habitId, addedValue) =>
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              habits: state.user.habits.map((habit) => {
                if (habit.id === habitId && habit.targetType === 'numerical') {
                  const newCurrentValue = (habit.currentValue || 0) + addedValue;
                  const isCompleted = habit.targetValue !== undefined && newCurrentValue >= habit.targetValue;
                  return {
                    ...habit,
                    currentValue: newCurrentValue,
                    completed: isCompleted, // Auto-complete if target met
                    // Optionally update lastCompleted and streak if it's newly completed
                    lastCompleted: isCompleted && !habit.completed ? new Date().toISOString() : habit.lastCompleted,
                    streak: isCompleted && !habit.completed ? habit.streak + 1 : habit.streak,
                  };
                }
                return habit;
              }),
            },
          };
        }),
      resetDailyHabits: () =>
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              habits: state.user.habits.map((habit) => {
                const lastCompletedDate = habit.lastCompleted
                  ? startOfDay(new Date(habit.lastCompleted))
                  : null;
                const today = startOfDay(new Date());
                
                return {
                  ...habit,
                  completed: false,
                  // Reset streak if not completed yesterday or before
                  streak: lastCompletedDate && isAfter(today, startOfDay(new Date(new Date(habit.lastCompleted!).setDate(new Date(habit.lastCompleted!).getDate() + 1)))) ? 0 : habit.streak,
                };
              }),
            }
          };
        }),
      setPosts: (posts) => set({ posts }), // Implementation for setPosts
      addPost: (post) => // Modified addPost implementation
        set((state) => ({
          posts: [post, ...state.posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        })),
      likePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: post.likes.includes(state.user?.id || '')
                    ? post.likes.filter((id) => id !== state.user?.id)
                    : [...post.likes, state.user?.id || ''],
                }
              : post
          ),
        })),
      addComment: (postId, comment) => // Modified addComment implementation
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  // Add new comment and sort comments by timestamp (oldest first)
                  comments: [...p.comments, comment].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
                }
              : p
          ),
        })),
      likeComment: (postId, commentId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.map((comment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          likes: comment.likes.includes(state.user?.id || '')
                            ? comment.likes.filter((id) => id !== state.user?.id)
                            : [...comment.likes, state.user?.id || ''],
                        }
                      : comment
                  ),
                }
              : post
            ),
          })),
    
        // Group Actions Implementations
        setGroups: (groups) => set({ groups }),
        addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
        setUserMemberships: (memberships) => set({ userMemberships: memberships }),
        addUserMembership: (membership) =>
          set((state) => ({
            userMemberships: [...state.userMemberships, membership],
          })),
        removeUserMembership: (groupId) =>
          set((state) => ({
            userMemberships: state.userMemberships.filter(
              (m) => m.group_id !== groupId
            ),
          })),
      setCurrentDailyTask: (task) => set({ currentDailyTask: task }), // Added for daily task
      }),
      {
        name: 'app-storage',
      onRehydrateStorage: () => (state) => {
        // Reset habits daily when the store is rehydrated
        if (state?.user) { // Check if user exists before calling
          state.resetDailyHabits();
        }
      },
    }
  )
);