import React, { useState, useEffect } from 'react';
import { Users, Filter, Copy, Check, Share2 } from 'lucide-react';
import { leagueGroupService } from '../../services/leagueGroupService';
import { IUserLeagueGroup, ILeagueGroupMember } from '../../types/leagueGroup';
import { IFantasyLeague } from '../../types/fantasyLeague';

interface LeagueGroupFilterProps {
  league: IFantasyLeague;
  onGroupFilterChange: (groupMembers: string[] | null) => void;
  isFiltered: boolean;
}

export default function LeagueGroupFilter({
  league,
  onGroupFilterChange,
  isFiltered,
}: LeagueGroupFilterProps) {
  const [userGroups, setUserGroups] = useState<IUserLeagueGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<IUserLeagueGroup | null>(null);
  const [groupMembers, setGroupMembers] = useState<ILeagueGroupMember[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchUserGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupMembers(selectedGroup.id);
    } else {
      setGroupMembers([]);
      onGroupFilterChange(null);
    }
  }, [selectedGroup]);

  const fetchUserGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const groups = await leagueGroupService.getUserLeagueGroups();
      // Filter groups that belong to this league
      const leagueGroups = groups.filter(group => group.fantasy_league === league.id.toString());
      setUserGroups(leagueGroups);
    } catch (error) {
      console.error('Failed to fetch user groups:', error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      setIsLoadingMembers(true);
      const members = await leagueGroupService.getLeagueGroupMembers(groupId);
      setGroupMembers(members);

      // Extract user IDs for filtering
      const memberUserIds = members.map(member => member.user.kc_id);
      onGroupFilterChange(memberUserIds);
    } catch (error) {
      console.error('Failed to fetch group members:', error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleGroupSelect = (group: IUserLeagueGroup | null) => {
    setSelectedGroup(group);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleShareGroup = async (group: IUserLeagueGroup) => {
    try {
      await leagueGroupService.shareInvite(group.name, group.invite_code);
    } catch (error) {
      console.error('Failed to share group:', error);
    }
  };

  if (isLoadingGroups) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading groups...</span>
        </div>
      </div>
    );
  }

  if (userGroups.length === 0) {
    return null; // Don't show anything if user has no groups for this league
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Group Filter</h3>
          {isFiltered && (
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
              Filtered
            </span>
          )}
        </div>
        {selectedGroup && (
          <button
            onClick={() => handleGroupSelect(null)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="space-y-3">
        {userGroups.map(group => (
          <div
            key={group.id}
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              selectedGroup?.id === group.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handleGroupSelect(group)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{group.name}</h4>
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
                  onClick={e => {
                    e.stopPropagation();
                    copyToClipboard(group.invite_code);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Copy invite code"
                >
                  {copiedCode === group.invite_code ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleShareGroup(group);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Share group"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Show group members when selected */}
            {selectedGroup?.id === group.id && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                {isLoadingMembers ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Loading members...
                    </span>
                  </div>
                ) : (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Group Members ({groupMembers.length})
                    </h5>
                    <div className="space-y-1">
                      {groupMembers.map(member => (
                        <div
                          key={member.user.kc_id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-900 dark:text-white">
                            {member.user.first_name} {member.user.last_name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {member.overall_score} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <Users className="w-4 h-4" />
            <span>
              Showing standings filtered to <strong>{selectedGroup.name}</strong> members only
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
