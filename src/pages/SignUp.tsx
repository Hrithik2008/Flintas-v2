import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, ArrowLeft, Loader, LogIn } from 'lucide-react'; // Added LogIn icon
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client

export function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useStore((state) => state.setUser);

  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setIsLoginMode(queryParams.get('mode') === 'login');
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // Handle Login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          throw signInError;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.full_name || 'User', // Fallback name
            level: 1, // This might need to be fetched or stored differently for existing users
            xp: 0,    // This might need to be fetched or stored differently
            habits: [] // This might need to be fetched
          });
          navigate('/dashboard'); // Navigate to dashboard on login
        } else {
          setError('Login successful, but no user data returned.');
        }
      } else {
        // Handle Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.full_name || formData.name,
            level: 1,
            xp: 0,
            habits: []
          });
          navigate('/onboarding'); // Navigate to onboarding on sign up
        } else {
          setError('Sign up successful, but no user data returned. Please try logging in.');
        }
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${isLoginMode ? 'sign in' : 'sign up'}. Please check your details and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const pageTitle = isLoginMode ? 'Welcome Back!' : 'Create your account';
  const pageSubtitle = isLoginMode ? 'Sign in to continue your journey' : 'Join us to start your journey';
  const buttonText = isLoginMode ? 'Sign In' : 'Create Account';
  const switchModeText = isLoginMode ? "Don't have an account?" : 'Already have an account?';
  const switchModeLink = isLoginMode ? '/signup' : '/signup?mode=login';
  const switchModeLinkText = isLoginMode ? 'Sign Up' : 'Sign In';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/welcome"
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Welcome
          </Link>
        </motion.div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4"
          >
            {isLoginMode ? <LogIn className="w-8 h-8 text-indigo-600" /> : <UserPlus className="w-8 h-8 text-indigo-600" />}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-900"
          >
            {pageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-600 mt-2"
          >
            {pageSubtitle}
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
          }}
        >
          {!isLoginMode && (
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                placeholder="Your name"
                required={!isLoginMode}
              />
            </motion.div>
          )}

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="you@example.com"
              required
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="••••••••"
              required
              minLength={isLoginMode ? undefined : 8} // Password length check only for sign up
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.97 }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              buttonText
            )}
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          {switchModeText}{' '}
          <Link to={switchModeLink} className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            {switchModeLinkText}
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}