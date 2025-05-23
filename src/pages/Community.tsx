import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Users, Award, MessageSquare, Heart, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { formatDistanceToNow } from 'date-fns';

export function Community() {
  const [newPost, setNewPost] = useState('');
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const { user, posts, addPost, likePost, addComment, likeComment } = useStore();

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      addPost(newPost.trim());
      setNewPost('');
    }
  };

  const handleAddComment = (postId: string) => {
    const comment = newComments[postId];
    if (comment?.trim()) {
      addComment(postId, comment.trim());
      setNewComments((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600">Connect and grow together</p>
        </header>

        <section className="mb-8">
          <form onSubmit={handleAddPost} className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your journey..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </form>

          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-4 shadow-sm mb-4"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">
                      {post.userName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{post.userName}</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <p className="text-gray-800 mb-4">{post.content}</p>

                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => likePost(post.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        post.likes.includes(user?.id || '') ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    <span>{post.likes.length}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500">
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.comments.length}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">{comment.userName}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <button
                          onClick={() => likeComment(post.id, comment.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              comment.likes.includes(user?.id || '')
                                ? 'fill-red-500 text-red-500'
                                : ''
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-gray-800">{comment.content}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newComments[post.id] || ''}
                    onChange={(e) =>
                      setNewComments((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!newComments[post.id]?.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      </main>
      <Navigation />
    </div>
  );
}