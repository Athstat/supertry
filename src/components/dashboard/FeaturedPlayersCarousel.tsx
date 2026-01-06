import { Fragment, useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlayerProfileModal from '../player/PlayerProfileModal';
import { IProAthlete } from '../../types/athletes';
import PlayerMugshot from '../shared/PlayerMugshot';
import { useInView } from 'react-intersection-observer';
import { useSupportedSeasons } from '../../hooks/useSupportedSeasons';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { seasonService } from '../../services/seasonsService';
import { PilledSeasonFilterBar } from '../fixtures/MatcheSeasonFilterBar';
import { useDeterministicShuffle } from '../../hooks/useShuffle';

export default function FeaturedPlayersCarousel() {
  const navigate = useNavigate();

  const wantedSeasons = ['695fa717-1448-5080-8f6f-64345a714b10'];

  const {
    seasons,
    currSeason,
    setCurrSeason,
    isLoading: seasonsLoading,
  } = useSupportedSeasons({ wantedSeasonsId: wantedSeasons });
  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const key = currSeason ? swrFetchKeys.getAllSeasonAthletes(currSeason) : undefined;
  const { data: fetchedPlayers, isLoading: playersLoading } = useSWR(key, () =>
    seasonService.getSeasonAthletes(currSeason?.id ?? 'fallback')
  );

  const players = (fetchedPlayers ?? []).filter(p => {
    return (p.power_rank_rating ?? 0) > 40;
  });

  const { shuffledArr: shuffledPlayers } = useDeterministicShuffle(players, {
    shuffleWindow: 1000 * 60 * 5,
  });

  const handlePlayerClick = (player: IProAthlete) => {
    setPlayerModalPlayer(player);
    setShowPlayerModal(true);
  };

  const handleClosePlayerModal = () => {
    setShowPlayerModal(false);
    setPlayerModalPlayer(undefined);
  };

  const handleChangeSeason = (seasonId: string) => {
    setCurrSeason(() => {
      return seasons.find(s => s.id === seasonId);
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-500" />
          Discover Players
        </h3>
        <button
          onClick={() => navigate('/players')}
          className="text-sm text-primary-700 hover:text-primary-600 flex flex-row items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* <PilledSeasonFilterBar
          seasons={seasons}
          value={currSeason?.id}
          onChange={handleChangeSeason}
          hideAllOption
          isLoading={seasonsLoading}
          sortDesc
        /> */}

        {playersLoading ||
          (seasonsLoading && (
            <div className="flex flex-row items-center gap-2">
              <div className="bg-slate-200 dark:bg-slate-700/20 w-24 h-24 rounded-full animate-pulse"></div>
              <div className="bg-slate-200 dark:bg-slate-700/20 w-24 h-24 rounded-full animate-pulse"></div>
              <div className="bg-slate-200 dark:bg-slate-700/20 w-24 h-24 rounded-full animate-pulse"></div>
              <div className="bg-slate-200 dark:bg-slate-700/20 w-24 h-24 rounded-full animate-pulse"></div>
              <div className="bg-slate-200 dark:bg-slate-700/20 w-24 h-24 rounded-full animate-pulse"></div>
            </div>
          ))}

        {/* Player cards carousel - showing featured players only */}
        {!playersLoading && !seasonsLoading && (
          <div className="flex space-x-3 items-center justify-start overflow-x-auto -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
            {shuffledPlayers.map(player => (
              <div key={player.tracking_id} className="pl-1 flex-shrink-0">
                <FeaturePlayerCard player={player} onClick={handlePlayerClick} />
              </div>
            ))}
          </div>
        )}
      </div>

      {playerModalPlayer && (
        <PlayerProfileModal
          onClose={handleClosePlayerModal}
          player={playerModalPlayer}
          isOpen={playerModalPlayer !== undefined && showPlayerModal}
        />
      )}
    </div>
  );
}

type FeaturePlayerProp = {
  player: IProAthlete;
  onClick?: (player: IProAthlete) => void;
};

function FeaturePlayerCard({ player, onClick }: FeaturePlayerProp) {
  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div className="flex flex-col items-center gap-1" onClick={handleClick} ref={ref}>
      {inView && (
        <Fragment>
          <PlayerMugshot
            url={player.image_url}
            className="w-24 h-24"
            playerPr={player.power_rank_rating}
            teamId={player.team_id}
            showPrBackground
          />

          <p className="text-xs truncate">
            {player.athstat_firstname && player.athstat_firstname[0]}. {player.athstat_lastname}
          </p>
        </Fragment>
      )}
    </div>
  );
}

// const [players, setPlayers] = useState<IProAthlete[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete>();
//   const [showPlayerModal, setShowPlayerModal] = useState(false);

//   const handleClosePlayerModal = () => {
//     setPlayerModalPlayer(undefined);
//     setShowPlayerModal(false);
//   };

//   const handlePlayerClick = (player: IProAthlete) => {
//     setPlayerModalPlayer(player);
//     setShowPlayerModal(true);
//   };

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         // Specific athlete IDs for featured players
//         const featuredPlayerIds = [
//           'ec778da5-62ff-532b-ab6f-ac60eff2bca7', // Jordie Barrett
//           '897ab081-62b8-5b42-95ef-c7c3f150759c', // Andre Esterhuizen
//           '57054090-6c0c-57d9-bdb9-0f209f7b61d9', // Vincent Tshituka
//           'dd86410c-80fa-539e-9bd1-af3c52d0b090', // Dan Sheehan
//           'fc883a37-8b03-53f9-a6cb-7f2ee70638e9', // Negri
//         ];

//         // Fetch each player by their specific ID
//         const playerPromises = featuredPlayerIds.map(id => djangoAthleteService.getAthleteById(id));

//         const fetchedPlayers = await Promise.all(playerPromises);

//         // Filter out any undefined results (in case some players aren't found)
//         const validPlayers = fetchedPlayers.filter(player => player !== undefined);

//         setPlayers(validPlayers);
//       } catch (error) {
//         console.error('Error fetching featured players:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPlayers();
//   }, []);
