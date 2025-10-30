import { useMemo } from 'react';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IFantasyLeagueTeamSlot } from '../../types/fantasyLeagueTeam';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { RugbyPitch3D } from '../shared/RugbyPitch';
import { PlayerPitchCard } from './PlayerPitchCard';

interface TeamFormationProps {
  players: IFantasyLeagueTeamSlot[];
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
  round: IFantasyLeagueRound
}

/** Renders a 3 Dimensional-looking pitch view */
export function TeamFormation3D({ players: slots, onPlayerClick, round }: TeamFormationProps) {

  const firstRowSlots = useMemo(() => {
    return slots
      .filter((a) => {
        return a.slotNumber <= 2;
      });
  }, [slots]);

  const lastRowSlots = useMemo(() => {
    return slots
      .filter((a) => {
        return a.slotNumber >= 3;
      });
  }, [slots]);


  return (
    <div className="relative w-full flex flex-col justify-center">

      <RugbyPitch3D />

      <div className='top-0 left-0 absolute w-full p-4 flex flex-col gap-6' >

        <div className='flex flex-row items-center gap-2 justify-center' >
          {firstRowSlots.map((s) => {

            const { athlete } = s;
            if (!athlete) return;
            return (
              <PlayerPitchCard
                player={athlete}
                onClick={onPlayerClick}
                key={s.slotNumber}
                round={round}
              />
            )
          })}
        </div>

        <div className='flex flex-row items-center gap-2 justify-center' >
          {lastRowSlots.map((s) => {

            const { athlete } = s;
            if (!athlete) return;
            return (
              <PlayerPitchCard
                player={athlete}
                onClick={onPlayerClick}
                key={s.slotNumber}
                round={round}
              />
            )
          })}
        </div>


      </div>

    </div>
  );
}

