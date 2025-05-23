import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabaseClient';
import { Group, GroupMember } from '../lib/store'; // Assuming types are exported from store

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, addGroup, addUserMembership } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !user) {
      setError('Group name is required.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create the group in Supabase
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName,
          description: groupDescription,
          creator_id: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;
      if (!groupData) throw new Error('Group creation failed.');

      const newGroup: Group = {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        creator_id: groupData.creator_id,
        created_at: groupData.created_at,
      };

      // 2. Add the creator as an admin member
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: newGroup.id,
          user_id: user.id,
          role: 'admin',
        })
        .select()
        .single();

      if (memberError) {
        // Attempt to clean up the created group if member insertion fails
        await supabase.from('groups').delete().match({ id: newGroup.id });
        throw memberError;
      }
      if (!memberData) throw new Error('Failed to add creator as group member.');
      
      const newMembership: GroupMember = {
        group_id: memberData.group_id,
        user_id: memberData.user_id,
        joined_at: memberData.joined_at,
        role: memberData.role as 'admin' | 'member',
      };

      // 3. Update Zustand store
      addGroup(newGroup);
      addUserMembership(newMembership);

      setGroupName('');
      setGroupDescription('');
      onClose();
    } catch (err) {
      console.error('Error creating group:', err);
      setError((err as Error).message || 'Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Group</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !groupName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}