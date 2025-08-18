import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { FantasyLeagueGroupStanding } from '../../types/fantasyLeagueGroups';
import { Table2, User } from 'lucide-react';
import {} from 'lucide-react';
import SecondaryText from '../shared/SecondaryText';
import useSWR from 'swr';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import RoundedCard from '../shared/RoundedCard';
import { ErrorState } from '../ui/ErrorState';
import { useMemo } from 'react';

export function LeagueStandings() {

  const { userMemberRecord, league, members } = useFantasyLeagueGroup();
  const fetchKey = league && `/fantasy-league-groups/${league.id}/standings`;

  const groupId = league?.id;

  // Fetch group standings (backend aggregated totals)
  const {
    data: fetchedStandings,
    isLoading,
    error,
  } = useSWR(fetchKey, () => fantasyLeagueGroupsService.getGroupStandings(groupId as string),
    { revalidateOnFocus: false }
  );

  const standings = fetchedStandings ?? [];

  // Map totals per user_id from standings
  const totalsByUserId = useMemo(() => {
    const map: Record<string, number> = {};
    if (!Array.isArray(standings)) return map;
    for (const row of standings) {
      if (!row?.user_id) continue;
      map[row.user_id] = row.total_score ?? 0;
    }
    return map;
  }, [fetchedStandings]);

  // Sort members by total points desc
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const ta = totalsByUserId[a.user_id] ?? 0;
      const tb = totalsByUserId[b.user_id] ?? 0;
      if (tb !== ta) return tb - ta;
      // Tie-breaker: username or first_name from the nested user object
      const an = a.user?.username || a.user?.first_name || '';
      const bn = b.user?.username || b.user?.first_name || '';
      return an.localeCompare(bn);
    });
  }, [members, totalsByUserId]);

  // Handle team row click

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse" >
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

      </div>
    )
  }

  if (error) {
    return <div>
      <ErrorState 
        error="Whoops, Failed to load league standings"
        message="Something wen't wrong please try again"
      />
    </div>
  }

  return (
    <div className="flex flex-col gap-4" >

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

      <div className="flex flex-row items-center p-3 justify-between" >

        <div className="flex flex-row items-center gap-2" >
          <SecondaryText className="text-md w-10" >Rank</SecondaryText>
          <SecondaryText className="text-md" >Manager</SecondaryText>
        </div>

        <div>
          <SecondaryText className="text-md" >Points</SecondaryText>
        </div>

      </div>
      {standings.map((member, index) => {
        return <LeagueStandingsRow
          member={member}
          key={index}
          index={index}
          isUser={userMemberRecord?.user_id === member.user_id}
        />
      })}

      <div>
        {/* {isMember && <PrimaryButton onClick={handleShare} className="" >
          <Plus className="w-4 h-4" />
          <p>Invite</p>
        </PrimaryButton>} */}
      </div>

    </div>
  );
}

type StandingsProps = {
  member: FantasyLeagueGroupStanding,
  index: number,
  isUser?: boolean
}

function LeagueStandingsRow({ member, isUser }: StandingsProps) {


  return (
    <div className="flex flex-row rounded-xl cursor-pointer hover:bg-slate-200 hover:dark:bg-slate-800/60  p-3 items-center gap-2 justify-between" >

      <div className="flex flex-row items-center gap-2" >
        <p className="w-10" >{member.rank}</p>

        {isUser && <div className=" w-6 h-6 bg-blue-500 rounded-xl flex flex-col items-center justify-center" >
          <User className="w-4 h-4 text-white" />
        </div>}

        <div>
          <p>{member.username ?? member.first_name}</p>
          {/* <p>{member.user.first_name}</p> */}
        </div>

      </div>

      <div>
        <p>{member.total_score}</p>
      </div>
    </div>
  )
}