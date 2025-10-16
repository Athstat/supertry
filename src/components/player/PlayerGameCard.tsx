import { getPositionFrameBackground, getTeamJerseyImage } from '../../utils/athleteUtils';
import { IProAthlete } from '../../types/athletes';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { twMerge } from 'tailwind-merge';
import TeamLogo from '../team/TeamLogo';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TeamJersey from './TeamJersey';
import darkModeLogo from '../branding/assets/logo_dark_mode.svg';

//import { CircleDollarSign } from 'lucide-react';
import { ScrummyDarkModeLogo } from '../branding/scrummy_logo';
// import PlayerIconsRow from '../players/compare/PlayerIconsRow';
//import { getPlayerIcons, PlayerIcon } from '../../utils/playerIcons';
import PlayerIconComponent from '../players/compare/PlayerIconComponent';
import Experimental from '../shared/ab_testing/Experimental';
import { usePlayerSquadReport } from '../../hooks/fantasy/usePlayerSquadReport';
import useSWR from 'swr';
import { leagueService } from '../../services/leagueService';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { useAuth } from '../../contexts/AuthContext';
import { swrFetchKeys } from '../../utils/swrKeys';
import AvailabilityIcon from '../players/availability/AvailabilityIcon';
// import { swrFetchKeys } from '../../utils/swrKeys';
// import useSWR from 'swr';
// import { djangoAthleteService } from '../../services/athletes/djangoAthletesService';
// import { usePlayerData } from './provider/PlayerDataProvider';

type Props = {
  player: IProAthlete | IFantasyTeamAthlete;
  name?: string;
  onClick?: () => void;
  className?: string;
  blockGlow?: boolean;
  hideTeamLogo?: boolean;
  hidePrice?: boolean;
  // Optional style overrides for specific screens (e.g., PlayersScreen)
  priceClassName?: string;
  teamLogoClassName?: string;
  detailsClassName?: string;
  // Optional override for background frame image styling (to avoid cropping in specific contexts)
  frameClassName?: string;
};

/** Renders a athlete game card that is either gold, silver or
 * bronze depending on the power ranking of the player
 *
 * does not rely on team context */

