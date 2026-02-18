import { LoadingIndicator } from '../../ui/LoadingIndicator';
import { Calendar } from 'lucide-react';
import TeamLogo from '../../team/TeamLogo';
import { twMerge } from 'tailwind-merge';
import { IProAthlete } from '../../../types/athletes';
import { usePlayerData } from '../../../providers/PlayerDataProvider';
import MatchPrCard from '../../rankings/MatchPrCard';
import SecondaryText from '../../ui/typography/SecondaryText';
import RoundedCard from '../../ui/cards/RoundedCard';
import { formatDate } from 'date-fns';
import { abbreviateSeasonName } from '../../../utils/stringUtils';
import { usePlayerLastMatches } from '../../../hooks/athletes/usePlayerNextMatch';
import { usePlayerSeasonTeam } from '../../../hooks/seasons/useSeasonTeams';
import { IFixture } from '../../../types/games';
import { IProTeam } from '../../../types/team';

type Props = {
  player: IProAthlete;
};

export default function PlayerMatchsPRList({ player }: Props) {

  const { seasonTeam } = usePlayerSeasonTeam(player);
  const { lastMatches, isLoading } = usePlayerLastMatches(player.tracking_id, 10);

  const noMatches = lastMatches.length === 0

  if (isLoading) return <LoadingIndicator />;

  if (noMatches || !seasonTeam) {
    return <></>;
  }

  const matchesWon = lastMatches.reduce((sum, game) => {
    const { athleteTeamWon } = didAthleteTeamWin(game, seasonTeam.athstat_id);
    return sum + (athleteTeamWon ? 1 : 0);
  }, 0);

  const matchesLost = lastMatches.reduce((sum, game) => {
    const { athleteTeamWon } = didAthleteTeamWin(game, seasonTeam.athstat_id);;
    return sum + (athleteTeamWon ? 0 : 1);
  }, 0);

  const matchesDrawn = lastMatches.reduce((sum, game) => {
    const { wasDraw } = didAthleteTeamWin(game, seasonTeam.athstat_id);;
    return sum + (wasDraw ? 1 : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Last {lastMatches.length} Matches
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
        {lastMatches.map((matchPr, index) => {
          return <PlayerSingleMatchPrCard key={index} game={matchPr} seasonTeam={seasonTeam} />;
        })}
      </div>
    </div>
  );
}

type CardProps = {
  game: IFixture;
  seasonTeam: IProTeam
};

function PlayerSingleMatchPrCard({ game, seasonTeam }: CardProps) {

  const {opposition_score, team_score} = game;

  const { setSelectedFixture } = usePlayerData();

  const handleClick = () => {
    setSelectedFixture(game);
  }

  const wasHomePlayer = seasonTeam.athstat_id === game.team?.athstat_id;

  const { wasDraw, athleteTeamWon } = didAthleteTeamWin(game, seasonTeam.athstat_id);
  const kickoff_time = game.kickoff_time ? new Date(game.kickoff_time) : undefined;

  const oppositionTeamName = wasHomePlayer
    ? game.opposition_team?.athstat_name
    : game.team?.athstat_name;

  const oppositionImageUrl = wasHomePlayer
    ? game.opposition_team?.image_url
    : game.team?.image_url;


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
            pr={game.updated_power_ranking}
          />
          <SecondaryText className='text-xs' >Rating</SecondaryText>
        </div>

      </div>

      <div className='flex flex-row items-center gap-1' >
        {kickoff_time && <SecondaryText className='text-xs' >{abbreviateSeasonName(game.competition_name || "")},</SecondaryText>}
        {kickoff_time && <SecondaryText className='text-xs' >{formatDate(kickoff_time, "EEEE dd MMMM yyyy")}</SecondaryText>}
      </div>

    </RoundedCard>
  );
}

function didAthleteTeamWin(game: IFixture, team_id: string) {
  const { opposition_score, team_score } = game;
  const wasHomePlayer = team_id === game.team?.athstat_id;

  const homeTeamWon = (team_score || 0) > (opposition_score || 0);
  const awayTeamWon = (opposition_score || 0) > (team_score || 0);
  const wasDraw = opposition_score === team_score;
  const athleteTeamWon = (wasHomePlayer && homeTeamWon) || (!wasHomePlayer && awayTeamWon);

  return { athleteTeamWon, wasDraw };
}