import SecondaryText from '../../shared/SecondaryText';
import { formatPosition } from '../../../utils/athleteUtils';
import FormIndicator from '../../shared/FormIndicator';

import AvailabilityIcon from '../../players/availability/AvailabilityIcon';
import { usePlayerData } from '../../../providers/PlayerDataProvider';
import MatchPrCard from '../../rankings/MatchPrCard';
import PlayerIconsRow from '../../players/compare/PlayerIconsRow';
import TeamLogo from '../../team/TeamLogo';

export default function PlayerNameAndPosition() {
  // console.log('player: ', player);

  const {currentSeason} = usePlayerData();
  const { player } = usePlayerData();

  if (!player) return;

  return (
    <>
      <div className="flex flex-row items-start mt-2 justify-between ">
        <div className="flex flex-row items-center gap-3">
          {player.team && (
            <TeamLogo
              url={player.team?.image_url}
              teamName={player.team?.athstat_name}
              className="w-10 h-10"
            />
          )}
          <div>
            <div className='flex flex-row items-center gap-2' >
              <p className="font-semibold text-lg dark:text-white">{player.player_name}</p>
              {player.form && <FormIndicator form={player.form} />}
            </div>
            {player.team && (
              <SecondaryText className="text-xs">
                {/* {player.team.athstat_name} */}
                {player.position && player.position_class && (
                  <span>
                    {' '}
                    {formatPosition(player.position)} - {formatPosition(player.position_class)}
                  </span>
                )}
              </SecondaryText>

            )}


            {!player.team && player.position && (
              <SecondaryText>{formatPosition(player.position)}</SecondaryText>
            )}
          </div>

        </div>

        <div className="flex flex-row items-center gap-3">
          
          {player.power_rank_rating && (
            <div className="flex flex-col items-center gap-1">
              <MatchPrCard 
                pr={player.power_rank_rating}
                className='w-9 h-9 text-base font-medium'
              />
              <SecondaryText className='text-xs' >PR</SecondaryText>
            </div>
          )}
            <AvailabilityIcon athlete={player} />
          </div>

      </div>

      
      {currentSeason && <div className="px-4 mt-2 w-full flex flex-row items-center justify-center">
        <PlayerIconsRow
          player={player}
          season={currentSeason}
          size="sm"
        />
      </div>}
    </>
  );
}