export function PlayerGameCard({
  player,
  className,
  onClick,
  hidePrice = false,
  frameClassName,
}: Props) {
  const frameSrc = getPositionFrameBackground(player.position_class ?? '');
  const [playerImageErr, setPlayerImageErr] = useState<boolean>(false);

  const [isFrameLoaded, setFrameLoaded] = useState(false);

  const location = useLocation();
  const isPlayersScreen = location.pathname.startsWith('/players');

  //console.log('Player: ', player);

  const getBorderColor = () => {
    switch (frameSrc) {
      case '/player_card_backgrounds/front-row-bg.png':
        return 'hsl(0, 100%, 27%)';
      case '/player_card_backgrounds/half-back-bg.png':
        return 'hsl(39, 100%, 35%)';
      case '/player_card_backgrounds/back-bg.png':
        return 'hsl(148, 100%, 27%)';
      case '/player_card_backgrounds/second-row-bg.png':
        return 'hsl(210, 100%, 30%)';
      case '/player_card_backgrounds/back-row-bg.png':
        return 'hsl(181, 94%, 19%)';
      default:
        return '';
    }
  };

  // const { sortedSeasons, currentSeason } = usePlayerData();
  // const hasSeason = !!currentSeason;

  //console.log('sortedSeasons: ', sortedSeasons);

  // Pre-declare fetchers for SWR; safe because key will be null when season not ready
  // const fetchSeasonStats = () =>
  //   djangoAthleteService.getAthleteSeasonStats(player.tracking_id, currentSeason!.id);
  // const fetchSeasonStars = () =>
  //   djangoAthleteService.getAthleteSeasonStarRatings(player.tracking_id, currentSeason!.id);

  // const statsKey = hasSeason
  //   ? swrFetchKeys.getAthleteSeasonStats(player.tracking_id, currentSeason!.id)
  //   : null;
  // const { data: actions, isLoading: loadingStats } = useSWR(statsKey, fetchSeasonStats);

  // const starsKey = hasSeason
  //   ? swrFetchKeys.getAthleteSeasonStars(player.tracking_id, currentSeason!.id)
  //   : null;
  // const { data: starRatings, isLoading: loadingStars } = useSWR(starsKey, fetchSeasonStars);

  // const isLoading = !hasSeason || loadingStars || loadingStats;

  // const playerIcons = hasSeason
  //   ? getPlayerIcons(player as IProAthlete, starRatings ?? null, actions ?? [])
  //   : [];

  const icons = ['Diamond In the Ruff', 'Scrum Master', 'Rookie'];

  // Function to get a random number of icons (1, 2, or 3)
  const getRandomIconCount = () => Math.floor(Math.random() * 3) + 1;

  // Function to get an array of unique random icons
  const getRandomIcons = (count: number) => {
    const shuffled = [...icons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const playerIcons = getRandomIcons(getRandomIconCount());

  let imageUrl = useMemo(() => {
    if (player.athlete) {
      return player.athlete.team?.athstat_id
        ? getTeamJerseyImage(player.athlete.team?.athstat_id)
        : undefined;
    } else {
      return player.team?.athstat_id ? getTeamJerseyImage(player.team?.athstat_id) : undefined;
    }
  }, [player]);

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

  const playerId = player.athlete_id || player.athlete?.tracking_id || player.tracking_id;

  const { notAvailable } = !isPlayersScreen
    ? usePlayerSquadReport(userTeam?.id, playerId)
    : { notAvailable: false };

  return (
    <div
      className={twMerge(
        'min-w-[160px] max-w-[160px] relative cursor-pointer max-h-[250px] ',
        'lg:min-w-[200px] lg:max-w-[200px]',
        'flex items-center justify-center relative text-white dark:text-white',
        className
      )}
      onClick={onClick}
    >

      <div className='absolute top-0 text-black right-0' >
        <AvailabilityIcon 
          athlete={player}
        />
      </div>

      {/* Card Container */}
      <div className="relative isolate z-0">
        {/* Card */}
        <img
          src={frameSrc}
          className={twMerge(
            'object-contain min-w-[170px] max-w-[170px] ',
            'lg:min-w-[200px] lg:max-w-[200px]',
            frameClassName
          )}
          onLoad={() => setFrameLoaded(true)}
        />

        {/* Icons rail - overlay; doesn't affect layout */}
        {/* <div
          className="absolute top-16 left-[5px] lg:left-[-14px] flex flex-col items-center gap-2 z-10 pointer-events-none"
          aria-hidden="true"
        >
          <Experimental>
            {playerIcons.map((iconName, index) => (
              <div key={`${iconName}-${index}`} className="pointer-events-auto drop-shadow">
                <PlayerIconComponent iconName={iconName} size={'xs'} />
              </div>
            ))}
          </Experimental>
        </div> */}

        {/* Player Image - Positioned absolutely and centered on the card */}
        {isFrameLoaded && (
          <div className="z-30 overflow-clip absolute pt-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={twMerge(
                ' w-8 flex flex-row items-center justify-center h-10 absolute top-3 right-0',
                'lg:w-10'
              )}
            >
              {player.athlete
                ? player.athlete.team?.image_url && (
                    <TeamLogo
                      url={player.athlete.team.image_url}
                      className="w-6 h-6 lg:w-8 lg:h-8"
                    />
                  )
                : player.team?.image_url && (
                    <TeamLogo url={player.team.image_url} className="w-6 h-6 lg:w-8 lg:h-8" />
                  )}
            </div>

            {/* <PlayerIconsRow player={player as IProAthlete} size="sm" season={season} /> */}

            <div
              className={twMerge(
                'min-h-[100px] max-h-[100px] max-w-[100px]  relative aspect-[3/4] overflow-hidden min-w-[140px] flex flex-col items-center justify-center ',
                'lg:min-h-[140px] lg:max-h-[140px] lg:max-w-[140px] relative'
              )}
            >
              {/* {!playerImageErr && (
                <img
                  src={player.image_url}
                  className={twMerge(
                    'min-h-[80px] max-h-[80px] min-w-[80px] max-w-[80px]  object-cover object-top scale-150',
                    'lg:min-h-[120px] lg:max-h-[120px] lg:min-w-[120px] lg:max-w-[120px]',
                    '[mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                    '[mask - repeat:no-repeat] [mask-size:100%_100%]',
                    '[-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                    '[-webkit-mask-repeat:no-repeat]',
                    '[-webkit-mask-size:100%_100%'
                  )}
                  onError={() => setPlayerImageErr(true)}
                />
              )} */}
              {/* {playerImageErr && <TeamJersey teamId={player.team?.athstat_id} />} */}

              <img
                src={imageUrl}
                className={twMerge(
                  'min-h-[80px] max-h-[80px] min-w-[80px] max-w-[80px]  object-cover object-top translate-y-[5%]',
                  'lg:min-h-[120px] lg:max-h-[120px] lg:min-w-[120px] lg:max-w-[120px]',
                  '[mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                  '[mask - repeat:no-repeat] [mask-size:100%_100%]',
                  '[-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                  '[-webkit-mask-repeat:no-repeat]',
                  '[-webkit-mask-size:100%_100%',
                  notAvailable && !isPlayersScreen && 'grayscale opacity-50'
                )}
                onError={() => setPlayerImageErr(true)}
              />
              {notAvailable && isPlayersScreen && (
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                  <span className="bg-black/70 text-white text-xs lg:text-sm font-semibold px-2 py-1 rounded">
                    Not Playing ⚠️
                  </span>
                </div>
              )}

              <div className="flex flex-col absolute bottom-0 items-center p-1 justify-center">
                <p className="text-[15px] lg:text-xs truncate max-w-[100px] lg:max-w-[130px]">
                  {player.player_name}
                </p>
              </div>
            </div>

            <div className="w-full flex flex-row items-center justify-center">
              <div
                className="w-full flex flex-row items-center justify-center "
                style={{
                  width: '100%',
                  border: '1px solid ' + getBorderColor(),
                  borderRadius: '2px',
                }}
              >
                <div
                  className="flex flex-col items-center w-full"
                  style={{ borderRight: '1px solid ' + getBorderColor() }}
                >
                  <p className="text-xs font-bold">{player.price}</p>
                  <p className="text-xs">Value</p>
                </div>
                <div className="flex flex-col items-center w-full">
                  <p className="text-xs font-bold">{player.power_rank_rating}</p>
                  <p className="text-xs">PR</p>
                </div>
              </div>
            </div>

            <div className="flex text-[10px] -mt-1 lg:text-xs flex-row items-center justify-center gap-2">
              <p className="font-bold">{player.position}</p>
              <img className="w-8 h-8" src={darkModeLogo} alt="scrummy_logo" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
