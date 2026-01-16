import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import {
  FantasySeasonRankingItem,
} from '../../../types/fantasyLeagueGroups';
import SecondaryText from '../../ui/typography/SecondaryText';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import RoundedCard from '../../ui/cards/RoundedCard';
import { IFantasyLeagueRound } from '../../../types/fantasyLeague';
import { useOfficialLeagueGroup } from '../../../hooks/fantasy/scouting/seasons/useOfficialLeagueGroup';
import { useLeagueGroupStandings } from '../../../hooks/fantasy/standings/useLeagueGroupOverallStandings';
import { fantasyAnalytics } from '../../../services/analytics/fantasyAnalytics';
import { useNavigate } from 'react-router-dom';
import { ErrorState } from '../../ui/ErrorState';
import { LeagueStandingsTableRow } from './LeagueStandingsTableRow';
import StickyUserRankingCard from './StickyUserRankingCard';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';

type Props = {
  round?: IFantasyLeagueRound
  hideUserScore?: boolean;
};

/** Renders a league standings table component for a given round */
export default function LeagueStandingsTable({
  hideUserScore,
  round: selectedRound
}: Props) {

  const userRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { authUser } = useAuth();
  const { members, league, currentRound } = useFantasyLeagueGroup();

  const { standings, isLoading: loadingStandings, error } = useLeagueGroupStandings(league?.id, {
    round_number: selectedRound?.start_round || undefined
  });

  const { featuredLeague, isLoading: loadingOfficialLeague } = useOfficialLeagueGroup(league?.season_id)

  useEffect(() => {
    fantasyAnalytics.trackViewedStandingsTab();
  }, []);

  const handleSelectMember = useCallback((member: FantasySeasonRankingItem) => {

    fantasyAnalytics.trackClickedRowOnLeagueStandings();

    const roundFilterId = selectedRound?.id || 'overall';
    const roundNumber = roundFilterId === "overall" ? currentRound?.start_round : selectedRound?.start_round;
    const queryParams = roundNumber ? `?round_number=${roundNumber}` : "";

    if (featuredLeague) {
      if (member.user_id === authUser?.kc_id) {
        navigate(`/league/${featuredLeague.id}${queryParams}`);
        return;
      }

      navigate(`/league/${featuredLeague.id}/member/${member.user_id}${queryParams}`);
    }

  }, [authUser, currentRound, featuredLeague, navigate, selectedRound])


  const exclude_ids = standings.map((s) => {
    return s.user_id;
  })

  const leftOutMembers = members.filter((m) => {
    return !exclude_ids.includes(m.user_id);
  })

  const completeStandings: (FantasySeasonRankingItem)[] = useMemo(() => {
    const base = [...standings];
    const lastRanking = standings.length;
    const membersWhoDidntScorePoints = leftOutMembers.map<(FantasySeasonRankingItem)>((m, index) => {
      return {
        user_id: m.user_id,
        first_name: m.user.first_name,
        last_name: m.user.last_name,
        username: m.user.username,
        total_score: 0,
        rank: undefined,
        league_rank: lastRanking + index + 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return [...base, ...membersWhoDidntScorePoints];
  }, [leftOutMembers, standings]);

  const userRanking = completeStandings.find((r) => {
    return r.user_id === authUser?.kc_id;
  })

  const isLoading = loadingOfficialLeague || loadingStandings;

  const handleScrollToUser = () => {
    if (userRef.current) {
      userRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  const isRoundLocked = selectedRound && isLeagueRoundLocked(selectedRound);

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
    <div className="overflow-y-auto rounded-xl bg-slate-100 dark:bg-slate-800/40">
      <div className="flex  flex-row items-center p-3 justify-between">
        <div className="flex flex-row items-center gap-2">
          <SecondaryText className="text-md w-10">Rank</SecondaryText>
          <SecondaryText className="text-md">Manager</SecondaryText>
        </div>

        <div>
          <SecondaryText className="text-md">{selectedRound ? `${selectedRound.title} Points` : "Points"}</SecondaryText>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4 animate-pulse p-4">
          <RoundedCard className="border-none h-8 w-1/3 lg:w-1/4" />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <RoundedCard className="border-none h-8 w-32" />
              <RoundedCard className="border-none h-8 w-20" />
            </div>

            <RoundedCard className="border-none h-8 w-20" />
          </div>

          <div className="flex flex-col gap-2">
            <RoundedCard className="border-none h-12 w-full" />
            <RoundedCard className="border-none h-12 w-full" />
            <RoundedCard className="border-none h-12 w-full" />
          </div>
        </div>
      )}

      <StickyUserRankingCard
        userRanking={userRanking}
        onClick={handleScrollToUser}
      />

      {!isLoading && <div className="divide-y dark:divide-slate-700/20 divide-slate-300/40">
        {completeStandings.map((ranking, index) => {

          const isUser = authUser?.kc_id === ranking.user_id

          return (
            <div
              ref={isUser ? userRef : undefined}
              key={ranking.user_id}
            >
              <LeagueStandingsTableRow
                ranking={ranking}
                index={index}
                isUser={isUser}
                hideUserScore={hideUserScore}
                onClick={handleSelectMember}
                showBadges={isRoundLocked}
              />
            </div>
          );

        })}
      </div>}


    </div>
  );
}
