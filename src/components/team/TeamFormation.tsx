import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IFantasyLeagueTeamSlot } from '../../types/fantasyLeagueTeam';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { EmptyPlayerCard } from '../fantasy-leagues/my-team/EditableTeamSlotItem';
import RugbyPitch from '../shared/RugbyPitch';
import { FantasyTeamAthleteCard } from './FantasyTeamAthleteCard';

interface TeamFormationProps {
  players: IFantasyLeagueTeamSlot[];
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
  round: IFantasyLeagueRound
}

export function TeamFormation({ players: slots, onPlayerClick, round }: TeamFormationProps) {

  return (
    <div className="relative h-[900px] lg:h-[650px] bg-green-700 rounded-2xl overflow-hidden">
      <RugbyPitch />

      <div className="absolute inset-0 flex flex-row flex-wrap items-center justify-center gap-2 p-0 lg:px-[10%]">
        {/* Front Row - Top */}

        {slots.map((s) => {

          if (!s.athlete) {
            return <EmptyPlayerCard
            slot={s}
            />
          };
          
          const player = s.athlete; 

          return (
            <FantasyTeamAthleteCard
              key={player.id}
              player={player}
              onPlayerClick={onPlayerClick}
              round={round}
            />
          )
        })}
      </div>
    </div>
  );
}
