import { useState } from 'react';
import { MdShield } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

type Props = {
  url?: string;
  alt?: string;
  teamName?: string;
  className?: string;
};

/** Renders a pro teams logo */
export default function TeamLogo({ url, alt, className, teamName }: Props) {
  // Always use fallback Shield icon instead of official logos

  const [error, setError] = useState(false);
  const imageUrl = url ?? getTeamLogoUrl(teamName);

  if (error) {
    return (
      <MdShield
        className={twMerge(
          'w-14 h-14 text-slate-300 dark:text-slate-600 rounded-md flex items-center justify-center',
          className
        )}
      />
    );
  }

  return (
    <div className={twMerge('w-14 h-14 overflow-clip ', className)}>
      <img
        src={imageUrl}
        alt={alt ?? 'team_logo'}
        onError={() => setError(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

function getTeamLogoUrl(teamName?: string) {
  if (!teamName) return undefined;

  if (teamName === 'Zimbabwe') {
    return '/pro_logos/Zimbabwe.png';
  }

  if (teamName === 'Morocco') {
    return '/pro_logos/Moroco.png';
  }

  if (teamName === 'Algeria') {
    return '/pro_logos/Algeria.png';
  }

  if (teamName === 'Côte d’Ivoire') {
    return '/pro_logos/ivory_coast.png';
  }

  if (teamName === 'Namibia') {
    return '/pro_logos/Namibia.png';
  }

  if (teamName === 'Senegal') {
    return '/pro_logos/Senegal.png';
  }

  if (teamName === 'Kenya') {
    return '/pro_logos/Kenya.png';
  }

  if (teamName === 'Uganda') {
    return '/pro_logos/Uganda.png';
  }

  return undefined;
}
