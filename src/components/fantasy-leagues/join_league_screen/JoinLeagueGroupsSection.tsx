import React, { useState, useEffect } from 'react';
import { Plus, Users, Copy, Check } from 'lucide-react';
import { leagueGroupService } from '../../../services/leagueGroupService';
import { IUserLeagueGroup, ICreateLeagueGroup, IJoinLeagueGroup } from '../../../types/leagueGroup';
import { IFantasyLeague } from '../../../types/fantasyLeague';

interface JoinLeagueGroupsSectionProps {
  leagues: IFantasyLeague[];
}

export default function JoinLeagueGroupsSection({ leagues }: JoinLeagueGroupsSectionProps) {
  const [userGroups, setUserGroups] = useState<IUserLeagueGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state for creating group
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    fantasy_league_id: '',
    is_public: false,
  });

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const groups = await leagueGroupService.getUserLeagueGroups();
      setUserGroups(groups);
    } catch (error) {
      console.error('Failed to fetch user groups:', error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!createForm.name || !createForm.fantasy_league_id) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      const groupData: ICreateLeagueGroup = {
        name: createForm.name,
        description: createForm.description,
        fantasy_league_id: createForm.fantasy_league_id,
        is_public: createForm.is_public,
      };

      const newGroup = await leagueGroupService.createLeagueGroup(groupData);
      setUserGroups(prev => [newGroup, ...prev]);
      setSuccess('Group created successfully!');
      setShowCreateModal(false);
      resetCreateForm();

      // Auto-copy invite code
      await copyToClipboard(newGroup.invite_code);
      setCopiedCode(newGroup.invite_code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      setError('Failed to create group. Please try again.');
      console.error('Create group error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    try {
      setIsJoining(true);
      setError('');
      const joinData: IJoinLeagueGroup = { invite_code: joinCode.trim() };

      const joinedGroup = await leagueGroupService.joinLeagueGroup(joinData);
      setUserGroups(prev => [joinedGroup, ...prev]);
      setSuccess('Successfully joined group!');
      setShowJoinModal(false);
      setJoinCode('');
    } catch (error: any) {
      if (error.message.includes('fantasy_league_id')) {
        // User needs to join the fantasy league first
        const errorData = JSON.parse(error.message);
        setError(
          `You need to join the fantasy league first. League ID: ${errorData.fantasy_league_id}`
        );
      } else {
        setError('Invalid invite code or you are already a member');
      }
      console.error('Join group error:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      name: '',
      description: '',
      fantasy_league_id: '',
      is_public: false,
    });
  };

  const handleShareGroup = async (group: IUserLeagueGroup) => {
    try {
      await leagueGroupService.shareInvite(group.name, group.invite_code);
    } catch (error) {
      console.error('Failed to share group:', error);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold dark:text-white">My League Groups</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Group
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            Join Group
          </button>
        </div>
      </div>

      {isLoadingGroups ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading your groups...</p>
        </div>
      ) : userGroups.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No League Groups Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create a group to compete with friends or join an existing one
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Your First Group
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Join a Group
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {userGroups.map(group => (
            <div
              key={group.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                    {group.is_creator && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Creator
                      </span>
                    )}
                    {group.is_admin && !group.is_creator && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  {group.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {group.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{group.member_count} members</span>
                    <span>Code: {group.invite_code}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(group.invite_code)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Copy invite code"
                  >
                    {copiedCode === group.invite_code ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleShareGroup(group)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Create League Group</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter group name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={e => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select League *
                </label>
                <select
                  value={createForm.fantasy_league_id}
                  onChange={e =>
                    setCreateForm(prev => ({ ...prev, fantasy_league_id: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Choose a league</option>
                  {leagues.map(league => (
                    <option key={league.id} value={league.id}>
                      {league.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={createForm.is_public}
                  onChange={e => setCreateForm(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_public"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Make group public
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateGroup}
                disabled={isCreating}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-2 px-4 rounded-md transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create Group'}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                  setError('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Join League Group</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-center text-lg font-mono"
                  placeholder="Enter code"
                  maxLength={8}
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleJoinGroup}
                disabled={isJoining}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-2 px-4 rounded-md transition-colors"
              >
                {isJoining ? 'Joining...' : 'Join Group'}
              </button>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinCode('');
                  setError('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-md shadow-lg z-50">
          {success}
        </div>
      )}
    </div>
  );
}
