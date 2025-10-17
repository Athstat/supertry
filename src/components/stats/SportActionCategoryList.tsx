import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { comparePlayersStatsAtom } from '../../state/comparePlayers.atoms';
import { SportAction } from '../../types/sports_actions';
import { shouldShowSportAction } from '../../utils/sportsActionUtils';
import SecondaryText from '../shared/SecondaryText';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useHoverCoordinates } from '../../hooks/useSmartMouseHover';
import TooltipCard from '../shared/Tooltip';
import { useSportActions } from './SportActionsDefinitionsProvider';

type Props = {
  categoryName: string;
  stats: SportAction[];
  forceCanonicalOrder?: boolean;
  highlightLeaders?: boolean;
};

/** Renders List of Sports Actions under a specific category */
export default function SportActionCategoryList({
  categoryName,
  stats,
  forceCanonicalOrder,
  highlightLeaders,
}: Props) {
  const { uiDefintions } = useSportActions();

  const categoryActions = useMemo(() => {
    // Normal flow: filter and sort by display name
    const filtered = stats
      .filter(s => s.definition?.category === categoryName)
      .filter(s => shouldShowSportAction(s));

    if (!forceCanonicalOrder) {
      return filtered.sort((a, b) => {
        const an = a.definition?.display_name ?? '';
        const bn = b.definition?.display_name ?? '';
        return an.localeCompare(bn);
      });
    }

    // Canonical order flow: use global definitions to build a fixed list
    const defs = uiDefintions
      .filter(d => d.category === categoryName)
      .sort((a, b) => (a.display_name ?? '').localeCompare(b.display_name ?? ''));

    // Build a lookup from raw stats WITHOUT filtering, so real values win over placeholders
    const rawByActionName = new Map(
      stats
        .filter(s => s.definition?.category === categoryName)
        .map(s => [s.definition?.action_name, s] as const)
    );

    // Special handling: For General, ensure top three rows are Tries, Points, Minutes Played
    const generalTopRows: { action_name: string; display_name: string }[] = [
      { action_name: 'tries', display_name: 'Tries' },
      { action_name: 'points', display_name: 'Points' },
      { action_name: 'minutes_played_total', display_name: 'Minutes Played' },
    ];

    const fromAnyCategory = new Map(stats.map(s => [s.definition?.action_name, s] as const));

    const topRows: SportAction[] = [];
    if (categoryName === 'General') {
      for (const row of generalTopRows) {
        const found = fromAnyCategory.get(row.action_name);
        if (found) {
          // Override to show under General with desired display name
          topRows.push({
            ...found,
            definition: {
              ...found.definition,
              category: 'General',
              display_name: row.display_name,
            },
          } as SportAction);
        } else {
          topRows.push({
            athlete_id: '',
            action: '' as any,
            action_count: undefined as unknown as number,
            season_id: '',
            // @ts-expect-error not needed for display
            season: undefined,
            definition: {
              action_name: row.action_name,
              display_name: row.display_name,
              category: 'General',
            } as any,
          });
        }
      }
    }

    const rest = defs.map(def => {
      const found = rawByActionName.get(def.action_name);
      if (found) return found;

      // Create a placeholder for missing stats; undefined signals N/A
      const placeholder: SportAction = {
        athlete_id: '',
        action: '' as any,
        action_count: undefined as unknown as number,
        season_id: '',
        // @ts-expect-error not needed for display
        season: undefined,
        definition: def,
      };
      return placeholder;
    });

    // For General, prepend our topRows and remove duplicates (by action_name)
    if (categoryName === 'General') {
      const seen = new Set(topRows.map(s => s.definition?.action_name));
      const dedupedRest = rest.filter(s => !seen.has(s.definition?.action_name));
      return [...topRows, ...dedupedRest];
    }

    return rest;
  }, [stats, categoryName, forceCanonicalOrder, uiDefintions]);

  if (categoryActions.length === 0) {
    return;
  }

  // remove noisy logs

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="font-semibold">{categoryName}</p>
      </div>

      <div className="flex flex-col gap-2">
        {categoryActions.map((s, index) => {
          return <ActionItem sportAction={s} key={index} highlightLeaders={highlightLeaders} />;
        })}
      </div>
    </div>
  );
}

