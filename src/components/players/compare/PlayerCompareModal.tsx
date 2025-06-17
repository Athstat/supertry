import { Dot, X } from 'lucide-react';
import { RugbyPlayer } from '../../../types/rugbyPlayer';
import { formatPosition } from '../../../utils/athleteUtils';
import { PlayerGameCard } from '../../player/PlayerGameCard';
import DialogModal from '../../shared/DialogModal';
import { twMerge } from 'tailwind-merge';
import { useFetch } from '../../../hooks/useFetch';
import { athleteService } from '../../../services/athleteService';
import { getPlayerAggregatedStat } from '../../../types/sports_actions';

type Props = {
  selectedPlayers: RugbyPlayer[];
  open?: boolean;
  onClose?: () => void;
  onRemove: (player: RugbyPlayer) => void;
};

export default function PlayerCompareModal({ selectedPlayers, open, onClose, onRemove }: Props) {
  if (open === false || selectedPlayers.length < 2) return;

  const player1 = selectedPlayers[0];
  const player2 = selectedPlayers[1];
  let title = `Comparing ${player1.player_name} and ${player2.player_name}`;

  return (
    <DialogModal open={open} title={title} onClose={onClose} hw="lg:w-[500px]">
      <div className="grid grid-cols-2 gap-4">
        <PlayersCompareItem player={player1} comparingPlayer={player2} onRemove={onRemove} />

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
    <div className="flex flex-row items-center gap-1">
      <div className="bg-slate-200 flex-[3] py-1 dark:bg-slate-700 rounded-md text-sm px-2 text-slate-700 dark:text-slate-200">
        {label}
      </div>
      <div
        className={twMerge(
          'bg-slate-300 flex-1 py-1 text-center items-center dark:bg-slate-700/70 rounded-md text-sm px-1 text-slate-800 dark:text-slate-100',
          isGreen && 'from-primary-500 bg-gradient-to-r to-blue-700 text-white'
        )}
      >
        {hasVal ? (valueFixed?.endsWith('.0') ? value : valueFixed) : '-'}
      </div>
    </div>
  );
}

type ItemProps = {
  player: RugbyPlayer;
  comparingPlayer?: RugbyPlayer;
  onRemove?: (player: RugbyPlayer) => void;
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

  const tries = getPlayerAggregatedStat('Tries', actions)?.action_count;
  const compareTries = getPlayerAggregatedStat('Tries', compareActions)?.action_count;

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
          <p className="truncate">{player.team_name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="mt-2 text-slate-700 dark:text-slate-200">General</p>

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

        <p className="mt-2 text-slate-700 dark:text-slate-200">Attacking</p>
        <StatLabel
          label="Attacking"
          value={stats?.attacking}
          isGreen={(stats?.attacking ?? 0) > (comparingStats?.attacking ?? 0)}
        />

        <StatLabel
          label="Scoring"
          value={stats?.scoring}
          isGreen={(stats?.scoring ?? 0) > (comparingStats?.scoring ?? 0)}
        />

        <StatLabel label="Tries" value={tries} isGreen={(tries ?? 0) > (compareTries ?? 0)} />

        <StatLabel
          label="Ball Carying"
          value={player.ball_carrying}
          isGreen={(player.ball_carrying ?? 0) > (comparingPlayer?.ball_carrying ?? 0)}
        />

        <p className="mt-2 text-slate-700 dark:text-slate-200">Defense</p>

        <StatLabel
          label="Defence"
          value={stats?.defence}
          isGreen={(stats?.defence ?? 0) > (comparingStats?.defence ?? 0)}
        />

        <StatLabel
          label="Strength"
          value={player.strength}
          isGreen={(player.strength ?? 0) > (comparingPlayer?.strength ?? 0)}
        />

        <StatLabel
          label="Tackling"
          value={player.tackling}
          isGreen={(player.tackling ?? 0) > (comparingPlayer?.tackling ?? 0)}
        />

        <p className="mt-2 text-slate-700 dark:text-slate-200">Kicking</p>

        <StatLabel
          label="Kicking"
          value={stats?.kicking}
          isGreen={(stats?.kicking ?? 0) > (comparingStats?.kicking ?? 0)}
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
