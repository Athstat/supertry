import React, { useState, useEffect } from 'react';
import { Plus, Users, DollarSign, Calendar, Lock, Globe, ArrowRight, User } from 'lucide-react';
import { LoadingState } from '../ui/LoadingState';
import { useNavigate } from 'react-router-dom';
import { userCreatedLeagueService } from '../../services/userCreatedLeagueService';
import { IUserCreatedLeague } from '../../types/userCreatedLeague';
import CreateLeagueModal from './CreateLeagueModal';
import { Toast } from '../ui/Toast';

interface UserCreatedLeaguesSectionProps {
  onLeagueCreated?: () => void;
}

export default function UserCreatedLeaguesSection({
  onLeagueCreated,
}: UserCreatedLeaguesSectionProps) {
  const [userLeagues, setUserLeagues] = useState<IUserCreatedLeague[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

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

  const handleInviteClick = (e: React.MouseEvent, league: IUserCreatedLeague) => {
    e.stopPropagation();
    // Native share (Web Share API) with fallback to clipboard
    const baseUrl = (import.meta as any)?.env?.VITE_APP_LINK_BASE_URL || window.location.origin;
    const deepLink = `${baseUrl}/league/${league.id}`;

    const shareMessage =
      `You’ve been invited to join a rugby league: “${league.title}”\n\n` +
      `🏉 Step 1: Install the app\n` +
      `👉 Download for iOS: https://apps.apple.com/za/app/scrummy-fantasy-rugby/id6744964910\n` +
      `👉 Download for Android: https://play.google.com/store/apps/details?id=com.scrummy&hl=en_ZA\n\n` +
      `📲 Step 2: Open the app, tap “Join a League”, and enter this code: ${league.entry_code}\n\n` +
      `Already have the app?\n` +
      `Just click here to join instantly: ${deepLink}`;

    // Ensure there are no leading blank lines
    //const cleanedMessage = shareMessage.replace(/\r\n/g, '\n').replace(/^\s*\n+/, '');

    // Share ONLY the composed message text (no title/url),
    // so the share sheet doesn't prepend extra lines.
    const shareData: ShareData = {
      title: shareMessage,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        console.error('Share failed:', err);
        // Fallback to clipboard if share dismissed or fails
        navigator.clipboard
          .writeText(shareMessage)
          .then(() => alert('Invite copied to clipboard'))
          .catch(() => alert('Unable to share or copy. Please try manually.'));
      });
    } else {
      navigator.clipboard
        .writeText(shareMessage)
        .then(() => alert('Invite copied to clipboard'))
        .catch(() => alert('Unable to copy invite. Please try manually.'));
    }
  };

  const handleManageClick = (e: React.MouseEvent, league: IUserCreatedLeague) => {
    e.stopPropagation();
    // TODO: Implement manage functionality
    console.log('Manage league:', league.id);
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
            onClick={() => setShowComingSoon(true)}
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 space-y-2"
            >
              {/* Header Row */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {league.title}
                    </h3>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      <User size={10} />
                    </div>
                  </div>
                  {league.season_name && (
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
                      {league.season_name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      league.is_public
                        ? getStatusColor(league.status || 'open')
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}
                  >
                    {league.is_public
                      ? (league.status || 'open').toLowerCase() === 'open'
                        ? 'Public'
                        : (league.status || 'open').charAt(0).toUpperCase() +
                          (league.status || 'open').slice(1)
                      : 'Invite Only'}
                  </span>
                  {league.is_public ? (
                    <Globe className="w-3 h-3 text-blue-500" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Description - Single line with truncation */}
              {league.description && (
                <p className="text-sm italic text-gray-600 dark:text-gray-300 truncate">
                  {league.description}
                </p>
              )}

              {/* Metadata Row - Compressed single line */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>
                      {league.participant_count}
                      {league.max_teams ? `/${league.max_teams}` : ''} Teams
                    </span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Created: {formatDate(league.created_date)}</span>
                  </div>
                  {league.entry_fee > 0 && (
                    <>
                      <span className="text-gray-400">|</span>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>${league.entry_fee}</span>
                      </div>
                    </>
                  )}
                </div>

                <ArrowRight size={16} className="text-gray-400 dark:text-gray-500" />
              </div>

              {/* Action Buttons - Compact row */}
              <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={e => handleManageClick(e, league)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Manage
                </button>
                <button
                  onClick={e => handleInviteClick(e, league)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <Plus size={14} />
                  Invite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coming soon toast for empty-state create button */}
      <Toast
        message="Feature Coming Soon!"
        type="info"
        isVisible={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        duration={3000}
      />

      <CreateLeagueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onLeagueCreated={handleLeagueCreated}
      />
    </div>
  );
}
