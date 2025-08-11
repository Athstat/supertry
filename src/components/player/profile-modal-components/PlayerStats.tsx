import { IProAthlete } from '../../../types/athletes';
import PlayerIconsRow from '../../players/compare/PlayerIconsRow';
import { useAtomValue } from 'jotai';
import {
  playerProfileCurrStarRatings,
  playerProfileCurrStatsAtom,
} from '../../../state/playerProfile.atoms';
import TeamLogo from '../../team/TeamLogo';

type Props = {
  player: IProAthlete;
};

export function PlayerStats({ player }: Props) {
  console.log('player: ', player);

  const starRatings = useAtomValue(playerProfileCurrStarRatings);
  const stats = useAtomValue(playerProfileCurrStatsAtom);


  return (
    <>
      <div className="flex justify-between px-4 py-3 -mt-10 relative z-10">
        <div className="bg-white dark:bg-slate-800/40 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
          <div className="text-lg font-bold text-gray-800 dark:text-white">{player.price ?? "-"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
        </div>

        <div className="bg-white dark:bg-slate-800/40 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            {player.power_rank_rating?.toFixed(1) || '-'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Power Ranking</div>
        </div>

        <div className="bg-white dark:bg-slate-800/40 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">

          <TeamLogo
            url={player.team.image_url}
            className='w-10 h-10'
            teamName={player.team.athstat_name}
          />

          <div className="text-xs text-gray-500 dark:text-gray-400">{player.team.athstat_name}</div>
        </div>
      </div>

      {/* Player Icons */}
      <div className="px-4 mt-2 w-full flex flex-row items-center justify-center">
        <PlayerIconsRow
          player={player}
          starRatings={starRatings ?? null}
          seasonStats={stats}
          size="sm"
        />
      </div>
    </>
  );
}

export default PlayerStats;
