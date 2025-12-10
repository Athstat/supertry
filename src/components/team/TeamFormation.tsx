import { useMemo } from 'react';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { RugbyPitch3DRaster } from '../shared/RugbyPitch';
import { EmptySlotPitchCard, PlayerPitchCard } from './PlayerPitchCard';
import { useFantasyLeagueTeam } from '../fantasy-leagues/my-team/FantasyLeagueTeamProvider';

interface TeamFormationProps {
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
}

/** Renders a 3 Dimensional-looking pitch view */
export function TeamFormation3D({ onPlayerClick}: TeamFormationProps) {

  const {slots, leagueRound: round} = useFantasyLeagueTeam();

  const firstRowSlots = useMemo(() => {
    return slots
      .filter((a) => {
        return a.slotNumber <= 2;
      });
  }, [slots]);

  const lastRowSlots = useMemo(() => {
    return slots
      .filter((a) => {
        return a.slotNumber >= 3 && a.slotNumber < 6;
      });
  }, [slots]);

  if (!round) {
    return;
  }

  return (
    <div className="relative w-full mt-10 flex flex-col justify-center">

      <RugbyPitch3DRaster />

      <div className='top-0 left-0 absolute w-full p-3 flex flex-col gap-6' >

        <div className='flex mt-10 flex-row items-center gap-4 justify-center' >
          {firstRowSlots.map((s) => {

            const { athlete } = s;

            if (!athlete) {
              return (
                <EmptySlotPitchCard
                  slot={s}
                />
              )
            };

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

        <div className='flex flex-row items-center gap-3 justify-center' >
          {lastRowSlots.map((s) => {

            const { athlete } = s;
            
            if (!athlete) {
              return (
                <EmptySlotPitchCard
                  slot={s}
                />
              )
            };

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

