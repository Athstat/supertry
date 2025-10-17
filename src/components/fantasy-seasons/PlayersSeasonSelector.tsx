import { twMerge } from 'tailwind-merge';
import { useFantasyLeaguesScreen } from '../../hooks/fantasy/useFantasyLeaguesScreen';

export default function PlayersSeasonSelector() {
  const { fantasySeasons, selectedSeason, setSelectedSeason, setSelectedFantasySeasonId } =
    useFantasyLeaguesScreen();

  return (
    <div>
      <div className="relative z-20 flex flex-row items-center no-scrollbar flex-nowrap overflow-visible text-nowrap gap-2 pb-2">
        <ListItem
          isSelected={selectedSeason === undefined}
          title={'ALL'}
          onSelect={() => {
            setSelectedFantasySeasonId('all');
          }}
          key={'all'}
        />

        {fantasySeasons.map(s => {
          return (
            <ListItem
              isSelected={s.id === selectedSeason?.id}
              title={s.name}
              onSelect={() => {
                setSelectedSeason(s);
              }}
              key={s.id}
            />
          );
        })}
      </div>
    </div>
  );
}

type ItemProps = {
  isSelected?: boolean;
  title?: string;
  onSelect?: () => void;
};

function ListItem({ isSelected, title, onSelect }: ItemProps) {
  const getShortName = () => {
    if (title === 'Womens Rugby World Cup 2025') {
      return 'WWC 2025';
    }

    if (title === 'United Rugby Championship 25/26') {
      return 'URC 25/26';
    }

    return title;
  };

  return (
    <div
      onClick={onSelect}
      className={twMerge(
        // Base glassmorphism to match FloatingSearchBar
        'font-semibold cursor-pointer px-4 py-1.5 rounded-full backdrop-blur-md border bg-white/10 dark:bg-slate-900/40 border-white/15 dark:border-white/10 ring-1 ring-white/10 shadow-lg shadow-black/30 transition-colors',
        // Selected pill: keep brand fill but retain glass affordances (border/ring/shadow)
        isSelected &&
          'text-white bg-blue-500/90 dark:bg-blue-500/90 border-blue-300/60 dark:border-white/20 ring-blue-300/40',
        // Unselected pill text colors (same as FloatingSearchBar icons/text)
        !isSelected && 'text-slate-800 dark:text-white/90'
      )}
    >
      <p className="text-sm">{getShortName()}</p>
    </div>
  );
}
