import { useMemo } from 'react';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IFantasyLeagueTeamSlot } from '../../types/fantasyLeagueTeam';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { RugbyPitch3D } from '../shared/RugbyPitch';
import { twMerge } from 'tailwind-merge';
import PlayerMugshot from '../shared/PlayerMugshot';
import { formatPosition } from '../../utils/athleteUtils';
import SecondaryText from '../shared/SecondaryText';

interface TeamFormationProps {
  players: IFantasyLeagueTeamSlot[];
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
  round: IFantasyLeagueRound
}

/** Renders a 3 Dimensional-looking pitch view */
export function TeamFormation3D({ players: slots, onPlayerClick }: TeamFormationProps) {

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
              />
            )
          })}
        </div>


      </div>

    </div>
  );
}

type PlayerPitchCardProps = {
  player: IFantasyTeamAthlete,
  onClick?: (player: IFantasyTeamAthlete) => void
}

function PlayerPitchCard({ player, onClick }: PlayerPitchCardProps) {

  const { position_class } = player;
  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
  }

  return (
    <div
      className={twMerge(
        'overflow-hidden rounded-xl min-h-[150px] max-h-[150px] bg-green-500/50',
        'min-w-[120px] max-w-[120px] flex flex-col'
      )}
      onClick={handleClick}
    >

      <div className='flex-3 flex overflow-clip flex-col items-center justify-center w-full' >
        <PlayerMugshot
          url={player.image_url}
          className='border-none rounded-none w-[100px] h-[100px] bg-transparent hover:bg-transparent'
          showPrBackground={false}
        />

        {/* <TeamJersey 
          teamId={player.athlete_team_id}
          className='border-none rounded-none w-[100px] h-[100px] bg-transparent hover:bg-transparent'
        /> */}
      </div>

      <div className='flex-1 p-2 w-full items-center justify-center  min-h-[30%] rounded-xl bg-gradient-to-br from-white to-slate-200 dark:from-slate-800 dark:to-dark-900' >
        
        <div className='flex flex-col items-center justify-center' >
          <p className='text-slate-800 dark:text-white text-[11px] font-semibold' >{player.athstat_firstname}</p>
        </div>

        <div className='flex flex-col items-center justify-center' >
          <SecondaryText className=' text-[10px]' >{position_class ? formatPosition(position_class) : ""}</SecondaryText>
        </div>

      </div>
    </div>
  )
}