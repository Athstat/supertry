import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import {
  FantasyLeagueGroupMember,
  FantasyLeagueGroupStanding,
} from '../../types/fantasyLeagueGroups';
import { Table2, EyeOff } from 'lucide-react';
import { } from 'lucide-react';
import useSWR from 'swr';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { ErrorState } from '../ui/ErrorState';
import { useEffect, useMemo, useState } from 'react';
import FantasyLeagueMemberModal from './team-modal/FantasyLeagueMemberModal';
import ClaimAccountNoticeCard from '../auth/guest/ClaimAccountNoticeCard';
import LeagueStandingsFilterSelector, {
  SelectedWeekIndicator,
} from './standings/LeagueStandingsFilterSelector';
import { leagueService } from '../../services/leagueService';
import { useLeagueRoundStandingsFilter } from '../../hooks/fantasy/useLeagueRoundStandingsFilter';
import LeagueStandingsTable from './standings/LeagueStandingsTable';
import { useAuth } from '../../contexts/AuthContext';
import { isGuestUser } from '../../utils/deviceId/deviceIdUtils';
import { fantasyAnalytics } from '../../services/analytics/fantasyAnalytics';
import { useNavigate } from 'react-router-dom';
import { useTabView } from '../shared/tabs/TabView';


export function LeagueStandings() {
  const { userMemberRecord, league, currentRound } = useFantasyLeagueGroup();
  const { authUser } = useAuth();
  const isGuest = isGuestUser(authUser);

  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FantasyLeagueGroupMember | undefined>();

  const { roundFilterId } = useLeagueRoundStandingsFilter();
  const navigate = useNavigate();

  const { navigate: changeTab } = useTabView();

  const groupId = league?.id;
  const fetchKey = useMemo(() => {
    return league && `/fantasy-league-groups/${league.id}/standings/${roundFilterId}`;
  }, [league, roundFilterId]);

  // Fetch group standings (backend aggregated totals)
  const {
    data: fetchedStandings,
    isLoading,
    error,
  } = useSWR(fetchKey, () => leagueStandingsFetcher(groupId as string, roundFilterId ?? ''), {
    revalidateOnFocus: false,
  });

  const standings = fetchedStandings ?? [];

  useEffect(() => {
    fantasyAnalytics.trackViewedStandingsTab();
  }, []);

  // Handle team row click

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

  const handleSelectMember = (member: FantasyLeagueGroupMember) => {
    setSelectedMember(member);
    fantasyAnalytics.trackClickedRowOnLeagueStandings();

    const roundId = roundFilterId === "overall" ? currentRound?.id : roundFilterId;

    if (member.user_id === authUser?.kc_id) {
      navigate(`/league/${league?.id}?round_id=${roundId}`);
      return;
    }



    navigate(`/league/${league?.id}/member/${member.user_id}?round_id=${roundId}`);
  };

  const handleCloseMemberModal = () => {
    setSelectedMember(undefined);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-4">

      <div className='px-4' >
        {userMemberRecord && <ClaimAccountNoticeCard reasonNum={2} />}
      </div>

      <div className="flex flex-row items-center px-4 justify-between">
        <div className="flex flex-row items-center gap-2">
          <Table2 />
          <p className="font-bold text-xl">Standings</p>
        </div>

        <div>
          {/* <PrimaryButton>
            <Plus className="w-4 h-4" />
            Invite
          </PrimaryButton> */}

          <LeagueStandingsFilterSelector />
        </div>
      </div>

      <div className='px-4' >
        <SelectedWeekIndicator />
      </div>

      <div className="relative px-2">
        <div className={`${isGuest ? 'blur-[3px] pointer-events-none select-none' : ''}`}>
          <LeagueStandingsTable
            standings={standings}
            isLoading={isLoading}
            handleSelectMember={handleSelectMember}
          />
        </div>

        {isGuest && (
          <div className="absolute inset-0 z-10 flex justify-center h-40 top-20">
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-6 flex flex-col items-center gap-3 text-center mx-4">
              <EyeOff className="w-10 h-10 text-slate-700 dark:text-slate-300" />
              <p className="font-medium">Claim your account to view scores</p>
            </div>
          </div>
        )}
      </div>

      <div>
        {/* {isMember && <PrimaryButton onClick={handleShare} className="" >
          <Plus className="w-4 h-4" />
          <p>Invite</p>
        </PrimaryButton>} */}
      </div>

      {selectedMember && showModal && (
        <FantasyLeagueMemberModal
          member={selectedMember}
          isOpen={showModal}
          onClose={handleCloseMemberModal}
        />
      )}
    </div>
  );
}

async function leagueStandingsFetcher(
  groupId: string,
  roundId: string | 'overall'
): Promise<FantasyLeagueGroupStanding[]> {
  if (roundId === 'overall' || !roundId) {
    return await fantasyLeagueGroupsService.getGroupStandings(groupId);
  }

  const teams = await leagueService.fetchParticipatingTeams(roundId);

  return teams.map(t => {
    return {
      first_name: t.first_name,
      last_name: t.last_name,
      user_id: t.user_id,
      username: t.first_name,
      rank: t.rank,
      total_score: t.overall_score,
    };
  });
}
