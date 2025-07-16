import { Dot, X } from "lucide-react";
import { formatPosition } from "../../../utils/athleteUtils";
import { PlayerGameCard } from "../../player/PlayerGameCard";
import DialogModal from "../../shared/DialogModal";
import { twMerge } from "tailwind-merge";
import { useFetch } from "../../../hooks/useFetch";
import { athleteService } from "../../../services/athletes/athleteService";
import { getPlayerAggregatedStat } from "../../../types/sports_actions";
import SecondaryText from "../../shared/SecondaryText";
import { IProAthlete } from "../../../types/athletes";

type Props = {
  selectedPlayers: IProAthlete[];
  open?: boolean;
  onClose?: () => void;
  onRemove: (player: IProAthlete) => void;
};

export default function PlayerCompareModal({ selectedPlayers, open, onClose, onRemove }: Props) {
  if (open === false || selectedPlayers.length < 2) return;

  const player1 = selectedPlayers[0];
  const player2 = selectedPlayers[1];
  let title = `Comparing ${player1.player_name} and ${player2.player_name}`;

  return (
    <DialogModal

      open={open}
      title={title}
      onClose={onClose}
      hw="lg:w-[45%] max-h-[95%]"
    >

      <div className="grid grid-cols-2 gap-4" >

        <PlayersCompareItem
          player={player1}
          comparingPlayer={player2}
          onRemove={onRemove}
        />

        <PlayersCompareItem player={player2} comparingPlayer={player1} onRemove={onRemove} />
      </div>
    </DialogModal>
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

type ItemProps = {
  player: IProAthlete;
  comparingPlayer?: IProAthlete;
  onRemove?: (player: IProAthlete) => void;
};

function PlayersCompareItem({ player, comparingPlayer, onRemove }: ItemProps) {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(player);
    }
  };

  const { data: stats, isLoading: loadingStats } = useFetch(
    'player-stats',
    player.tracking_id ?? 'fallback',
    athleteService.getRugbyAthleteById
  );
  const { data: actions, isLoading: loadingActions } = useFetch(
    'player-actions',
    player.tracking_id ?? 'fallback',
    athleteService.getAthleteStatsRaw
  );

  const { data: compareActions, isLoading: loadingCompareActions } = useFetch(
    'player-actions',
    comparingPlayer?.tracking_id ?? 'fallback',
    athleteService.getAthleteStatsRaw
  );
  const { data: comparingStats, isLoading: loadingComparingStats } = useFetch(
    'player-stats',
    comparingPlayer?.tracking_id ?? 'fallback',
    athleteService.getRugbyAthleteById
  );

  const isLoading =
    loadingComparingStats || loadingStats || loadingCompareActions || loadingActions;

  const tries = getPlayerAggregatedStat("Tries", actions)?.action_count;
  const compareTries = getPlayerAggregatedStat("Tries", compareActions)?.action_count;

  const assits = getPlayerAggregatedStat("Assists", actions)?.action_count;
  const compareAssits = getPlayerAggregatedStat("Assists", compareActions)?.action_count;

  const passes = getPlayerAggregatedStat("Passes", actions)?.action_count;
  const comparePasses = getPlayerAggregatedStat("Passes", compareActions)?.action_count;

  const tacklesMade = getPlayerAggregatedStat("TacklesMade", actions)?.action_count;
  const compareTacklesMade = getPlayerAggregatedStat("TacklesMade", compareActions)?.action_count;

  const tackleSuccess = getPlayerAggregatedStat("TackleSuccess", actions)?.action_count;
  const compareTackleSuccess = getPlayerAggregatedStat("TackleSuccess", compareActions)?.action_count;

  const turnoversWon = getPlayerAggregatedStat("TurnoversWon", actions)?.action_count;
  const compareTurnoversWon = getPlayerAggregatedStat("TurnoversWon", compareActions)?.action_count;

  const turnovers = getPlayerAggregatedStat("TurnoversConceded", actions)?.action_count;
  const compareTurnovers = getPlayerAggregatedStat("TurnoversConceded", compareActions)?.action_count;


  const kicksFromHand = getPlayerAggregatedStat("KicksFromHand", actions)?.action_count;
  const compareKicksFromHand = getPlayerAggregatedStat("KicksFromHand", compareActions)?.action_count;

  const kicksFromHandMetres = getPlayerAggregatedStat("KicksFromHandMetres", actions)?.action_count;
  const compareKicksFromHandMetres = getPlayerAggregatedStat("KicksFromHandMetres", compareActions)?.action_count;


  const minutesPlayed = getPlayerAggregatedStat('MinutesPlayed', actions)?.action_count;
  const compareMinutesPlayed = getPlayerAggregatedStat(
    'MinutesPlayed',
    compareActions
  )?.action_count;

  if (isLoading)
    return <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 animate-pulse"></div>;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-end">
        <button
          onClick={handleRemove}
          className="flex w-fit text-sm text-slate-700 dark:text-white flex-row gap-1 cursor-pointer items-center dark:bg-slate-700/70 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border dark:border-slate-600 px-2 rounded-xl py-0.5"
        >
          Remove
          <X className="w-4 h-4" />
        </button>
      </div>

      <PlayerGameCard className="h-[200px] lg:h-[300px]" blockGlow player={player} />

      <div>
        <p className="font-bold truncate text-slate-800 dark:text-slate-100">
          {player.player_name}
        </p>

        <div className="flex text-sm flex-row text-slate-700 dark:text-slate-400">
          {player.position && <p className="truncate">{formatPosition(player.position)}</p>}
          <Dot className="" />
          <p className="truncate">{player.team.athstat_name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1" >

        <SecondaryText className="mt-2" >General</SecondaryText>

        <StatLabel
          label="Power Rating"
          value={player.power_rank_rating}
          isGreen={(player.power_rank_rating ?? 0) > (comparingPlayer?.power_rank_rating ?? 0)}
        />

        <StatLabel
          label="Price"
          value={player.price}
          isGreen={(player.price ?? 0) > (comparingPlayer?.price ?? 0)}
        />

        <StatLabel
          label="Minutes Played"
          value={minutesPlayed}
          isGreen={(minutesPlayed ?? 0) > (compareMinutesPlayed ?? 0)}
        />

        <SecondaryText className="mt-2" >Attacking</SecondaryText>
        <StatLabel
          label="Attacking Rating"
          value={stats?.attacking}
          isGreen={(stats?.attacking ?? 0) > (comparingStats?.attacking ?? 0)}
        />

        <StatLabel
          label="Scoring"
          value={stats?.scoring}
          isGreen={(stats?.scoring ?? 0) > (comparingStats?.scoring ?? 0)}
        />

        <StatLabel
          label="Tries"
          value={tries}
          isGreen={(tries ?? 0) > (compareTries ?? 0)}
        />

        <StatLabel
          label="Assits"
          value={assits}
          isGreen={(assits ?? 0) > (compareAssits ?? 0)}
        />

        <StatLabel
          label="Turnovers"
          value={turnovers}
          isGreen={(turnovers ?? 0) > (compareTurnovers ?? 0)}
        />

        <StatLabel
          label="Passes"
          value={passes}
          isGreen={(passes ?? 0) > (comparePasses ?? 0)}
        />

        {/* <StatLabel
          label="Ball Carying"
          value={player.ball_carrying}
          isGreen={(player.ball_carrying ?? 0) > (comparingPlayer?.ball_carrying ?? 0)}
        /> */}


        <SecondaryText className="mt-2" >Defense</SecondaryText>

        <StatLabel
          label="Defence"
          value={stats?.defence}
          isGreen={(stats?.defence ?? 0) > (comparingStats?.defence ?? 0)}
        />

        {/* <StatLabel
          label="Strength"
          value={player.strength}
          isGreen={(player.strength ?? 0) > (comparingPlayer?.strength ?? 0)}
        /> */}

        <StatLabel
          label="Tackles Made"
          value={tacklesMade}
          isGreen={(tacklesMade ?? 0) > (compareTacklesMade ?? 0)}
        />

        <StatLabel
          label="Tackles Sucess"
          value={tackleSuccess ? (tackleSuccess * 100) : undefined}
          isGreen={(tackleSuccess ?? 0) > (compareTackleSuccess ?? 0)}
        />

        <StatLabel
          label="Turnovers Won"
          value={turnoversWon}
          isGreen={(turnoversWon ?? 0) > (compareTurnoversWon ?? 0)}
        />

        <SecondaryText className="mt-2" >Kicking</SecondaryText>

        <StatLabel
          label="Kicking"
          value={stats?.kicking}
          isGreen={(stats?.kicking ?? 0) > (comparingStats?.kicking ?? 0)}
        />

        <StatLabel
          label="Kicks From Hand"
          value={kicksFromHand}
          isGreen={(kicksFromHand ?? 0) > (compareKicksFromHand ?? 0)}
        />

        <StatLabel
          label="Metres"
          value={kicksFromHandMetres}
          isGreen={(kicksFromHandMetres ?? 0) > (compareKicksFromHandMetres ?? 0)}
        />

        <StatLabel
          label="Points Kicking"
          value={stats?.points_kicking}
          isGreen={(stats?.points_kicking ?? 0) > (comparingStats?.points_kicking ?? 0)}
        />

        <StatLabel
          label="Infield Kicking"
          value={stats?.infield_kicking}
          isGreen={(stats?.infield_kicking ?? 0) > (comparingStats?.infield_kicking ?? 0)}
        />
      </div>
    </div>
  );
}
