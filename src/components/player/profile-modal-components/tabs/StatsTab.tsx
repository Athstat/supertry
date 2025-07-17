import React, { useMemo, useState } from "react";
import StarRating from "../StarRating";
import RoundedCard from "../../../shared/RoundedCard";
import { IProSeason } from "../../../../types/season";
import { SportAction } from "../../../../types/sports_actions";
import { twMerge } from "tailwind-merge";
import { groupSportActions } from "../../../../services/athletes/athleteService";

type Props = {
  player: any;
  playerStats: SportAction[]
}

export function StatsTab({ player, playerStats }: Props) {


  const seasons: IProSeason[] = [];
  
  playerStats.forEach((ps) => {
    if (!seasons.some(x => x.id === ps.season.id)) {
      seasons.push(ps.season);
    }
  });

  seasons.sort((a, b) => {
    const aEnd = new Date(a.end_date);
    const bEnd = new Date(b.end_date);

    return bEnd.valueOf() - aEnd.valueOf();
  })

  const [currSeason, setCurrSeason] = useState<IProSeason | undefined>(
    seasons.length > 0 ? seasons[0] : undefined
  );

  const groupedStats = useMemo(() => {
    return groupSportActions(playerStats.filter((p) => {
      return p.season_id === currSeason?.id
    }))
  }, [seasons, playerStats]);

  return (
    <div className="space-y-6">

      {/* Season Row */}
      <div className="w-full flex flex-row items-center gap-2 no-scrollbar overflow-x-auto">

        {seasons.map((season) => {
          return <SeasonPillItem 
            season={season}
            isActive={currSeason?.id === season.id}
            onClick={setCurrSeason}
          />
        })}

      </div>

      {/* Player Ratings */}
      <div className="rounded-xl border bg-gray-50 dark:bg-slate-800/40 dark:border-slate-700" >

        <div className="p-3 border-b flex flex-col justify-center dark:border-slate-700" >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Player Ratings
          </h3>
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-3">
          {player.ball_carrying !== null &&
            player.ball_carrying !== undefined && (
              <RoundedCard className="text-center p-3 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                  <StarRating rating={player.ball_carrying} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Ball Carrying
                </div>
              </RoundedCard>
            )}

          {player.tackling !== null && player.tackling !== undefined && (
            <RoundedCard className="text-center p-3 rounded-lg">
              <div className="flex flex-col items-center justify-center">
                <StarRating rating={player.tackling} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Tackling
              </div>
            </RoundedCard>
          )}

          {player.points_kicking !== null &&
            player.points_kicking !== undefined && (
              <RoundedCard className="text-center p-3 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                  <StarRating rating={player.points_kicking} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Points Kicking
                </div>
              </RoundedCard>
            )}

          {player.infield_kicking !== null &&
            player.infield_kicking !== undefined && (
              <RoundedCard className="text-center p-3 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                  <StarRating rating={player.infield_kicking} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Infield Kicking
                </div>
              </RoundedCard>
            )}

          {player.strength !== null && player.strength !== undefined && (
            <RoundedCard className="text-center p-3 rounded-lg">
              <div className="flex flex-col items-center justify-center">
                <StarRating rating={player.strength} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Strength
              </div>
            </RoundedCard>
          )}

          {player.playmaking !== null && player.playmaking !== undefined && (
            <RoundedCard className="text-center p-3 rounded-lg">
              <div className="flex flex-col items-center justify-center">
                <StarRating rating={player.playmaking} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Playmaking
              </div>
            </RoundedCard>
          )}
        </div>
      </div>

      {/* Detailed statistics sections */}
      {playerStats && <StatsCategories playerStats={groupedStats} />}
    </div>
  );
};

interface StatsCategoriesProps {
  playerStats: any;
}

const StatsCategories: React.FC<StatsCategoriesProps> = ({ playerStats }) => {
  return (
    <>
      {/* General Stats */}
      {playerStats.categorizedStats.general.length > 0 && (
        <StatsCategory
          title="Season Performance"
          stats={playerStats.categorizedStats.general}
        />
      )}

      {/* Attack Stats */}
      {playerStats.categorizedStats.attack.length > 0 && (
        <StatsCategory
          title="Attack"
          stats={playerStats.categorizedStats.attack}
        />
      )}

      {/* Defense Stats */}
      {playerStats.categorizedStats.defense.length > 0 && (
        <StatsCategory
          title="Defense"
          stats={playerStats.categorizedStats.defense}
        />
      )}

      {/* Set Piece Stats */}
      {playerStats.categorizedStats.setpiece.length > 0 && (
        <StatsCategory
          title="Set Piece"
          stats={playerStats.categorizedStats.setpiece}
        />
      )}

      {/* Discipline Stats */}
      {playerStats.categorizedStats.discipline.length > 0 && (
        <StatsCategory
          title="Discipline"
          stats={playerStats.categorizedStats.discipline}
        />
      )}
    </>
  );
};

interface StatsCategoryProps {
  title: string;
  stats: any[];
}

const StatsCategory: React.FC<StatsCategoryProps> = ({ title, stats }) => {
  return (
    <div className="dark:bg-slate-800/40 border bg-slate-50 dark:border-slate-700 rounded-xl" >

      <div className="border-b dark:border-slate-700 p-4" >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
        {stats.map((stat: any, index) => (
          <RoundedCard key={index} className="text-center p-3 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {stat.displayValue ?? "N/A"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </RoundedCard>
        ))}
      </div>
    </div>
  );
};

export default StatsTab;

type SeasonPillProps = {
  season: IProSeason,
  onClick?: (season: IProSeason) => void,
  isActive?: boolean

}

function SeasonPillItem({season, isActive, onClick} : SeasonPillProps) {

  const handleClick = () => {
    if (onClick) {
      onClick(season);
    }
  }

  return (
    <div className={twMerge(
      "flex-1  cursor-pointer text-nowrap bg-slate-200/60 border dark:bg-slate-700/60 ",
      "dark:border-slate-500 rounded-xl px-2 py-1 hover:bg-primary-500 hover:text-white hover:dark:bg-primary-600 hover:dark:border-primary-500",
      isActive && "bg-primary-500 dark:bg-primary-600 text-white border border-primary-400 dark:border-primary-500"
    )} >
      <button onClick={handleClick} className="text-sm" >{season.name}</button>
    </div>
  )
}