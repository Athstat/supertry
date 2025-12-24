import { useMemo } from 'react';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { RugbyPitch3DRaster } from '../shared/RugbyPitch';
import { EmptySlotPitchCard, PlayerPitchCard } from './PlayerPitchCard';
import { useFantasyLeagueTeam } from '../fantasy-leagues/my-team/FantasyLeagueTeamProvider';
import { twMerge } from 'tailwind-merge';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IFantasyLeagueTeamSlot } from '../../types/fantasyLeagueTeam';

interface TeamFormationProps {
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
  marginCN?: string,
  firstRowMargin?: string
}

/** Renders a 3 Dimensional-looking pitch view */
export function FantasyTeamFormation3D({ onPlayerClick, marginCN, firstRowMargin }: TeamFormationProps) {

  const { slots, leagueRound: round } = useFantasyLeagueTeam();

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

  const getSlot = (slotNum: number, callback: (slot: IFantasyLeagueTeamSlot) => ReactNode) => {
    const slot = slots.find((s) => s.slotNumber === slotNum);
    if (slot) {
      return callback(slot);
    }

    return null;
  }

  if (!round) {
    return;
  }

  return (
    <div className="relative  w-full mt-10  flex flex-col justify-center">

      <RugbyPitch3DRaster className={twMerge(
        'mt-12',
        marginCN
      )} />

      <div className='top-0 left-0 absolute w-full p-3 flex flex-col gap-6' >

        <div className={twMerge(
          'flex mt-20 flex-row items-center gap-4 justify-center',
          firstRowMargin
        )} >

          {firstRowSlots.map((s) => {
            return (
              <SlotCard
                slot={s}
                onPlayerClick={onPlayerClick}
                key={s.slotNumber}
                round={round}
              />
            )
          })}

        </div>

        <div className='flex flex-row items-center gap-3 justify-center' >
          {lastRowSlots.map((s) => {
            return (
              <SlotCard
                slot={s}
                onPlayerClick={onPlayerClick}
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

type SlotCardProps = {
  slot: IFantasyLeagueTeamSlot,
  onPlayerClick?: (player: IFantasyTeamAthlete) => void,
  round?: IFantasyLeagueRound,
  className?: string
}

function SlotCard({ slot, onPlayerClick, round }: SlotCardProps) {
  const { athlete } = slot;

  if (!athlete) {
    return (
      <EmptySlotPitchCard
        slot={slot}
      />
    )
  };

  if (!round) {
    return null;
  }

  return (
    <PlayerPitchCard
      player={athlete}
      onClick={onPlayerClick}
      key={slot.slotNumber}
      round={round}
    />
  )
}