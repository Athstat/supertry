import { IProAthlete } from '../../../types/athletes';
import { X, User, Coins, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPosition } from '../../../utils/athleteUtils';
import { PlayerGameCard } from '../../player/PlayerGameCard';
import { useAtom } from 'jotai';
import { openInfoTrackingIdAtom } from '../../../state/comparePlayers.atoms';
import Collapsable from '../../ui/containers/Collapsable';
import SecondaryText from '../../ui/typography/SecondaryText';
import TeamLogo from '../../team/TeamLogo';
import { calculateAge } from '../../../utils/playerUtils';
import { getCountryEmojiFlag } from '../../../utils/svrUtils';
import { twMerge } from 'tailwind-merge';
import { usePlayerCompareActions } from '../../../hooks/usePlayerCompare';

type Props = {
  player: IProAthlete;
};

export default function PlayerCompareItemHeader({ player }: Props) {
  const [openInfoIds, setOpenInfoIds] = useAtom(openInfoTrackingIdAtom);
  const showInfo = openInfoIds.has(player.tracking_id);
  const toggleShowInfo = () =>
    setOpenInfoIds((prev: Set<string>) => {
      const next = new Set<string>(prev);
      if (next.has(player.tracking_id)) next.delete(player.tracking_id);
      else next.add(player.tracking_id);
      return next;
    });

  const { movePlayerLeft, movePlayerRight, removePlayer } = usePlayerCompareActions();

  return (
    <div className="flex flex-col gap-2">
      <div
        className={twMerge(
          'flex flex-row bg-slate-100 dark:bg-slate-700/50 items-center justify-between p-1 rounded-lg',
          'border border-slate-200 dark:border-slate-600'
        )}
      >
        <div className="flex flex-row items-center gap-1">
          <button
            onClick={() => movePlayerLeft(player)}
            className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => movePlayerRight(player)}
            className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button>
          <button
            onClick={() => removePlayer(player)}
            className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
          >
            <X className="w-4 h-4" />
          </button>
        </button>
      </div>

      <div className="mt-5 mb-5">
        <PlayerGameCard className="h-[200px] lg:h-[250px]" blockGlow player={player} />
      </div>

      <Collapsable
        label="Info"
        open={showInfo}
        toggle={toggleShowInfo}
        icon={<User className="w-4 h-4" />}
        overlay
        overlayClassName="top-full"
      >
        <div className="flex flex-col text-sm p-1 divide-y gap-2 divide-slate-100 dark:divide-slate-700">
          <div>
            <SecondaryText className="text-xs">Name</SecondaryText>
            <p className="text-xs lg:text-sm truncate">{player.player_name}</p>
          </div>

          <div>
            <SecondaryText className="text-xs">Team</SecondaryText>
            <div className="flex flex-row gap-1 items-center">
              <TeamLogo
                teamName={player.team.athstat_name}
                url={player.team.image_url}
                className="w-4 h-4"
              />
              <p className="text-xs lg:text-sm truncate">{player.team.athstat_name}</p>
            </div>
          </div>

          <div>
            <SecondaryText className="text-xs">Age</SecondaryText>
            <p className="text-xs lg:text-sm truncate">
              {player.date_of_birth ? calculateAge(player.date_of_birth) : '-'}
            </p>
          </div>

          <div>
            <SecondaryText className="text-xs">Price</SecondaryText>
            <div className="flex flex-row gap-1 items-center">
              <Coins className="w-4 h-4 text-yellow-500" />
              <p className="text-xs lg:text-sm truncate">{player.price}</p>
            </div>
          </div>

          <div>
            <SecondaryText className="text-xs">Nationality</SecondaryText>
            <p className="text-xs lg:text-sm truncate">
              {getCountryEmojiFlag(player.nationality)} {player.nationality}
            </p>
          </div>

          <div>
            <SecondaryText className="text-xs">Position</SecondaryText>
            <p className="text-xs lg:text-sm truncate">
              {player.position ? formatPosition(player.position) : '-'}
            </p>
          </div>

          <div>
            <SecondaryText className="text-xs">Position Class</SecondaryText>
            <p className="text-xs lg:text-sm truncate">
              {player.position_class ? formatPosition(player.position_class) : '-'}
            </p>
          </div>
        </div>
      </Collapsable>
    </div>
  );
}
