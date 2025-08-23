import useSWR from 'swr';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { PlayerGameCard } from '../player/PlayerGameCard';
import RugbyPitch from '../shared/RugbyPitch';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { fantasyAthleteService } from '../../services/fantasy/fantasyAthleteService';

interface TeamFormationProps {
  players: IFantasyTeamAthlete[];
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
  round: IFantasyLeagueRound
}

export function TeamFormation({ players, onPlayerClick, round }: TeamFormationProps) {
  const positionGroups = {
    'Front Row': players.filter(p => p.position_class === 'front-row' && p.is_starting),
    'Second Row': players.filter(p => p.position_class === 'second-row' && p.is_starting),
    'Back Row': players.filter(p => p.position_class === 'back-row' && p.is_starting),
    Halfback: players.filter(p => p.position_class === 'half-back' && p.is_starting),
    Back: players.filter(p => p.position_class === 'back' && p.is_starting),
  };

  return (
    <div className="relative h-[900px] lg:h-[650px] bg-green-700 rounded-2xl overflow-hidden">
      <RugbyPitch />

      <div className="absolute inset-0 flex flex-row flex-wrap items-center justify-center gap-2  lg:p-6 lg:px-[10%]">
        {/* Front Row - Top */}
        {positionGroups['Front Row'].map(player => (
          <FantasyTeamAthleteCard
            player={player}
            onPlayerClick={onPlayerClick}
            round={round}
          />
        ))}

        {/* Second Row - Left Side */}
        {positionGroups['Second Row'].map(player => (
          <FantasyTeamAthleteCard
            player={player}
            onPlayerClick={onPlayerClick}
            round={round}
          />
        ))}

        {/* Back Row - Center Left */}
        {positionGroups['Back Row'].map(player => (
          <FantasyTeamAthleteCard
            player={player}
            onPlayerClick={onPlayerClick}
            round={round}
          />
        ))}

        {positionGroups['Halfback'].map(player => (
          <FantasyTeamAthleteCard
            player={player}
            onPlayerClick={onPlayerClick}
            round={round}
          />
        ))}

        {/* Back - Right Side */}
        {positionGroups['Back'].map(player => (
          <FantasyTeamAthleteCard
            player={player}
            onPlayerClick={onPlayerClick}
            round={round}
          />
        ))}
      </div>
    </div>
  );
}

type TeamPlayerCardProp = {
  player: IFantasyTeamAthlete,
  onPlayerClick?: (player: IFantasyTeamAthlete) => void,
  round: IFantasyLeagueRound
}

function FantasyTeamAthleteCard({ player, onPlayerClick, round }: TeamPlayerCardProp) {

  const handlePlayerClick = () => {
    if (onPlayerClick) {
      onPlayerClick(player);
    }
  }

  const key = `/fantasy-team/${player.team_id}/athlete-points-breakdown/${player.id}`
  const { data: pointItems, isLoading } = useSWR(key, () => fantasyAthleteService.getRoundPointsBreakdown(
    player.athlete_id,
    round.start_round ?? 0,
    round.season_id
  ));

  console.log(round);

  const totalPoints = pointItems?.reduce((prev, curr) => {
    return prev + (curr.score ?? 0);
  }, 0) ?? 0;

  return (
    <div className='flex flex-col items-center justify-start' >

      <PlayerGameCard
        key={player.id}
        player={player}
        onClick={handlePlayerClick}
        className="max-h-[230px]"
      />

      {!isLoading && <p className='text-white h-3 font-bold' >{Math.floor(totalPoints)}</p>}

      {isLoading && <p className='text-white font-bold w-3 h-3 rounded-full animate-pulse bg-white/50' ></p>}
    </div>
  )
}