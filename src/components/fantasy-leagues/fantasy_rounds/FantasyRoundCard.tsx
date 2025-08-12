import { Trophy, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { authService } from '../../../services/authService';
import PlayerMugshot from '../../shared/PlayerMugshot';
import PrimaryButton from '../../shared/buttons/PrimaryButton';

type Props = {
  round: IFantasyLeagueRound;
  teams?: IFantasyLeagueTeam[];
  onCreateTeam: () => void;
  onViewTeam?: (team: IFantasyLeagueTeam) => void;
};

export default function FantasyRoundCard({ round, teams, onCreateTeam, onViewTeam }: Props) {
  const currentUser = authService.getUserInfoSync();
  const totalTeams = teams?.length ?? 0;

  const userTeam = teams?.find(t => t.user_id === currentUser?.kc_id);
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

  return (
    <motion.div
      className={`w-full p-4 rounded-2xl bg-white dark:bg-gray-800/60 border border-slate-300 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-200 ${
        hasUserTeam && onViewTeam ? 'cursor-pointer' : ''
      }`}
      onClick={() => {
        if (hasUserTeam && userTeam && onViewTeam) onViewTeam(userTeam);
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
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
          {round.title}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs md:text-sm inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${
              round.is_open
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {round.is_open ? 'Open' : 'Locked'}
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
        {hasUserTeam ? (
          <AthletesRow
            athletesCount={(userTeam?.athletes || []).length}
            athletes={userTeam?.athletes || []}
          />
        ) : round.is_open ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              No team yet for this round
            </span>
            <PrimaryButton className="px-3 py-1" onClick={onCreateTeam}>
              Create Team
            </PrimaryButton>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">No team for this round</span>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Total teams: {totalTeams}
        {topTeamName ? ` • Top team: ${topTeamName}` : ''}
      </p>
    </motion.div>
  );
}

type AthletesRowProps = {
  athletes: IFantasyTeamAthlete[];
  athletesCount: number;
};

function AthletesRow({ athletes }: AthletesRowProps) {
  return (
    <div className="max-w-full overflow-x-auto pb-1">
      <div className="whitespace-nowrap scroll-smooth space-x-4 flex pr-2">
        {athletes.map(a => (
          <div key={a.tracking_id} className="items-center flex flex-col gap-1">
            <PlayerMugshot playerPr={a.power_rank_rating} showPrBackground url={a.image_url} />
            <p className="text-xs text-gray-600 dark:text-gray-400 max-w-14 truncate">
              {a.player_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