type ItemProps = {
  sportAction: SportAction;
  highlightLeaders?: boolean;
};

function ActionItem({ sportAction, highlightLeaders }: ItemProps) {
  const shouldShow = shouldShowSportAction(sportAction);
  const { definition, action_count } = sportAction;
  const ref = useRef<HTMLDivElement>(null);
  const compareStats = useAtomValue(comparePlayersStatsAtom);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    const mm =
      typeof window !== 'undefined' && 'matchMedia' in window
        ? window.matchMedia('(hover: hover) and (pointer: fine)')
        : null;
    const update = () => setIsHoverable(!!mm?.matches);
    update();
    // Safari compatibility: addListener/removeListener fallback
    // @ts-ignore
    mm?.addEventListener ? mm.addEventListener('change', update) : mm?.addListener?.(update);
    return () => {
      // @ts-ignore
      mm?.removeEventListener
        ? mm.removeEventListener('change', update)
        : mm?.removeListener?.(update);
    };
  }, []);

  // Auto-hide tooltip on any scroll/touchmove to avoid sticky tooltips while scrolling
  useEffect(() => {
    const hide = () => setShowTooltip(false);
    window.addEventListener('scroll', hide, true); // capture to catch nested scroll containers
    window.addEventListener('touchmove', hide, { passive: true } as any);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('touchmove', hide as any);
    };
  }, []);

  const { coordinates, handleMouseEnter } = useHoverCoordinates(
    () => {},
    () => {}
  );

  const toggleTooltip = (e: React.MouseEvent) => {
    setShowTooltip(prev => !prev);
    handleMouseEnter(e);
  };

  useClickOutside(ref, () => {
    setShowTooltip(false);
  });

  // In canonical mode we pass placeholders (athlete_id === '') which should still render
  const isPlaceholder = !sportAction.athlete_id;
  if (!shouldShow && !isPlaceholder) {
    return;
  }

  const processActionCount = () => {
    if (isPlaceholder || action_count === undefined || action_count === null) {
      return 0;
    }

    if (!isNaN(Number(action_count))) {
      return Math.floor(Number(action_count));
    }

    return 0;
  };

  // Determine if this row is a leader among compared players (ties included)
  const isLeader = useMemo(() => {
    if (!highlightLeaders) return false;
    const key = sportAction.definition?.action_name;
    if (!key) return false;
    const values: number[] = compareStats.map(cs => {
      const found = cs.stats?.find(s => s.definition?.action_name === key);
      const v = found?.action_count;
      return typeof v === 'number' ? Number(v) : 0;
    });
    if (values.length === 0) return false;
    const maxVal = Math.max(...values);
    const anyPositive = values.some(v => v > 0);
    // Require a unique max (no ties)
    const maxCount = values.filter(v => v === maxVal).length;
    const myVal = typeof action_count === 'number' ? Number(action_count) : 0;
    return anyPositive && maxCount === 1 && myVal === maxVal;
  }, [highlightLeaders, compareStats, sportAction.definition?.action_name, action_count]);

  return (
    <div>
      <div
        ref={ref}
        onClick={toggleTooltip}
        onMouseEnter={e => {
          if (!isHoverable) return;
          setShowTooltip(true);
          handleMouseEnter(e);
        }}
        onMouseLeave={() => {
          if (!isHoverable) return;
          setShowTooltip(false);
        }}
        className={`${isHoverable ? 'hover:bg-slate-300/40 dark:hover:bg-slate-600' : ''} ${isLeader ? 'font-semibold bg-primary-200 dark:bg-primary-700 px-1 rounded' : ''} cursor-pointer px-0 py-1 rounded-xl flex flex-row items-center justify-between h-12 sm:h-12 leading-tight`}
      >
        <div className="text-left flex-1 pr-2">
          <SecondaryText className="whitespace-normal break-words overflow-hidden">
            {definition?.display_name}
          </SecondaryText>
        </div>

        <div className="text-left flex-none">
          <p>{processActionCount() ?? 0}</p>
        </div>
      </div>

      <TooltipCard
        showTooltip={showTooltip}
        title={definition?.display_name}
        text={definition?.tooltip}
        coordinates={coordinates}
      />
    </div>
  );
}
