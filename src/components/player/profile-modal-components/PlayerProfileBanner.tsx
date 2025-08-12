import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CardTier, IProAthlete } from '../../../types/athletes';
import { ScrummyDarkModeLogo } from '../../branding/scrummy_logo';

interface Props {
  player: IProAthlete;
}

export default function PlayerProfileBanner({ player} : Props) {

  const [imageError, setImageError] = useState<boolean>(false);

  const pr = player.power_rank_rating ?? 0;
  const cardTier: CardTier =
    pr <= 69 ? 'bronze' : pr >= 70 && pr < 80 ? 'silver' : pr >= 90 ? 'blue' : 'gold';

  return (
    <div className={twMerge(
      'flex flex-row overflow-clip object-contain items-end rounded-xl bg-blue-500 justify-center w-full h-[200px]',
          cardTier === 'gold' && 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 ',
          cardTier === 'silver' && 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
          cardTier === 'bronze' &&
          'bg-gradient-to-br from-amber-600 via-amber-800 to-amber-900 text-white',
          cardTier === 'blue' &&
          'bg-gradient-to-br from-purple-600 via-blue-800 to-purple-900 text-white',
          cardTier === "blue" && "animate-glow"
    )} >
      
      {player.image_url && !imageError && <img 
        src={player.image_url}
        className='h-[200px]'
        onError={() => setImageError(true)}

      />}

      {imageError || !player.image_url && (
        <ScrummyDarkModeLogo
          className='h-[200px] w-[200px] grayscale opacity-30'
        />
      )}


    </div>
  );
};
