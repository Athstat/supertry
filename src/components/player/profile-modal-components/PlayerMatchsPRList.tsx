import useSWR from 'swr';
import { powerRankingsService } from '../../../services/powerRankingsService';
import { LoadingState } from '../../ui/LoadingState';
import { SingleMatchPowerRanking } from '../../../types/powerRankings';
import RoundedCard from '../../shared/RoundedCard';
import { Calendar } from 'lucide-react';
import TeamLogo from '../../team/TeamLogo';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import PillTag from '../../shared/PillTap';
import SecondaryText from '../../shared/SecondaryText';
import { IProAthlete } from '../../../types/athletes';
import { useNavigate } from 'react-router-dom';

type Props = {
  player: IProAthlete;
};

export default function PlayerMatchsPRList({ player }: Props) {
  const { data, isLoading } = useSWR(`player-matches-pr/${player.tracking_id}`, () =>
    powerRankingsService.getPastMatchsPowerRankings(player.tracking_id ?? '', 10)
  );

  const matchesPR: SingleMatchPowerRanking[] = data ?? [];

  if (isLoading) return <LoadingState />;

  if (matchesPR.length === 0) {
    return <></>;
  }

  if (matchesPR.length === 0) {
    return;
  }

  const matchesWon = matchesPR.reduce((sum, m) => {
    const { athleteTeamWon } = didAthleteTeamWin(m);
    return sum + (athleteTeamWon ? 1 : 0);
  }, 0);

  const matchesLost = matchesPR.reduce((sum, m) => {
    const { athleteTeamWon } = didAthleteTeamWin(m);
    return sum + (athleteTeamWon ? 0 : 1);
  }, 0);

  const matchesDrawn = matchesPR.reduce((sum, m) => {
    const { wasDraw } = didAthleteTeamWin(m);
    return sum + (wasDraw ? 1 : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Last {matchesPR.length} Matches
        </h3>

        {/* Filter Pills */}
        <div className="flex flex-row items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm ring-1 ring-green-500/30">
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              Won {matchesWon}
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-sm ring-1 ring-red-500/30">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
              Lost {matchesLost}
            </span>
          </div>
          {matchesDrawn > 0 && (
            <div className="px-3 py-1 rounded-full bg-slate-500/20 backdrop-blur-sm ring-1 ring-slate-500/30">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Draw {matchesDrawn}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Match Cards */}
      <div className="flex flex-col gap-3">
        {matchesPR.map((matchPr, index) => {
          return <PlayerSingleMatchPrCard key={index} singleMatchPr={matchPr} />;
        })}
      </div>
    </div>
  );
}

type CardProps = {
  singleMatchPr: SingleMatchPowerRanking;
};

function PlayerSingleMatchPrCard({ singleMatchPr }: CardProps) {
  const {
    opposition_score,
    team_score,
    game_status,
    kickoff_time,
    competition_name: season_name,
  } = singleMatchPr.game;

  if (opposition_score === undefined || team_score === undefined || game_status !== 'completed') {
    return;
  }

  const wasHomePlayer = singleMatchPr.team_id === singleMatchPr.game.team?.athstat_id;

  const { wasDraw, athleteTeamWon } = didAthleteTeamWin(singleMatchPr);

  const oppositionTeamName = wasHomePlayer
    ? singleMatchPr.game.opposition_team?.athstat_name
    : singleMatchPr.game.team?.athstat_name;

  const oppositionImageUrl = wasHomePlayer
    ? singleMatchPr.game.opposition_team?.image_url
    : singleMatchPr.game.team?.image_url;

  const navigate = useNavigate();

  const goToMatchPage = () => {
    navigate(`/fixtures/${singleMatchPr.game.game_id}`);
  };

  return (
    <div className="flex flex-col gap-3 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl ring-1 ring-white/10 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
      {/* Match Info */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <TeamLogo className="w-10 h-10 rounded-lg" url={oppositionImageUrl} />
          <div>
            <p className="font-semibold dark:text-white">vs {oppositionTeamName}</p>
            {wasDraw ? (
              <p className="dark:text-slate-400 text-sm text-slate-600 font-medium">
                D {team_score} - {opposition_score}
              </p>
            ) : (
              <p
                className={twMerge(
                  'text-sm font-bold',
                  athleteTeamWon
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {athleteTeamWon ? 'W' : 'L'} {team_score} - {opposition_score}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-row items-center gap-3">
          {singleMatchPr.minutes_played !== undefined && singleMatchPr.minutes_played !== null && (
            <div className="flex flex-col items-center justify-center">
              <p className="dark:text-slate-200 text-slate-900 text-sm font-semibold">
                {singleMatchPr.minutes_played}'
              </p>
              <p className="text-xs dark:text-slate-400 text-slate-600">mins</p>
            </div>
          )}
          {singleMatchPr.fantasy_points !== undefined && singleMatchPr.fantasy_points !== null && (
            <div className="flex flex-col items-center justify-center">
              <p className="dark:text-slate-200 text-slate-900 text-sm font-semibold">
                {singleMatchPr.fantasy_points.toFixed(1)}
              </p>
              <p className="text-xs dark:text-slate-400 text-slate-600">pts</p>
            </div>
          )}
          <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-blue-500/20 ring-1 ring-blue-500/30">
            <p className="dark:text-blue-400 text-blue-600 text-lg font-bold">
              {singleMatchPr.updated_power_ranking}
            </p>
            <p className="text-xs dark:text-blue-400 text-blue-600">PR</p>
          </div>
        </div>
      </div>

      {/* Match Date & Competition */}
      <div className="dark:text-slate-400 text-xs text-slate-600">
        {kickoff_time ? format(kickoff_time, 'EEE dd MMM yyyy') : ''} • {season_name}
      </div>
    </div>
  );
}

function didAthleteTeamWin(singleMatchPr: SingleMatchPowerRanking) {
  const { opposition_score, team_score } = singleMatchPr.game;
  const wasHomePlayer = singleMatchPr.team_id === singleMatchPr.game.team?.athstat_id;

  const homeTeamWon = (team_score || 0) > (opposition_score || 0);
  const awayTeamWon = (opposition_score || 0) > (team_score || 0);
  const wasDraw = opposition_score === team_score;
  const athleteTeamWon = (wasHomePlayer && homeTeamWon) || (!wasHomePlayer && awayTeamWon);

  return { athleteTeamWon, wasDraw };
}
