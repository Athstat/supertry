import { X, Dot } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { IProAthlete } from "../../../types/athletes";
import { getPlayerAggregatedStat } from "../../../types/sports_actions";
import { formatPosition } from "../../../utils/athleteUtils";
import { PlayerGameCard } from "../../player/PlayerGameCard";
import usePlayerStats from "../../player/profile-modal-components/usePlayerStats";
import SecondaryText from "../../shared/SecondaryText";
import PlayerCompareSeasonPicker from "./PlayerCompareSeasonPicker";
import PlayerCompareItemHeader from "./PlayerCompareItemHeader";

type Props = {
  player: IProAthlete;
  onRemove?: (player: IProAthlete) => void;
};

export default function PlayersCompareItem({ player, onRemove }: Props) {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(player);
    }
  };

  const {
    seasonPlayerStats: actions,
    loadingPlayerStats: loadingActions,
    seasons,
    currSeason,
    setCurrSeason,
    starRatings,
    loadingStarRatings
  } = usePlayerStats(player);

  const isLoading = loadingActions || loadingStarRatings;

  const tries = getPlayerAggregatedStat("Tries", actions)?.action_count;

  const assits = getPlayerAggregatedStat("Assists", actions)?.action_count;

  const passes = getPlayerAggregatedStat("Passes", actions)?.action_count;

  const tacklesMade = getPlayerAggregatedStat("TacklesMade", actions)?.action_count;

  const tackleSuccess = getPlayerAggregatedStat("TackleSuccess", actions)?.action_count;

  const turnoversWon = getPlayerAggregatedStat("TurnoversWon", actions)?.action_count;

  const turnovers = getPlayerAggregatedStat("TurnoversConceded", actions)?.action_count;

  const kicksFromHand = getPlayerAggregatedStat("KicksFromHand", actions)?.action_count;

  const kicksFromHandMetres = getPlayerAggregatedStat("KicksFromHandMetres", actions)?.action_count;

  const minutesPlayed = getPlayerAggregatedStat('MinutesPlayed', actions)?.action_count;

  return (
    <div className="flex flex-col gap-2">
      
      <PlayerCompareItemHeader 
        player={player}
        onRemove={handleRemove}
      />

      {seasons && <PlayerCompareSeasonPicker 
        seasons={seasons} 
        setCurrSeason={setCurrSeason}
        currSeason={currSeason}
      />}

      {!isLoading &&  <div className="flex flex-col gap-1" >

        <SecondaryText className="mt-2" >General</SecondaryText>

        <StatLabel
          label="Power Rating"
          value={player.power_rank_rating}

        />

        <StatLabel
          label="Price"
          value={player.price}

        />

        <StatLabel
          label="Minutes Played"
          value={minutesPlayed}

        />

        <SecondaryText className="mt-2" >Attacking</SecondaryText>
        
        <StatLabel
          label="Attacking Rating"
          value={starRatings?.attacking}

        />

        <StatLabel
          label="Scoring"
          value={starRatings?.scoring}

        />

        <StatLabel
          label="Tries"
          value={tries}

        />

        <StatLabel
          label="Assists"
          value={assits}

        />

        <StatLabel
          label="Turnovers"
          value={turnovers}

        />

        <StatLabel
          label="Passes"
          value={passes}

        />

        {/* <StatLabel
          label="Ball Carying"
          value={player.ball_carrying}

        /> */}


        <SecondaryText className="mt-2" >Defense</SecondaryText>

        <StatLabel
          label="Defence"
          value={starRatings?.defence}

        />

        {/* <StatLabel
          label="Strength"
          value={player.strength}

        /> */}

        <StatLabel
          label="Tackles Made"
          value={tacklesMade}

        />

        <StatLabel
          label="Tackles Sucess"
          value={tackleSuccess ? (tackleSuccess * 100) : undefined}

        />

        <StatLabel
          label="Turnovers Won"
          value={turnoversWon}

        />

        <SecondaryText className="mt-2" >Kicking</SecondaryText>

        <StatLabel
          label="Kicking"
          value={starRatings?.kicking}

        />

        <StatLabel
          label="Kicks From Hand"
          value={kicksFromHand}

        />

        <StatLabel
          label="Metres"
          value={kicksFromHandMetres}

        />

        <StatLabel
          label="Points Kicking"
          value={starRatings?.points_kicking}

        />

        <StatLabel
          label="Infield Kicking"
          value={starRatings?.infield_kicking}

        />
      </div>}

      {isLoading && <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 animate-pulse"></div>}
    </div>
  );
}



type StatLabelProp = {
  label?: string;
  value?: number;
  isGreen?: boolean;
};

function StatLabel({ label, value, isGreen }: StatLabelProp) {
  const hasVal = value !== undefined;
  const valueFixed = value?.toFixed(1);

  return (
    <div className="flex flex-row items-center gap-1" >
      <div className="bg-slate-200 flex-[3] py-1 border border-slate-300 dark:border-slate-700 dark:bg-slate-700/40 rounded-md text-sm px-2" >{label}</div>
      <div className={twMerge(
        "bg-slate-300 flex-1 py-1 text-center items-center dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-md text-sm px-1",
        isGreen && "from-primary-500 bg-gradient-to-r to-blue-700 text-white border-blue-600 dark:border-blue-600"
      )} >{hasVal ? valueFixed?.endsWith(".0") ? value : valueFixed : "-"}</div>
    </div>
  )
}
