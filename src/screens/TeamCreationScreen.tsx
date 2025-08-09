import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { requestPushPermissions } from '../utils/bridgeUtils';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

// Components
import { LoadingState } from '../components/team-creation/LoadingState';
import { ErrorState } from '../components/team-creation/ErrorState';
import PlayerSelectionModal from '../components/team-creation/PlayerSelectionModal';
import TeamActions from '../components/team-creation/TeamActions';
import { fantasyTeamService } from '../services/fantasyTeamService';
import { ArrowRight, Check, Info, Trophy, Users } from 'lucide-react';

// Refactored team creation components
import TeamCreationContainer from './team-creation-components/TeamCreationContainer';
import PositionsGrid from './team-creation-components/PositionsGrid';
import TeamToast from './team-creation-components/TeamToast';
import useTeamCreationState from './team-creation-components/useTeamCreationState';
import { leagueService } from '../services/leagueService';
import { URC_COMPETIION_ID } from '../types/constants';
import { IFantasyLeague } from '../types/fantasyLeague';
import { useTeamCreationGuard } from '../hooks/useTeamCreationGuard';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import { ICreateFantasyTeamAthleteItem } from '../types/fantasyTeamAthlete';
import { mutate } from 'swr';

// Success Modal Component
interface SuccessModalProps {
  isVisible: boolean;
  teamName: string;
  leagueName: string;
  onClose: () => void;
  onGoToLeague: () => void;
  onViewTeam: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isVisible,
  teamName,
  leagueName,
  // onClose,
  onGoToLeague,
  onViewTeam,
}) => {
  if (!isVisible) return null;

  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  }

  // return (
  //   <PageView className="flex flex-col items-center justify-center p-4 h-[60vh] gap-8" >
  //     <div className="flex fleex-row items-center gap-2" >
  //       <Trophy />
  //       <h1 className="font-bold text-xl" >Rugby Fantasy Leagues</h1>
  //     </div>

  //     <div>
  //       <SecondaryText className="text-center text-md" >Create, invite friends, compete and battle it out in Weekly Rugby Fantasy Leagues. We are hard at work to bring you this fantasy experience. Stay tuned</SecondaryText>
  //     </div>

  //     <PrimaryButton className="flex w-fit flex-row items-center gap-2" >
  //       Coming Soon
  //       <Info />
  //     </PrimaryButton>

  //     <button onClick={handleBackToDashboard} >Go to Dashboard</button>
  //   </PageView>
  // )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all animate-fade-scale-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Congratulations! Your team "{teamName}" has been successfully submitted to the{' '}
            {leagueName} league.
          </p>
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={onGoToLeague}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              whileHover={{
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300 },
              }}
            >
              <Trophy size={20} />
              Go to League
            </motion.button>
            <motion.button
              onClick={onViewTeam}
              className="w-full dark:bg-transparent text-primary-600 dark:text-primary-400 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-primary-200 dark:border-primary-800"
              whileHover={{
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300 },
              }}
            >
              <Users size={20} />
              View Your Team
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function TeamCreationScreen() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { officialLeagueId } = useParams<{ officialLeagueId: string }>();
  const league = location.state?.league ? (location.state?.league as IFantasyLeague) : undefined;
  const { isTeamCreationLocked, hasCreatedTeam, rankedUserTeam, userTeam } =
    useTeamCreationGuard(league);
  const [isGuest, setIsGuest] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Check if coming from welcome screen
  const isFromWelcome = location.state?.from === 'welcome';
  const isLocked = isTeamCreationLocked;

  useEffect(() => {
    requestPushPermissions();

    // Check if user is a guest and get user info
    if (isAuthenticated) {
      const info = authService.getUserInfoSync();
      setUserInfo(info);
      //console.log('user info ', info);
      authService.isGuestAccount().then(isGuest => {
        setIsGuest(isGuest);
      });
    }
  }, [isAuthenticated]);

  // Use our centralized team creation state hook
  const {
    // Data
    allPlayers,
    positionList,

    // UI states
    isLoading,
    error,
    showPlayerSelection,
    setShowPlayerSelection,
    selectedPosition,

    // Team creation values
    teamName,
    setTeamName,
    selectedPlayers,
    handlePositionSelect,
    handleAddPlayer,
    handleRemovePlayer,
    handleReset,

    // Budget info
    teamBudget,
    remainingBudget,
    selectedPlayersCount,
    requiredPlayersCount,
    isTeamComplete,

    // Captain selection
    captainId,
    setCaptainId,

    // Toast
    toast,
    showToast,
    hideToast,
  } = useTeamCreationState(officialLeagueId);

  // Debug captain state changes
  useEffect(() => {
    console.log('Captain ID changed:', captainId);
  }, [captainId]);

  const selectedPlayersArr = Object.values(selectedPlayers).map(a => {
    return { tracking_id: a.id };
  });

  // Set default team name from user info
  useEffect(() => {
    //console.log('userInfoooo: ', userInfo);
    if (userInfo) {
      // Use first name if available, otherwise fall back to username
      const defaultName = userInfo.username;
      setTeamName(defaultName);
    }
  }, [userInfo]);

  //console.log("userInfo", userInfo.firstName);

  // Handle team submission
  const handleSaveTeam = async () => {
    // Validate team
    if (isGuest && teamName.trim() === '') {
      showToast('Please enter a club name', 'error');
      return;
    }
    if (selectedPlayersCount !== requiredPlayersCount) {
      showToast(`Please select all ${requiredPlayersCount} players`, 'error');
      return;
    }
    if (remainingBudget < 0) {
      showToast('You have exceeded the budget', 'error');
      return;
    }

    if (captainId === null) {
      showToast('Please select a captain', 'error');
      return;
    }

    if (!officialLeagueId) {
      showToast('League ID is required', 'error');
      return;
    }

    if (!league) {
      showToast('League is required', 'error');
      return;
    }

    if (!userInfo) {
      showToast('User info is required', 'error');
      return;
    }

    //console.log('User info ', userInfo.kc_id);

    setIsSaving(true);

    try {
      // Convert selected players to the required format for API (IFantasyTeamAthlete)
      const teamAthletes: ICreateFantasyTeamAthleteItem[] = Object.values(selectedPlayers).map(
        (player, index) => {
          // Check if this player is in the Super Sub position
          const position = positionList.find(
            pos => pos.player && pos.player.tracking_id === player.tracking_id
          );

          console.log('The player we found ', player);

          const isSuperSub = position?.isSpecial || false;
          const isPlayerCaptain = captainId === player.tracking_id;

          return {
            athlete_id: player.tracking_id ?? '',
            id: player.id,
            purchase_price: player.price ?? 0,
            purchase_date: new Date(),
            is_starting: !isSuperSub,
            slot: index + 1,
            is_super_sub: isSuperSub,
            score: player.scoring || 0,
            // Add missing properties required by IFantasyTeamAthlete interface
            team_id: 0, // This will be set by the backend
            team_name: teamName,
            team_logo: '', // This will be set by the backend
            athlete_team_id: player.team_id || '', // Use team_id property
            player_name: player.player_name || '', // Use player_name property
            is_captain: isPlayerCaptain,
          };
        }
      );

      // console.log('Team Athletes ', teamAthletes);
      // console.log('league id ', league.id);
      // console.log('user id ', userInfo);

      // Join the league with the new team
      const joinLeagueRes = await leagueService.joinLeague(
        league.id,
        userInfo.kc_id,
        teamName,
        teamAthletes
      );
      console.log('Result from join res ', joinLeagueRes);

      // Store the created team ID for navigation
      setCreatedTeamId(joinLeagueRes.team.id);

      // Optimistically insert the user's team into the SWR cache so it shows immediately
      // useFetch in useFantasyLeague uses fetch key: [league.id, 'participating-teams-hook']
      if (league?.id) {
        const swrKey: [number | string, string] = [league.id, 'participating-teams-hook'];

        // Build a minimal RankedFantasyTeam-like object for immediate display
        const optimisticTeam = {
          team_id: String(joinLeagueRes.team.id ?? ''),
          rank: joinLeagueRes.team.rank ?? undefined,
          teamName: joinLeagueRes.team.team_name ?? teamName,
          managerName:
            `${userInfo.firstName ?? ''} ${userInfo.lastName ?? ''}`.trim() ||
            (userInfo.username ?? 'Manager'),
          overall_score: joinLeagueRes.team.overall_score ?? 0,
          weeklyPoints: joinLeagueRes.team.overall_score ?? 0,
          lastRank: joinLeagueRes.team.rank ?? undefined,
          isUserTeam: true,
          userId: joinLeagueRes.team.user_id ?? userInfo.kc_id,
          is_admin: false,
          first_name: userInfo.firstName ?? '',
          last_name: userInfo.lastName ?? '',
        };

        // Optimistically update without revalidation
        mutate(
          swrKey,
          (current: any) => {
            const list = Array.isArray(current) ? current : [];
            const exists = list.some((t: any) => t?.userId === optimisticTeam.userId);
            if (exists) return list;
            return [...list, optimisticTeam];
          },
          false
        );

        // Trigger background revalidation
        mutate(swrKey);
      }

      // update users username on db
      // if (isGuest) {
      //   await authService.updateUserInfo(userInfo.id, {
      //     username: teamName
      //   });
      // }

      // Step 3: Request push notification permissions after successful team creation
      // requestPushPermissions(); Used to be here

      // Show success modal instead of navigating away
      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error('Error saving team:', error);
      try {
        // Type guard to check if error is an object with errorText
        if (error && typeof error === 'object' && 'errorText' in error) {
          const errorData = error.errorText ? JSON.parse(error.errorText as string) : {};
          const errorMessage = errorData.message || errorData.error || 'Unknown error';
          showToast(errorMessage, 'error');
        } else if (error instanceof Error) {
          showToast(error.message || 'Failed to join league', 'error');
        } else {
          showToast('Failed to join league. Please try again.', 'error');
        }
      } catch (parseError) {
        // Fallback to generic error if parsing fails
        showToast('Failed to join league. Please try again.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while fetching initial data
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state if there was an error
  if (error) {
    return <ErrorState error={error} isFromWelcome={isFromWelcome} />;
  }

  if (userTeam && hasCreatedTeam) {
    const handleViewTeam = () => {
      const uri = `/my-team/${userTeam.team_id}`;
      navigate(uri, {
        state: { teamWithRank: rankedUserTeam, leagueInfo: league, team: userTeam },
      });
    };

    return (
      <div className="w-full h-[70vh] flex flex-col gap-4 items-center justify-center px-10 lg:px-[30%]">
        <p className="text-center text-slate-700 dark:text-slate-300">
          You have already created a team for {league?.title || ' this league'}. You can only create
          one team for each fantasy league!
        </p>
        <PrimaryButton onClick={handleViewTeam} className="flex flex-row items-center gap-1">
          View Team
          <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </div>
    );
  }

  return (
    <TeamCreationContainer
      league={league}
      currentBudget={remainingBudget}
      totalBudget={teamBudget}
      selectedPlayersCount={selectedPlayersCount}
      requiredPlayersCount={requiredPlayersCount}
      isFromWelcome={isFromWelcome}
      isLocked={isLocked}
    >
      {/* Position selection grid */}
      <PositionsGrid
        positions={positionList}
        selectedPlayers={selectedPlayers}
        selectedPosition={selectedPosition}
        onPositionSelect={handlePositionSelect}
        onPlayerRemove={handleRemovePlayer}
        captainId={captainId}
        setCaptainId={setCaptainId}
      />

      {/* Team name input - only show for guest users */}

      {/* Team action buttons */}
      <TeamActions
        isTeamComplete={isTeamComplete}
        isLoading={isSaving}
        onReset={handleReset}
        onSave={handleSaveTeam}
      />

      {/* Player selection modal */}
      {showPlayerSelection && selectedPosition && (
        <PlayerSelectionModal
          visible={showPlayerSelection}
          selectedPosition={selectedPosition}
          players={allPlayers}
          remainingBudget={remainingBudget}
          selectedPlayers={selectedPlayersArr}
          handlePlayerSelect={handleAddPlayer}
          onClose={() => setShowPlayerSelection(false)}
          roundId={parseInt(officialLeagueId || '0')}
          roundStart={league?.start_round ?? 0}
          roundEnd={league?.end_round ?? 0}
          leagueId={league?.id}
        />
      )}

      {/* Toast component for notifications */}
      <TeamToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Success Modal */}
      <SuccessModal
        isVisible={showSuccessModal}
        teamName={teamName}
        leagueName={league?.title ?? 'League'}
        onClose={() => setShowSuccessModal(false)}
        onGoToLeague={() => {
          setShowSuccessModal(false);
          // Navigate to the specific league with the league object as state
          navigate(`/league/${officialLeagueId}`, {
            state: {
              league,
              from: 'team-creation',
            },
          });
        }}
        onViewTeam={() => {
          setShowSuccessModal(false);
          navigate('/my-teams');
        }}
      />
    </TeamCreationContainer>
  );
}

export default TeamCreationScreen;
