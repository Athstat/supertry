import React, { useState } from 'react';
import { Plus, Trophy, Users } from 'lucide-react';
import { LoadingState } from '../ui/LoadingState';
import { useNavigate } from 'react-router-dom';
import { IUserCreatedLeague } from '../../types/userCreatedLeague';
import CreateLeagueForm from './CreateLeagueModal';
import { Toast } from '../ui/Toast';
import useSWR from 'swr';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { swrFetchKeys } from '../../utils/swrKeys';
import { FantasyLeagueGroupCard } from './league_card_small/FantasyLeagueGroupCard';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';

interface UserCreatedLeaguesSectionProps {
  onLeagueCreated?: () => void;
}

export default function UserCreatedLeaguesSection({
  onLeagueCreated,
}: UserCreatedLeaguesSectionProps) {
  const key = swrFetchKeys.getMyLeagueGroups();
  let {
    data: myLeagues,
    isLoading,
    mutate,
  } = useSWR(key, () => fantasyLeagueGroupsService.getMyCreatedLeagues());

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { authUser } = useAuth();

  const navigate = useNavigate();

  const toggleShowModal = () => setShowCreateModal(prev => !prev);

  const handleLeagueCreated = async (newLeague: FantasyLeagueGroup) => {
    mutate(() => fantasyLeagueGroupsService.getMyCreatedLeagues());

    // Notify parent component to refresh all leagues
    if (onLeagueCreated) {
      onLeagueCreated();
    }
  };

  const handleLeagueClick = (league: FantasyLeagueGroup) => {
    console.log('league user created: ', league);
    navigate(`/league/${league.id}`, { state: { league } });
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
    const inviteInstructions = `${baseUrl}/invite-steps?league_name=${league.title}&user_name=${authUser?.first_name || authUser?.username}&join_code=${league.entry_code}`;

    const shareMessage =
      `You’ve been invited to join a rugby league: “${league.title}”\n\n` +
      `🏉 Step 1: Install the app\n` +
      `👉 Download for iOS: https://apps.apple.com/za/app/scrummy-fantasy-rugby/id6744964910\n` +
      `👉 Download for Android: https://play.google.com/store/apps/details?id=com.scrummy&hl=en_ZA\n\n` +
      `📲 Step 2: Open the app, tap “Join a League”, and enter this code: ${league.entry_code}\n\n. New to SCRUMMY? Just click here to get started ${inviteInstructions}`;

    // Ensure there are no leading blank lines
    //const cleanedMessage = shareMessage.replace(/\r\n/g, '\n').replace(/^\s*\n+/, '');

    // Share ONLY the composed message text (no title/url),
    // so the share sheet doesn't prepend extra lines.
    const shareData: ShareData = {
      title: `You’ve been invited to join a rugby league: “${league.title}`,
      text: shareMessage,
      url: inviteInstructions,
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

  myLeagues = myLeagues ?? [];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          My Leagues
        </h2>

        {myLeagues.length > 0 && (
          <PrimaryButton onClick={toggleShowModal} className="w-fit">
            <Plus className="w-4 h-4" />
            Create
          </PrimaryButton>
        )}
      </div>

      {isLoading ? (
        <LoadingState message="Loading your leagues..." />
      ) : myLeagues.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center py-8 bg-gray-50 dark:border-slate-800 dark:bg-slate-800/50 rounded-lg px-6">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />

          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            You haven't created any leagues yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first fantasy league and invite friends to join
          </p>

          <PrimaryButton onClick={toggleShowModal} className="w-fit">
            <Plus />
            Create Your First League
          </PrimaryButton>
        </div>
      ) : (
        <div className="space-y-3">
          {myLeagues.map((league, index) => {
            return (
              <FantasyLeagueGroupCard
                leagueGroup={league}
                key={league.id}
                onClick={handleLeagueClick}
              />
            );
          })}
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

      <CreateLeagueForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onLeagueCreated={handleLeagueCreated}
      />
    </div>
  );
}
