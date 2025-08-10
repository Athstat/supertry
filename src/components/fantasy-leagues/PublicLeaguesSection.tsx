import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userCreatedLeagueService } from '../../services/userCreatedLeagueService';
import { IUserCreatedLeague } from '../../types/userCreatedLeague';

export default function PublicLeaguesSection() {
  const [publicLeagues, setPublicLeagues] = useState<IUserCreatedLeague[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicLeagues();
  }, []);

  const fetchPublicLeagues = async () => {
    try {
      setIsLoading(true);
      const leagues = await userCreatedLeagueService.getPublicLeagues();
      setPublicLeagues(leagues);
    } catch (error) {
      console.error('Failed to fetch public leagues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeagueClick = (league: IUserCreatedLeague) => {
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
        <h2 className="text-xl font-semibold dark:text-white">Public Leagues</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Globe className="w-4 h-4" />
          <span>Join leagues created by other users</span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading public leagues...</p>
        </div>
      ) : publicLeagues.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Public Leagues Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new public leagues
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {publicLeagues.map(league => (
            <div
              key={league.id}
              onClick={() => handleLeagueClick(league)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{league.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(league.status || 'open')}`}
                    >
                      {(league.status || 'open').toUpperCase()}
                    </span>
                    <Globe className="w-4 h-4 text-blue-500" />
                  </div>

                  {league.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {league.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {league.participant_count}/{league.max_teams} teams
                    </span>
                    {league.entry_fee > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />${league.entry_fee} entry
                      </span>
                    )}
                    {league.prize_pool > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />${league.prize_pool} prize pool
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {formatDate(league.created_date)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Created by {league.creator.first_name} {league.creator.last_name}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
