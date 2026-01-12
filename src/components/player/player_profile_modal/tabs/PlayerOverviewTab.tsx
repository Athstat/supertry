import { IProAthlete } from '../../../../types/athletes';
import CoachScrummyPlayerReport from '../CoachScrummyPlayerReport';
import { usePlayerData } from '../../../../providers/PlayerDataProvider';
import PlayerTeamFormCard from '../PlayerTeamForm';
import PlayerPercentageSelectedCard from '../PlayerPercentageSelectedCard';
import PlayerPointsHistoryCard from '../points_history/PlayerPointsHistoryCard';
import PlayerTeamCard from '../PlayerTeamCard';
import PlayerNextMatchCard from '../PlayerNextMatchCard';
import PlayerGeneralnfoCard from './PlayerGeneralnfoCard';

type Props = {
  player: IProAthlete;
};

/** Renders a player profile overview tab */
export default function PlayerOverviewTab({ player }: Props) {

  const { currentSeason } = usePlayerData();

  return (
    <div className="flex flex-col gap-6 pb-6">

      <PlayerTeamCard
        player={player}
      />

      <PlayerGeneralnfoCard 
        player={player}
      />

      <CoachScrummyPlayerReport player={player} />

      {/* {currentSeason && (
        <Experimental>
          <PlayerIconsCard player={player} season={currentSeason} />
        </Experimental>
      )} */}

      <PlayerTeamFormCard
        player={player}
      />


      {currentSeason && <PlayerPointsHistoryCard
        player={player}
        season={currentSeason}
      />}

      <PlayerNextMatchCard
        player={player}
      />

      {currentSeason && <PlayerPercentageSelectedCard
        player={player}
        season={currentSeason}
      />}

      {/* 
      <PlayerPriceHistoryCard
        player={player}
      /> */}

    </div>
  );
}
