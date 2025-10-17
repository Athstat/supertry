import SecondaryText from '../../shared/SecondaryText';
import { formatPosition } from '../../../utils/athleteUtils';
import { usePlayerData } from '../provider/PlayerDataProvider';
import TeamLogo from '../../team/TeamLogo';
import FormIndicator from '../../shared/FormIndicator';
import { usePlayerSquadReport } from '../../../hooks/fantasy/usePlayerSquadReport';
import useSWR from 'swr';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useAuth } from '../../../contexts/AuthContext';
import { swrFetchKeys } from '../../../utils/swrKeys';
import { leagueService } from '../../../services/leagueService';

type Props = {};

export default function PlayerNameAndPosition({}: Props) {
  // console.log('player: ', player);

  // const starRatings = useAtomValue(playerProfileCurrStarRatings);
  // const stats = useAtomValue(playerProfileCurrStatsAtom);

  const { player } = usePlayerData();
  const { currentRound } = useFantasyLeagueGroup();
  const { authUser } = useAuth();

  const key = swrFetchKeys.getUserFantasyLeagueRoundTeam(
    currentRound?.fantasy_league_group_id ?? '',
    currentRound?.id ?? '',
    authUser?.kc_id
  );

  const { data: userTeam } = useSWR(key, () =>
    leagueService.getUserRoundTeam(currentRound?.id ?? '', authUser?.kc_id ?? '')
  );

  // Get player availability
  const { reportText, isAvailable, notAvailable } = usePlayerSquadReport(
    userTeam?.id ?? '',
    player?.tracking_id ?? ''
  );

  if (!player) return;

  return (
    <>
      <div className="flex flex-row items-center justify-between my-4">
        <div className="flex flex-row items-center gap-3">
          {player.team && (
            <TeamLogo
              url={player.team?.image_url}
              teamName={player.team?.athstat_name}
              className="w-10 h-10"
            />
          )}
          <div>
            <p className="font-semibold text-lg dark:text-white">{player.player_name}</p>
            {player.team && (
              <SecondaryText className="text-xs">
                {player.team.athstat_name}
                {player.position && player.position_class && (
                  <span>
                    {' '}
                    | {formatPosition(player.position)} | {formatPosition(player.position_class)}
                  </span>
                )}
              </SecondaryText>
            )}
            {!player.team && player.position && (
              <SecondaryText>{formatPosition(player.position)}</SecondaryText>
            )}
            {/* Availability Status */}
            {userTeam && reportText && (
              <div className="mt-1">
                {isAvailable && (
                  <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    {reportText}
                  </span>
                )}
                {notAvailable && (
                  <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                    {reportText}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-3">
          {player.form && <FormIndicator form={player.form} />}
          {player.power_rank_rating && (
            <div className="flex flex-col items-center gap-0">
              <p className="font-bold text-xl dark:text-white">
                PR: {Math.floor(player.power_rank_rating)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Player Icons
      <div className="px-4 mt-2 w-full flex flex-row items-center justify-center">
        <PlayerIconsRow
          player={player}
          starRatings={starRatings ?? null}
          seasonStats={stats}
          size="sm"
        />
      </div> */}
    </>
  );
}
