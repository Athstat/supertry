import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CardTier } from '../../types/cardTiers';
import ScrummyLogo from '../branding/scrummy_logo';
import TeamJersey from '../player/TeamJersey';

type Props = {
  url?: string;
  className?: string;
  alt?: string;
  showPrBackground?: boolean;
  playerPr?: number;
  teamId?: string;
  isCaptain?: boolean;
};

export default function PlayerMugshot({
  url,
  className,
  alt,
  showPrBackground,
  playerPr,
  teamId,
  isCaptain = false,
}: Props) {

  const teamFallbackUrl = teamId
    ? `https://athstat-landing-assets-migrated.s3.us-east-1.amazonaws.com/logos/${teamId}-ph-removebg-preview.png`
    : null;
  // Start with main URL; if absent, try team fallback; if that fails, show ScrummyLogo
  const [error, setError] = useState(false);
  const src = url;


  const pr = playerPr ?? 0;
  const cardTier: CardTier =
    pr <= 69 ? 'bronze' : pr > 70 && pr < 80 ? 'silver' : pr >= 90 ? 'blue' : 'gold';

  // If both sources failed, show ScrummyLogo inside a neutral circle
  if (!src) {
    return (
      <div
        className={twMerge(
          'w-14 h-14 bg-slate-300 dark:text-slate-400 flex items-center justify-center dark:bg-slate-800 rounded-full p-2',
          className
        )}
      >
        <ScrummyLogo className="opacity-30" />
      </div>
    );
  }

  // If using the team fallback image, use the neutral gray circle container (like previous fallback UI)
  if (teamFallbackUrl && src === teamFallbackUrl) {
    return (
      <div
        className={twMerge(
          'w-14 h-14 bg-slate-300 dark:text-slate-400 flex items-center justify-center dark:bg-slate-800 rounded-full p-2 ',
          className
        )}
      >
        <img
          src={src}
          alt={''}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        'relative w-14 h-14 overflow-clip cursor-pointer border rounded-full',
        isCaptain
          ? 'border-yellow-500 border-2 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
          : 'border-slate-400 dark:border-slate-800',
        cardTier === 'gold' &&
        showPrBackground &&
        'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 ',
        cardTier === 'silver' &&
        showPrBackground &&
        'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
        cardTier === 'bronze' &&
        showPrBackground &&
        'bg-gradient-to-br from-amber-600 via-amber-800 to-amber-900 text-white',
        cardTier === 'blue' &&
        showPrBackground &&
        'bg-gradient-to-br from-purple-600 via-blue-800 to-purple-900 text-white',
        'hover:bg-gradient-to-br hover:from-blue-400 hover:via-blue-600 hover:to-blue-800 hover:text-white',
        'transition-all delay-100',
        className
      )}
    >
      {!error && <img
        src={src}
        alt={''}
        onError={() => setError(true)}
        className="w-full h-full object-contain"
      />}

      {error && (
        <TeamJersey
          teamId={teamId}
          className={twMerge(
            'w-full h-full object-contain',
          )}
        />
      )}
    </div>
  );
}
