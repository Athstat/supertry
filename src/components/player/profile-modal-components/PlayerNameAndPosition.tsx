import { IProAthlete } from '../../../types/athletes';
import SecondaryText from '../../shared/SecondaryText';
import { formatPosition } from '../../../utils/athleteUtils';

type Props = {
  player: IProAthlete;
};

export default function PlayerNameAndPosition({ player }: Props) {
  // console.log('player: ', player);

  // const starRatings = useAtomValue(playerProfileCurrStarRatings);
  // const stats = useAtomValue(playerProfileCurrStatsAtom);


  return (
    <>
      
      <div className='flex flex-row items-center justify-between' >
        
        <div>
          <p className='font-semibold text-lg' >{player.player_name}</p>
          <SecondaryText>{player.position && formatPosition(player.position)}</SecondaryText>
        </div>

        {player.power_rank_rating && <div className='flex flex-col items-center gap-0' >
          <p className='font-bold text-xl' >{Math.floor(player.power_rank_rating)}</p>
        </div>}
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
