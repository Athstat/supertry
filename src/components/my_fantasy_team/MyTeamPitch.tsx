import { useEffect } from 'react';
import { fantasyAnalytics } from '../../services/analytics/fantasyAnalytics';
import { FantasyTeamFormation3D } from './FantasyTeamFormation3D';
import { twMerge } from 'tailwind-merge';
import { useMyTeam } from '../../hooks/fantasy/my_team/useMyTeam';
import { useMyTeamModals } from '../../hooks/fantasy/my_team/useMyTeamModals';

type Props = {
  className?: string,
  hideBenchPlayer?: boolean,
  firstRowCN?: string,
  pitchCN?: string
}

/** Renders my team pitch view */
export default function MyTeamPitch({ className, firstRowCN, pitchCN }: Props) {

  const { slots, round } = useMyTeam();
  const { handlePlayerClick } = useMyTeamModals();

  useEffect(() => {
    fantasyAnalytics.trackVisitedTeamPitchView();
  }, []);

  const starters = slots
    .filter((p) => p.slotNumber !== 6)
    .map(p => ({ ...p!, is_starting: p!.slotNumber !== 6 }));

  if (!round) {
    return null;
  }

  return (
    <div className={twMerge(
      " h-full",
      className
    )}>
      <div className='flex flex-col relative'>

        {round && starters.length > 0 && (
          <FantasyTeamFormation3D
            marginCN={twMerge('mt-0', pitchCN)}
            firstRowMargin={firstRowCN}
            onPlayerClick={handlePlayerClick}
          />
        )}

      </div>
    </div>
  );
}
