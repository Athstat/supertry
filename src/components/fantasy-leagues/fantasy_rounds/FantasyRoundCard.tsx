import { Trophy, Zap, ChevronRight, Award, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import PlayerMugshot from '../../shared/PlayerMugshot';
import PrimaryButton from '../../shared/buttons/PrimaryButton';
import useSWR from 'swr';
import { useInView } from 'react-intersection-observer';
import { leagueService } from '../../../services/leagueService';
import RoundedCard from '../../shared/RoundedCard';
import { Fragment, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';
import { twMerge } from 'tailwind-merge';
import { useTabView } from '../../shared/tabs/TabView';

type Props = {
  round: IFantasyLeagueRound;
  onCreateTeam: () => void;
  onViewTeam?: (team: IFantasyLeagueTeam, round: IFantasyLeagueRound) => void;
  onPlayerClick?: (player: IFantasyTeamAthlete) => void;
};

export default function FantasyRoundCard({
  round,
  onCreateTeam,
  onViewTeam,
  onPlayerClick,
}: Props) {
  const { ref, inView } = useInView({ triggerOnce: true });

  const key = inView ? `/participating-teams/round/${round.id}` : null;
  const { data: fetchedTeams, isLoading } = useSWR(key, () =>
    leagueService.fetchParticipatingTeams(round.id)
  );

  const teams = fetchedTeams ?? [];
  const { authUser: currentUser } = useAuth();
  const { isMember } = useFantasyLeagueGroup();

  const totalTeams = teams?.length ?? 0;

  const userTeam = useMemo(() => {
    return teams.find(t => t.user_id === currentUser?.kc_id);
  }, [teams, currentUser]);

  const hasUserTeam = Boolean(userTeam);

  // Determine top team by best rank (fallback to position)
  const sortedByRank = [...(teams || [])].sort(
    (a, b) =>
      (a.rank ?? a.position ?? Number.POSITIVE_INFINITY) -
      (b.rank ?? b.position ?? Number.POSITIVE_INFINITY)
  );
  const topTeam = sortedByRank[0];
  const topTeamName = topTeam?.team_name || undefined;

  const totalPoints = (userTeam?.athletes || []).reduce((sum, a) => sum + (a.score ?? 0), 0);
  const userRank = userTeam?.rank ?? userTeam?.position;

  const isLocked = round && isLeagueRoundLocked(round);

  return (
    <div ref={ref}>
      {isLoading ? (
        <RoundedCard className="w-full bg-slate-300 h-[100px] rounded-xl border-none animate-pulse" />
      ) : (

        <Fragment>

          {(isLocked && !hasUserTeam && !isLoading) ? (
            <FantasyRoundLockedState
              round={round}
            />
          ) : (
            <motion.div
              ref={ref}
              className={`w-full p-4 rounded-2xl bg-white dark:bg-gray-800/60 border border-slate-300 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-200 ${hasUserTeam && onViewTeam ? 'cursor-pointer' : ''
                }`}
              onClick={() => {
                console.log('onClick called');

                if (onViewTeam && userTeam) {
                  onViewTeam(userTeam, round);
                }
              }}
              whileHover={
                hasUserTeam && onViewTeam
                  ? {
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 300 },
                  }
                  : {}
              }
            >
              {/* Header: title left, status + chevron right */}
              <div className="flex items-start justify-between gap-3">
                <div className='flex flex-row items-center gap-1' >

                  {isLocked && <Lock className='w-4 h-4' />}
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {round.title}
                  </h3>

                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs md:text-sm inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${!isLocked
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                  >
                    {!isLocked ? 'Open' : 'Locked'}
                  </span>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>

              {/* Points & Rank pills under title if user has a team */}
              {hasUserTeam && (
                <div className="mt-2 flex flex-row items-center flex-wrap gap-2">
                  <div className="text-xs md:text-sm inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Points {totalPoints.toFixed(0)}</span>
                  </div>
                  <div className="text-xs md:text-sm inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{userRank ? `Rank #${userRank}` : 'Not ranked yet'}</span>
                  </div>
                </div>
              )}

              {/* Athletes row or Create CTA */}
              <div className="mt-4">
                {!isMember ? (
                  <div className="w-full flex flex-col items-center justify-center gap-2">
                    <span className="text-md text-gray-900 dark:text-gray-100">
                      Join this league to create a team
                    </span>
                  </div>
                ) : hasUserTeam ? (
                  <AthletesRow
                    athletesCount={(userTeam?.athletes || []).length}
                    athletes={userTeam?.athletes || []}
                    onPlayerClick={onPlayerClick}
                  />
                ) : round.is_open ? (
                  <div className="w-full flex flex-col items-center justify-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      No team yet for this round
                    </span>
                    {<PrimaryButton className="px-3 py-1" onClick={onCreateTeam}>
                      Create Team
                    </PrimaryButton>}
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      No team for this round
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 border-t pt-2">
                Total teams: {totalTeams}
                {topTeamName ? ` • Top team: ${topTeamName}` : ''}
              </p>
            </motion.div>
          )}

        </Fragment>

      )}
    </div>
  );
}

type LockedStateProps = {
  round: IFantasyLeagueRound
}

function FantasyRoundLockedState({ round }: LockedStateProps) {

  // const 

  const { navigate } = useTabView();

  const handleViewStandings = () => {
    navigate('standings');
  }

  return (
    <RoundedCard className='flex flex-col p-4 gap-4' >
      <div className='flex flex-row items-center gap-2 justify-between' >
        <div className='flex flex-row items-center gap-1' >
          <Lock className='w-4 h-4' />
          <p className='font-bold text-md' >{round.title}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={twMerge(
              'text-xs md:text-sm inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium',
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            )}
          >
            {'Locked'}
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-900 dark:text-gray-100">
          Whoops! You can't pick your team for <strong>{round.title}</strong>, the round has been locked!
        </p>
      </div>

      <div>
        <PrimaryButton
          className=''
          onClick={handleViewStandings}
        >View Standings</PrimaryButton>
      </div>
    </RoundedCard>
  )
}

type AthletesRowProps = {
  athletes: IFantasyTeamAthlete[];
  athletesCount: number;
  onPlayerClick?: (player: IFantasyTeamAthlete) => void;
};

function AthletesRow({ athletes, onPlayerClick }: AthletesRowProps) {
  return (
    <div className="max-w-full overflow-x-auto no-scrollbar pb-1">
      <div className="whitespace-nowrap scroll-smooth space-x-4 flex pr-2">
        {athletes.map(a => (
          <div
            key={a.tracking_id}
            className="items-center flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={e => {
              e.stopPropagation();
              console.log('Player clicked:', a);
              onPlayerClick?.(a);
            }}
          >
            <div className="relative">
              {a.is_captain && (
                <div className="absolute -top-0 -left-0 z-10 bg-yellow-500 rounded-full p-1">
                  <Award className="w-3 h-3 text-white" />
                </div>
              )}
              <PlayerMugshot
                playerPr={a.power_rank_rating}
                showPrBackground
                url={a.image_url}
                isCaptain={a.is_captain}
                teamId={a.athlete_team_id}
                className='w-14 h-14'
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 max-w-14 truncate">
              {a.player_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
