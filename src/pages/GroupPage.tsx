import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useStore, Group, GroupMember } from '../lib/store';
import { Navigation } from '../components/Navigation';
import { ArrowLeft, LogIn, LogOut, Users, Info } from 'lucide-react';

export function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user, groups, userMemberships, addUserMembership, removeUserMembership, setGroups } = useStore();

  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingMembership, setIsProcessingMembership] = useState(false);

  useEffect(() => {
    if (!groupId) {
      navigate('/community'); // Or some error page
      return;
    }

    const fetchGroupDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Try to find group in store first
        const existingGroup = groups.find(g => g.id === groupId);
        if (existingGroup) {
          setGroup(existingGroup);
        } else {
          // Fetch from Supabase if not in store
          const { data, error: groupError } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .single();
          if (groupError) throw groupError;
          if (data) {
            setGroup(data as Group);
            // Optionally add to store if fetched, though Community page should populate it
            // useStore.getState().addGroup(data as Group); // Avoid direct mutation if possible
          } else {
            throw new Error('Group not found.');
          }
        }
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError((err as Error).message || 'Failed to load group details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId, groups, navigate]);

  useEffect(() => {
    // Check if current user is a member of this group
    setIsMember(userMemberships.some(m => m.group_id === groupId && m.user_id === user?.id));
  }, [userMemberships, groupId, user]);


  const handleJoinGroup = async () => {
    if (!user || !group) return;
    setIsProcessingMembership(true);
    setError(null);
    try {
      const { data, error: joinError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id, role: 'member' })
        .select()
        .single();

      if (joinError) throw joinError;
      if (!data) throw new Error('Failed to join group.');
      
      addUserMembership(data as GroupMember);
      setIsMember(true);
    } catch (err) {
      console.error('Error joining group:', err);
      setError((err as Error).message || 'Could not join group. Please try again.');
    } finally {
      setIsProcessingMembership(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!user || !group) return;
    setIsProcessingMembership(true);
    setError(null);
    try {
      const { error: leaveError } = await supabase
        .from('group_members')
        .delete()
        .match({ group_id: group.id, user_id: user.id });

      if (leaveError) throw leaveError;
      
      removeUserMembership(group.id);
      setIsMember(false);
    } catch (err) {
      console.error('Error leaving group:', err);
      setError((err as Error).message || 'Could not leave group. Please try again.');
    } finally {
      setIsProcessingMembership(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading group details...</p>
        <Navigation />
      </div>
    );
  }

  if (error && !group) { // If error and group is not loaded at all
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => navigate('/community')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Community
        </button>
        <Navigation />
      </div>
    );
  }
  
  if (!group) { // Should be caught by error state, but as a fallback
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Group not found.</p>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/community')}
          className="mb-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={20} /> Back to Community
        </button>

        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
            <p className="text-gray-600 text-md">{group.description || 'No description provided.'}</p>
            <p className="text-xs text-gray-400 mt-1">Created: {new Date(group.created_at).toLocaleDateString()}</p>
          </header>

          {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-md">Error: {error}</p>}

          <div className="mt-6">
            {user ? (
              isMember ? (
                <button
                  onClick={handleLeaveGroup}
                  disabled={isProcessingMembership}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70 transition-colors"
                >
                  <LogOut size={20} /> {isProcessingMembership ? 'Leaving...' : 'Leave Group'}
                </button>
              ) : (
                <button
                  onClick={handleJoinGroup}
                  disabled={isProcessingMembership}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 transition-colors"
                >
                  <LogIn size={20} /> {isProcessingMembership ? 'Joining...' : 'Join Group'}
                </button>
              )
            ) : (
              <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-md">
                Please log in to join or interact with groups.
              </p>
            )}
          </div>

          {/* Placeholder for future content like member list or posts */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Group Information</h2>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Info size={18} />
                <span>This is a basic view of the group. More features coming soon!</span>
            </div>
            {isMember && 
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-md">
                <Users size={18} />
                <span>You are a member of this group.</span>
              </div>
            }
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  );
}