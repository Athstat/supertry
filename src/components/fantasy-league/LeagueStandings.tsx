import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { FantasyLeagueGroupMember, FantasyLeagueGroupStanding } from '../../types/fantasyLeagueGroups';
import { Table2, User } from 'lucide-react';
import { } from 'lucide-react';
import SecondaryText from '../shared/SecondaryText';
import useSWR from 'swr';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import RoundedCard from '../shared/RoundedCard';
import { ErrorState } from '../ui/ErrorState';
import { useMemo, useState } from 'react';
import FantasyLeagueMemberModal from './team-modal/FantasyLeagueMemberModal';
import ClaimAccountNoticeCard from '../auth/guest/ClaimAccountNoticeCard';
import { twMerge } from 'tailwind-merge';
import { useQueryState } from '../../hooks/useQueryState';
import LeagueStandingsFilterSelector from './standings/LeagueStandingsFilterSelector';
import { leagueService } from '../../services/leagueService';

export function LeagueStandings() {

  const { userMemberRecord, league, members } = useFantasyLeagueGroup();

  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FantasyLeagueGroupMember | undefined>();

  const [roundFilterId, setRoundFilterId] = useQueryState<string | undefined>('round_filter', { init: 'overall' });


  // const filteredRound: {label: string, id: string} = useMemo(() => {

  //   if (roundFilterId === undefined || roundFilterId === 'overall') {

  //   }

  // }, [roundFilterId]);

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

  const standings = fetchedStandings ?? [];

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
        </div>

      </div>

      <LeagueStandingsFilterSelector
        value={roundFilterId}
        onChange={(v) => setRoundFilterId(v)}
      />


      <div className="flex flex-row items-center p-3 justify-between" >

        <div className="flex flex-row items-center gap-2" >
          <SecondaryText className="text-md w-10" >Rank</SecondaryText>
          <SecondaryText className="text-md" >Manager</SecondaryText>
        </div>

        <div>
          <SecondaryText className="text-md" >Points</SecondaryText>
        </div>

      </div>

      {isLoading && <div className="flex flex-col gap-4 animate-pulse" >
        <RoundedCard className="border-none h-8 w-1/3 lg:w-1/4" />

        <div className="flex flex-row items-center justify-between" >
          <div className="flex flex-row items-center gap-2" >
            <RoundedCard className="border-none h-8 w-32" />
            <RoundedCard className="border-none h-8 w-20" />
          </div>

          <RoundedCard className="border-none h-8 w-20" />
        </div>

        <div className="flex flex-col gap-2" >
          <RoundedCard className="border-none h-12 w-full" />
          <RoundedCard className="border-none h-12 w-full" />
          <RoundedCard className="border-none h-12 w-full" />

        </div>

      </div>}

      <div className='divide-y-2 dark:divide-slate-600/40 divide-slate-400/40' >

        {standings.map((member, index) => {
          return (
            <div onClick={() => {
              const mRecord = members.find(m => m.user_id === member.user_id);

              if (mRecord) {
                handleSelectMember(mRecord);
              }
            }} >
              <LeagueStandingsRow
                member={member}
                key={index}
                index={index}
                isUser={userMemberRecord?.user_id === member.user_id}
              />
            </div>
          )
        })}

      </div>

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

type StandingsProps = {
  member: FantasyLeagueGroupStanding,
  index: number,
  isUser?: boolean
}

function LeagueStandingsRow({ member, isUser }: StandingsProps) {

  const badge = useMemo(() => {
    switch (member.rank) {
      case 1:
        return "🏅 Gold"
        break;

      case 2:
        return '🥈 Silver';
      case 3:
        return '🥉 Bronze'

      default:
        return undefined;
        break;
    }

    return undefined;
  }, [member]);

  return (
    <div className={twMerge(
      "flex flex-row  cursor-pointer hover:bg-slate-200 hover:dark:bg-slate-800/60  p-3 items-center gap-2 justify-between",
      isUser && 'bg-blue-500 text-white'
    )} >

      <div className="flex flex-row items-center gap-2" >
        <p className="w-10" >{member.rank}</p>

        {isUser && <div className=" w-6 h-6 bg-blue-500 rounded-xl flex flex-col items-center justify-center" >
          <User className="w-4 h-4 text-white" />
        </div>}

        <div className='flex flex-row items-center gap-2' >
          <p>{member.username ?? member.first_name}</p>
          {/* <p>{member.user.first_name}</p> */}

          {badge && <div className='bg-slate-200 dark:bg-slate-700/60 text-sm px-2 rounded-full' >{badge}</div>}
        </div>

      </div>

      <div>
        <p>{member.total_score}</p>
      </div>
    </div>
  )
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