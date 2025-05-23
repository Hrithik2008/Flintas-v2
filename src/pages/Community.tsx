import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Navigation } from '../components/Navigation';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { Users, Award, MessageSquare, Heart, Send, PlusCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Group, Post, Comment } from '../lib/store';
import { supabase } from '../lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

export function Community() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const { user, posts, addPost, likePost, addComment, likeComment, groups, setGroups, setPosts } = useStore();
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoadingGroups(true);
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGroups(data as Group[]);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoadingGroups(false);
      }
    };
    fetchGroups();
  }, [setGroups]);

  // Fetch posts and comments on component mount
  useEffect(() => {
    const fetchPostsAndComments = async () => {
      setIsLoadingPosts(true);
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            created_at,
            user_id,
            users ( name ),
            comments (
              id,
              content,
              created_at,
              user_id,
              users ( name )
            )
          `)
          .order('created_at', { ascending: false })
          .order('created_at', { foreignTable: 'comments', ascending: true });

        if (postsError) throw postsError;

        const formattedPosts: Post[] = postsData.map((post: any) => ({
          id: post.id,
          userId: post.user_id,
          userName: post.users?.[0]?.name || 'Anonymous',
          content: post.content,
          timestamp: post.created_at,
          likes: [], // Likes will be managed by client state or fetched separately if DB schema changes
          comments: post.comments.map((comment: any) => ({
            id: comment.id,
            userId: comment.user_id,
            userName: comment.users?.[0]?.name || 'Anonymous',
            content: comment.content,
            timestamp: comment.created_at,
            likes: [], // Likes will be managed by client state
          })).sort((a: Comment, b: Comment) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchPostsAndComments();
  }, [setPosts, user]); // Add user to dependency array if userName depends on it for display consistency

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({ content: newPostContent.trim(), user_id: user.id })
        .select(`
          id,
          content,
          created_at,
          user_id,
          users ( name )
        `)
        .single();

      if (error) throw error;

      if (data) {
        const newPostObject: Post = {
          id: data.id,
          userId: data.user_id,
          userName: data.users?.[0]?.name || user.name, // Fallback to store user name
          content: data.content,
          timestamp: data.created_at,
          likes: [],
          comments: [],
        };
        addPost(newPostObject);
        setNewPostContent('');
      }
    } catch (error) {
      console.error('Error adding post:', error);
      // Optionally, show an error message to the user
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentContent = newComments[postId];
    if (!commentContent?.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: postId, user_id: user.id, content: commentContent.trim() })
        .select(`
          id,
          content,
          created_at,
          user_id,
          users ( name )
        `)
        .single();

      if (error) throw error;

      if (data) {
        const newCommentObject: Comment = {
          id: data.id,
          userId: data.user_id,
          userName: data.users?.[0]?.name || user.name, // Fallback to store user name
          content: data.content,
          timestamp: data.created_at,
          likes: [],
        };
        addComment(postId, newCommentObject);
        setNewComments((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community</h1>
            <p className="text-gray-600">Connect and grow together</p>
          </div>
          <button
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <PlusCircle size={20} />
            Create Group
          </button>
        </header>

        {/* Group Creation Modal */}
        <CreateGroupModal
          isOpen={isCreateGroupModalOpen}
          onClose={() => setIsCreateGroupModalOpen(false)}
        />

        <section className="mb-8">
          {/* Group List Section */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Discover Groups</h2>
            {isLoadingGroups ? (
              <p className="text-gray-500">Loading groups...</p>
            ) : groups.length === 0 ? (
              <p className="text-gray-500">No groups available yet. Why not create one?</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group) => (
                  <div key={group.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-1">{group.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 truncate">{group.description || 'No description.'}</p>
                    <button
                      onClick={() => navigate(`/groups/${group.id}`)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                       <Eye size={16} /> View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing Posts Section */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Community Feed</h2>
          {user && (
            <form onSubmit={handleAddPost} className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your journey..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newPostContent.trim() || !user}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </form>
          )}

          {isLoadingPosts ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">No posts yet. Be the first to share!</p>
          ) : (
            <AnimatePresence initial={false}>
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
          )}
        </section>
      </main>
      <Navigation />
    </div>
  );
}