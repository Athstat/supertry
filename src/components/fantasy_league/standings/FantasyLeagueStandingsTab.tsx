import { } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { EyeOff } from 'lucide-react';
import { ErrorState } from '../../ui/ErrorState';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { isGuestUser } from '../../../utils/deviceId/deviceIdUtils';
import LeagueStandingsTable from './LeagueStandingsTable';
import ClaimAccountNoticeCard from '../../auth/guest/ClaimAccountNoticeCard';
import { FantasyLeagueGroupMember } from '../../../types/fantasyLeagueGroups';
import { fantasyAnalytics } from '../../../services/analytics/fantasyAnalytics';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useLeagueRoundStandingsFilter } from '../../../hooks/fantasy/useLeagueRoundStandingsFilter';
import { useLeagueGroupStandings } from '../../../hooks/fantasy/standings/useLeagueGroupOverallStandings';
import LeagueStandingsFilterSelector, { SelectedWeekIndicator } from './LeagueStandingsFilterSelector';
import { useOfficialLeagueGroup } from '../../../hooks/fantasy/scouting/seasons/useOfficialLeagueGroup';
import PrimaryButton from '../../ui/buttons/PrimaryButton';


/** Renders fantasy league group standings */
export function FantasyLeagueStandingsTab() {

  const { userMemberRecord, league, currentRound } = useFantasyLeagueGroup();

  const { authUser } = useAuth();
  const isGuest = isGuestUser(authUser);

  const { roundFilterId, selectedRound } = useLeagueRoundStandingsFilter();
  const navigate = useNavigate();

  const { standings, isLoading: loadingStandings, error } = useLeagueGroupStandings(league?.id, {
    round_number: selectedRound?.start_round || undefined
  });

  const { featuredLeague, isLoading: loadingOfficialLeague } = useOfficialLeagueGroup(league?.season_id)

  useEffect(() => {
    fantasyAnalytics.trackViewedStandingsTab();
  }, []);

  // Handle team row clicks

  const handleSelectMember = useCallback((member: FantasyLeagueGroupMember) => {

    fantasyAnalytics.trackClickedRowOnLeagueStandings();

    const roundNumber = roundFilterId === "overall" ? currentRound?.start_round : selectedRound?.start_round;
    const queryParams = roundNumber ? `?round_number=${roundNumber}` : "";

    if (featuredLeague) {
      if (member.user_id === authUser?.kc_id) {
        navigate(`/league/${featuredLeague.id}${queryParams}`);
        return;
      }

      navigate(`/league/${featuredLeague.id}/member/${member.user_id}${queryParams}`);
    }

  }, [authUser, currentRound, featuredLeague, navigate, roundFilterId, selectedRound])


  const isLoading = loadingOfficialLeague || loadingStandings;

  if (error) {
    return (
      <div>
        <ErrorState
          error="Whoops, Failed to load league standings"
          message="Something wen't wrong please try again"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      <div className='px-4' >
        {userMemberRecord && <ClaimAccountNoticeCard reasonNum={2} />}
      </div>

      <div className="flex flex-row items-center px-4 justify-between">
        <SelectedWeekIndicator />
        <LeagueStandingsFilterSelector />
      </div>

      <div className="relative px-2">
        <div className={`${!isGuest ? 'blur-[10px] pointer-events-none select-none' : ''}`}>
          <LeagueStandingsTable
            standings={standings}
            isLoading={isLoading}
            handleSelectMember={handleSelectMember}
          />
        </div>

        {!isGuest && (
          <ClaimAccontCard />
        )}
      </div>

    </div>
  );
}

function ClaimAccontCard() {

  const navigate = useNavigate();

  const handleClickClaim = () => {
    navigate('/profile');
  }

  return (
    <div className="absolute inset-0 z-10 flex justify-center h-40 top-20">
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-6 flex flex-col items-center gap-3 text-center mx-4">
        <EyeOff className="w-10 h-10 text-slate-700 dark:text-slate-300" />
        <p className="font-medium">Claim your account to view scores</p>

        <PrimaryButton onClick={handleClickClaim} >Claim Account</PrimaryButton>
      </div>
    </div>
  )
}