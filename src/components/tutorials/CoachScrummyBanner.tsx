import { twMerge } from 'tailwind-merge';
import RoundedCard from '../ui/cards/RoundedCard';

type Props = {
  message: string;
  className?: string;
  dataTutorial?: string;
};

export default function CoachScrummyBanner({ message, className, dataTutorial }: Props) {
  return (
    <RoundedCard
      className={twMerge(
        'border-none bg-blue-50/80 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3',
        className
      )}
      dataTutorial={dataTutorial}
    >
      <p className="text-xs uppercase tracking-wide">Coach Scrummy</p>
      <p className="text-sm font-medium">{message}</p>
    </RoundedCard>
  );
}
