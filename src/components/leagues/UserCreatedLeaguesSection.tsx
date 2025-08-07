import React, { useState, useEffect } from 'react';
import { Plus, Users, DollarSign, Calendar, Lock, Globe, ArrowRight } from 'lucide-react';
import { LoadingState } from '../ui/LoadingState';
import { useNavigate } from 'react-router-dom';
import { userCreatedLeagueService } from '../../services/userCreatedLeagueService';
import { IUserCreatedLeague } from '../../types/userCreatedLeague';
import CreateLeagueModal from './CreateLeagueModal';

interface UserCreatedLeaguesSectionProps {
  onLeagueCreated?: () => void;
}

export default function UserCreatedLeaguesSection({
  onLeagueCreated,
}: UserCreatedLeaguesSectionProps) {
  const [userLeagues, setUserLeagues] = useState<IUserCreatedLeague[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserLeagues();
  }, []);

  const fetchUserLeagues = async () => {
    try {
      setIsLoading(true);
      const leagues = await userCreatedLeagueService.getUserCreatedLeagues();
      console.log('leagues: ', leagues);
      setUserLeagues(leagues);
    } catch (error) {
      console.error('Failed to fetch user leagues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeagueCreated = async (newLeague: IUserCreatedLeague) => {
    // Refresh the user's leagues
    await fetchUserLeagues();

    // Notify parent component to refresh all leagues
    if (onLeagueCreated) {
      onLeagueCreated();
    }
  };

  const handleLeagueClick = (league: IUserCreatedLeague) => {
    console.log('league user created: ', league);
    navigate(`/league/${league.id}`, { state: { league } });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'locked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'ended':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          My Created Leagues
        </h2>
        {userLeagues.length > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create League
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingState message="Loading your leagues..." />
      ) : userLeagues.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:border-slate-800 dark:bg-slate-800/50 rounded-lg px-6">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Leagues Created Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first fantasy league and invite friends to join
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Create Your First League
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {userLeagues.map(league => (
            <div
              key={league.id}
              onClick={() => handleLeagueClick(league)}
              className="bg-white dark:border-slate-800 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                        {league.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {league.season_name}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(league.status || 'open')}`}
                    >
                      {(league.status || 'open').toUpperCase()}
                    </span>
                    {league.is_public ? (
                      <Globe className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  {league.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {league.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {league.participant_count} {league.max_teams ? `/${league.max_teams}` : ''}{' '}
                      teams
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {formatDate(league.created_date)}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateLeagueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onLeagueCreated={handleLeagueCreated}
      />
    </div>
  );
}
