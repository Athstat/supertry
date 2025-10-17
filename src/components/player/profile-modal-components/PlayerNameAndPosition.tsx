import SecondaryText from '../../shared/SecondaryText';
import { formatPosition } from '../../../utils/athleteUtils';
import { usePlayerData } from '../provider/PlayerDataProvider';
import AvailabilityIcon from '../../players/availability/AvailabilityIcon';


export default function PlayerNameAndPosition() {
  // console.log('player: ', player);

  // const starRatings = useAtomValue(playerProfileCurrStarRatings);
  // const stats = useAtomValue(playerProfileCurrStatsAtom);

  const {player} = usePlayerData();

  if (!player) return;
  
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="font-semibold text-lg dark:text-white">{player.player_name}</p>
          <SecondaryText>{player.position && formatPosition(player.position)}</SecondaryText>
        </div>

          <div className="flex flex-row gap-2 items-center">
            {player.power_rank_rating && <p className="font-bold text-xl dark:text-white">
              {Math.floor(player.power_rank_rating)}
            </p>}

            <AvailabilityIcon athlete={player} />
          </div>

      </div>

      {/* Player Icons
      <div className="px-4 mt-2 w-full flex flex-row items-center justify-center">
        <PlayerIconsRow
          player={player}
          starRatings={starRatings ?? null}
          seasonStats={stats}
          size="sm"
        />
      </div> */}
    </>
  );
}
