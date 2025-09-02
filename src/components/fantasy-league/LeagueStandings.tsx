import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { FantasyLeagueGroupMember, FantasyLeagueGroupStanding } from '../../types/fantasyLeagueGroups';
import { Table2 } from 'lucide-react';
import { } from 'lucide-react';
import useSWR from 'swr';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { ErrorState } from '../ui/ErrorState';
import { useMemo, useState } from 'react';
import FantasyLeagueMemberModal from './team-modal/FantasyLeagueMemberModal';
import ClaimAccountNoticeCard from '../auth/guest/ClaimAccountNoticeCard';
import LeagueStandingsFilterSelector, { SelectedWeekIndicator } from './standings/LeagueStandingsFilterSelector';
import { leagueService } from '../../services/leagueService';
import { useLeagueRoundStandingsFilter } from '../../hooks/fantasy/useLeagueRoundStandingsFilter';
import LeagueStandingsTable from './standings/LeagueStandingsTable';

export function LeagueStandings() {

  const { userMemberRecord, league } = useFantasyLeagueGroup();

  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FantasyLeagueGroupMember | undefined>();

  const {roundFilterId} = useLeagueRoundStandingsFilter();

  const groupId = league?.id;
  const fetchKey = useMemo(() => {
    return league && `/fantasy-league-groups/${league.id}/standings/${roundFilterId}`;
  }, [roundFilterId]);


  // Fetch group standings (backend aggregated totals)
  const {
    data: fetchedStandings,
    isLoading,
    error,
  } = useSWR(fetchKey, () => leagueStandingsFetcher(groupId as string, roundFilterId ?? ''),
    { revalidateOnFocus: false }
  );

  const standings = (fetchedStandings ?? []);

  // Handle team row click

  if (error) {
    return <div>
      <ErrorState
        error="Whoops, Failed to load league standings"
        message="Something wen't wrong please try again"
      />
    </div>
  }

  const handleSelectMember = (member: FantasyLeagueGroupMember) => {
    setSelectedMember(member);
    setShowModal(true);
  }

  const handleCloseMemberModal = () => {
    setSelectedMember(undefined);
    setShowModal(false);
  }

  return (
    <div className="flex flex-col gap-4" >

      {userMemberRecord && (
        <ClaimAccountNoticeCard reasonNum={2} />
      )}


      <div className="flex flex-row items-center justify-between" >

        <div className="flex flex-row items-center gap-2" >
          <Table2 />
          <p className="font-bold text-xl" >Standings</p>
        </div>

        <div>
          {/* <PrimaryButton>
            <Plus className="w-4 h-4" />
            Invite
          </PrimaryButton> */}

          <LeagueStandingsFilterSelector/>
        </div>


      </div>

      <SelectedWeekIndicator  />
      

      
      <LeagueStandingsTable 
        standings={standings}
        isLoading={isLoading}
        handleSelectMember={handleSelectMember}
      />

      <div>
        {/* {isMember && <PrimaryButton onClick={handleShare} className="" >
          <Plus className="w-4 h-4" />
          <p>Invite</p>
        </PrimaryButton>} */}
      </div>

      {selectedMember && showModal &&
        <FantasyLeagueMemberModal
          member={selectedMember}
          isOpen={showModal}
          onClose={handleCloseMemberModal}
        />
      }

    </div>
  );
}

async function leagueStandingsFetcher(groupId: string, roundId: string | "overall"): Promise<FantasyLeagueGroupStanding[]> {
  if (roundId === 'overall' || !roundId) {
    return await fantasyLeagueGroupsService.getGroupStandings(groupId);
  }

  const teams = await leagueService.fetchParticipatingTeams(roundId);

  return teams.map((t) => {
    return {
      first_name: t.first_name,
      last_name: t.last_name,
      user_id: t.user_id,
      username: t.first_name,
      rank: t.rank,
      total_score: t.overall_score
    }
  })
}