import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CardTier } from '../../../types/athletes';
import { ScrummyDarkModeLogo } from '../../branding/scrummy_logo';
import { CircleDollarSign } from 'lucide-react';
import { getTeamJerseyImage } from '../../../utils/athleteUtils';
import { usePlayerData } from '../../../providers/PlayerDataProvider';

export default function PlayerProfileBanner() {
  const { player } = usePlayerData();
  const [playerImageErr, setPlayerImageErr] = useState<boolean>(false);

  // Use the same image fallback logic as PlayerGameCard
  const imageUrl = useMemo(() => {
    // First try to use the player's actual image
    if (player?.image_url && !playerImageErr) {
      return player.image_url;
    }

    // Fall back to team jersey image
    return player?.team?.athstat_id ? getTeamJerseyImage(player.team.athstat_id) : undefined;
  }, [player, playerImageErr]);

  const pr = player?.power_rank_rating ?? 0;
  const cardTier: CardTier =
    pr <= 69 ? 'bronze' : pr >= 70 && pr < 80 ? 'silver' : pr >= 90 ? 'blue' : 'gold';

  if (!player) return;

  return (
    <div
      className={twMerge(
        'relative flex flex-row overflow-clip object-contain items-end rounded-xl bg-blue-500 justify-center w-full h-[200px]',
        cardTier === 'gold' && 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 ',
        cardTier === 'silver' && 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
        cardTier === 'bronze' &&
          'bg-gradient-to-br from-amber-600 via-amber-800 to-amber-900 text-white',
        cardTier === 'blue' &&
          'bg-gradient-to-br from-purple-600 via-blue-800 to-purple-900 text-white',
        cardTier === 'blue' && 'animate-glow'
      )}
    >
      {player?.price !== undefined && (
        <div className="absolute top-2 left-2 z-40 flex flex-row items-center gap-1 bg-black/10 text-white rounded-md px-2 py-1">
          <CircleDollarSign className="w-4 h-4" />
          <p className="text-sm font-bold">{player?.price}</p>
        </div>
      )}
      {imageUrl ? (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            className="h-[200px] object-contain"
            onError={() => setPlayerImageErr(true)}
          />
        </div>
      ) : (
        <ScrummyDarkModeLogo className="h-[200px] w-[200px] grayscale opacity-30" />
      )}
    </div>
  );
}
