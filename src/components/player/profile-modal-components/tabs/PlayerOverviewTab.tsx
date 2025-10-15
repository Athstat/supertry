import { calculateAge } from '../../../../utils/playerUtils';
import PlayerIconsCard from '../PlayerIconsCard';
import Experimental from '../../../shared/ab_testing/Experimental';
import { format } from 'date-fns';
import PlayerInfoCard from '../PlayerInfoCard';
import PlayerTeamCard from '../PlayerTeamCard';
import { IProAthlete } from '../../../../types/athletes';
import { usePlayerData } from '../../provider/PlayerDataProvider';
import PlayerIconsRow from '../../../players/compare/PlayerIconsRow';
import { Calendar, Ruler as RulerIcon, Dumbbell, Globe } from 'lucide-react';
import { isNumeric } from '../../../../utils/stringUtils';
import CoachScrummyPlayerReport from '../CoachScrummyPlayerReport';
import RelatedPlayersList from '../RelatedPlayersList';
import PlayerSeasonStatsCard from '../../PlayerSeasonStatsCard';
import PowerRankingChartTab from './PRChartTab';
import PlayerHeroCard from '../PlayerHeroCard';

type Props = {
  player: IProAthlete;
};

// Converts centimeters to feet and inches string, e.g., 170 -> 5'7"
function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return `${feet}'${inches}"`;
}

// Converts kilograms to pounds string, rounded to nearest pound
function kgToLbs(kg: number): string {
  const lbs = Math.round(kg * 2.2046226218);
  return `${lbs} lbs`;
}

/** Renders a player profile overview tab */
export default function PlayerOverviewTab({ player }: Props) {
  const { currentSeason } = usePlayerData();
  const nationalityIsValid = player.nationality && !isNumeric(player.nationality ?? '');

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* TIER 1: Hero Zone - Player Card */}
      {/* <PlayerHeroCard player={player} /> */}
      {/* Team & Position Card */}
      {player.team && <PlayerTeamCard player={player} />}
      {/* TIER 2: Performance Chart */}
      <PowerRankingChartTab player={player} />

      {/* TIER 3: Info Cluster */}
      <div className="flex flex-col gap-4">
        {/* Player Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Age & DOB */}
          {player.date_of_birth && (
            <PlayerInfoCard
              variant="glass"
              icon={Calendar}
              value={`${calculateAge(player.date_of_birth)} Years`}
              label={format(player.date_of_birth, 'dd MMM yyyy')}
            />
          )}

          {/* Nationality */}
          {nationalityIsValid && (
            <PlayerInfoCard
              variant="glass"
              icon={Globe}
              value={`${player.nationality}`}
              label={player.birth_place ? `From ${player.birth_place}` : 'National Team'}
            />
          )}

          {/* Height */}
          {player.height && (
            <PlayerInfoCard
              variant="glass"
              icon={RulerIcon}
              value={`${player.height} cm`}
              label={cmToFeetInches(player.height)}
            />
          )}

          {/* Weight */}
          {player.weight && (
            <PlayerInfoCard
              variant="glass"
              icon={Dumbbell}
              value={`${player.weight} kg`}
              label={kgToLbs(player.weight)}
            />
          )}
        </div>
      </div>

      {/* Additional Content */}
      {currentSeason && <PlayerIconsRow player={player} season={currentSeason} size="sm" />}

      <CoachScrummyPlayerReport player={player} />

      {currentSeason && (
        <Experimental>
          <PlayerIconsCard player={player} season={currentSeason} />
        </Experimental>
      )}
    </div>
  );
}
