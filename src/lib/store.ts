import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfDay, isAfter } from 'date-fns';

interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  xp: number;
  avatar?: string;
  bio?: string;
  goals?: string; // Added goals property
  habits: Habit[]; // Habits are now part of the User
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: string[];
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
}

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  lastCompleted: string | null;
}

interface AppState {
  user: User | null;
  // habits: Habit[]; // Removed global habits
  posts: Post[];
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateProfile: (updates: Partial<Omit<User, 'habits'>>) => void; // Profile updates shouldn't directly set habits array
  // setHabits: (habits: Habit[]) => void; // Removed setHabits
  toggleHabit: (habitId: string) => void;
  addHabit: (habit: Pick<Habit, 'name' | 'completed'> & Partial<Pick<Habit, 'streak' | 'lastCompleted'>>) => void;
  removeHabit: (habitId: string) => void;
  resetDailyHabits: () => void;
  addPost: (content: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  likeComment: (postId: string, commentId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      // habits: [], // Removed global habits
      posts: [],
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
      addHabit: (habitDetails) =>
        set((state) => {
          if (!state.user) return {};
          const newHabit: Habit = {
            ...habitDetails,
            id: Math.random().toString(36).substr(2, 9),
            streak: habitDetails.streak ?? 0,
            lastCompleted: habitDetails.lastCompleted ?? null,
            completed: habitDetails.completed ?? false,
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
      addPost: (content) =>
        set((state) => ({
          posts: [
            {
              id: Math.random().toString(36).substr(2, 9),
              userId: state.user?.id || '',
              userName: state.user?.name || '',
              content,
              timestamp: new Date().toISOString(),
              likes: [],
              comments: [],
            },
            ...state.posts,
          ],
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
      addComment: (postId, content) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      userId: state.user?.id || '',
                      userName: state.user?.name || '',
                      content,
                      timestamp: new Date().toISOString(),
                      likes: [],
                    },
                  ],
                }
              : post
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