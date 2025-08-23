import { useMemo } from "react";
import { IProAthlete } from "../../types/athletes";
import { IProSeason } from "../../types/season";
import { SportAction } from "../../types/sports_actions";
import NoContentCard from "../shared/NoContentMessage";
import SportActionCategoryList from "./SportActionCategoryList";
import { useSportActions } from "./SportActionsDefinitionsProvider";

type Props = {
  player: IProAthlete;
  season: IProSeason;
  stats: SportAction[];
  forceCanonicalOrder?: boolean;
  isLoading?: boolean;
  highlightRowLeaders?: boolean;
};

/**
 * Shared tray used to render full per-season player statistics grouped by category.
 * Extracted from PlayerSeasonStatsCard to ensure identical rendering in other contexts
 * such as the Compare modal.
 */
export default function PlayerSeasonStatsTray({ player, season, stats, forceCanonicalOrder, isLoading, highlightRowLeaders }: Props) {
  const { categories: allCategories } = useSportActions();
  const categories: string[] = useMemo(() => {
    const hidden = new Set(["Set Piece", "Tactical Kicking"]);
    const reorderWithGeneralFirst = (arr: string[]) => {
      const filtered = arr.filter(c => !hidden.has(c));
      if (filtered.includes("General")) {
        return ["General", ...filtered.filter(c => c !== "General")];
      }
      return filtered;
    };

    if (forceCanonicalOrder) {
      return reorderWithGeneralFirst(allCategories);
    }

    const seen: Set<string> = new Set();
    stats.forEach(s => {
      const { definition } = s;
      if (definition?.category && !seen.has(definition.category)) {
        seen.add(definition.category);
      }
    });
    const sorted = [...seen].sort((a, b) => a.localeCompare(b));
    return reorderWithGeneralFirst(sorted);
  }, [stats, forceCanonicalOrder, allCategories]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="w-full h-24 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-full h-24 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <NoContentCard
        messageClassName="w-full"
        message={`${player.player_name}'s stats for ${season.name} are not available`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {categories.map(category => (
          <SportActionCategoryList
            key={category}
            categoryName={category}
            stats={stats}
            forceCanonicalOrder={forceCanonicalOrder}
            highlightLeaders={highlightRowLeaders}
          />
        ))}
      </div>
    </div>
  );
}
