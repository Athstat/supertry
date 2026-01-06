import useSWR from 'swr';
import { powerRankingsService } from '../../../services/powerRankingsService';
import { LoadingIndicator } from '../../ui/LoadingIndicator';
import { SingleMatchPowerRanking } from '../../../types/powerRankings';
import { Calendar } from 'lucide-react';
import TeamLogo from '../../team/TeamLogo';
import { twMerge } from 'tailwind-merge';
import { IProAthlete } from '../../../types/athletes';
import { usePlayerData } from '../../../providers/PlayerDataProvider';
import RoundedCard from '../../shared/RoundedCard';
import MatchPrCard from '../../rankings/MatchPrCard';
import SecondaryText from '../../shared/SecondaryText';
import { abbreviateSeasonName } from '../../players/compare/PlayerCompareSeasonPicker';
import formatDate from 'date-fns/format';

type Props = {
  player: IProAthlete;
};

export default function PlayerMatchsPRList({ player }: Props) {

  const { data, isLoading } = useSWR(`player-matches-pr/${player.tracking_id}`, () =>
    powerRankingsService.getPastMatchsPowerRankings(player.tracking_id ?? '', 10)
  );

  const matchesPR: SingleMatchPowerRanking[] = data ?? [];

  if (isLoading) return <LoadingIndicator />;

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
          <div className="px-3 flex items-center justify-center py-0.5 rounded-full bg-green-500/20 backdrop-blur-sm ring-1 ring-green-500/30">
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              Won {matchesWon}
            </span>
          </div>
          <div className="px-2  flex items-center justify-center py-0.5 rounded-full bg-red-500/20 backdrop-blur-sm ring-1 ring-red-500/30">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
              Lost {matchesLost}
            </span>
          </div>
          {matchesDrawn > 0 && (
            <div className="px-3 flex items-center justify-center py-0.5  rounded-full bg-slate-500/20 backdrop-blur-sm ring-1 ring-slate-500/30">
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
  } = singleMatchPr.game;

  const { player, setSelectedFixture } = usePlayerData();


  if (
    !player ||
    opposition_score === undefined ||
    team_score === undefined ||
    game_status !== 'completed'
  ) {
    return;
  }

  const handleClick = () => {
    setSelectedFixture(singleMatchPr.game);
  }

  const wasHomePlayer = singleMatchPr.team_id === singleMatchPr.game.team?.athstat_id;

  const { wasDraw, athleteTeamWon } = didAthleteTeamWin(singleMatchPr);
  const kickoff_time = singleMatchPr.game.kickoff_time ? new Date(singleMatchPr.game.kickoff_time) : undefined;

  const oppositionTeamName = wasHomePlayer
    ? singleMatchPr.game.opposition_team?.athstat_name
    : singleMatchPr.game.team?.athstat_name;

  const oppositionImageUrl = wasHomePlayer
    ? singleMatchPr.game.opposition_team?.image_url
    : singleMatchPr.game.team?.image_url;


  return (
    <RoundedCard onClick={handleClick} className="flex flex-col gap-2 cursor-pointer p-4 transition-all duration-200">
      {/* Match Info */}

      <div className="flex flex-row items-center justify-between">

        <div className="flex flex-row items-center gap-3 flex-1">
          <TeamLogo className="w-10 h-10 rounded-lg" url={oppositionImageUrl} />

          <div>
            <p className="dark:text-white">vs {oppositionTeamName}</p>

            {wasDraw ? (
              <p className="dark:text-slate-400 text-sm text-slate-600">
                D {team_score} - {opposition_score}
              </p>
            ) : (
              <p
                className={twMerge(
                  'text-sm',
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

        {/* Power Ranking Badge */}
        <div className='flex flex-col items-center justify-center gap-1' >
          <MatchPrCard
            pr={singleMatchPr.updated_power_ranking}
          />
          <SecondaryText className='text-xs' >Rating</SecondaryText>
        </div>
      </div>

      <div className='flex flex-row items-center gap-1' >
        {kickoff_time && <SecondaryText className='text-xs' >{abbreviateSeasonName(singleMatchPr.game.competition_name || "")},</SecondaryText>}
        {kickoff_time && <SecondaryText className='text-xs' >{formatDate(kickoff_time, "EEEE dd MMMM yyyy")}</SecondaryText>}
      </div>

    </RoundedCard>
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