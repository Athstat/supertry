import SaveTeamBar from './SaveTeamBar';
import { Coins } from 'lucide-react';
import { useFantasyTeam } from '../../hooks/fantasy/useFantasyTeam';
import { useRoundScoringSummaryV2 } from '../../hooks/fantasy/useRoundScoringSummary';
import { smartRoundUp } from '../../utils/intUtils';
import { isInSecondChanceMode, isSeasonRoundLocked } from '../../utils/leaguesUtils';
import SecondaryText from '../ui/typography/SecondaryText';
import { Activity } from 'react';
import { useLeagueConfig } from '../../hooks/useLeagueConfig';
import { ISeasonRound } from '../../types/fantasy/fantasySeason';
import { LeagueRoundCountdown2 } from '../fantasy_league/LeagueCountdown';
import SecondChanceCard from './second_chance/SecondChanceCard';

type Props = {
  onTeamUpdated?: () => Promise<void>;
};

/** Renders My Team View Header */
export default function MyTeamViewHeader({ onTeamUpdated }: Props) {

  const { leagueConfig } = useLeagueConfig();
  const { totalSpent, selectedCount, leagueRound, isReadOnly } = useFantasyTeam();

  const handleTeamUpdated = async () => {
    if (onTeamUpdated) {
      await onTeamUpdated();
    }
  }

  const isSecondChance = leagueRound && isInSecondChanceMode(leagueRound);


  return (
    <div className="px-4 flex flex-col gap-3" >

      <div className="flex flex-row  items-center justify-between" >

        <div className="flex flex-col w-full  flex-1 items-start justify-start">
          <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Selected
          </div>
          <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">
            {selectedCount}/6
          </div>
        </div>


        <div className="flex flex-row items-center justify-center text-center gap-1">

          {leagueRound && <TeamPointsCard
            leagueRound={leagueRound}
          />}

        </div>

        <div className="flex-1 w-full flex flex-col text-right justify-center">
          <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Total Spent
          </div>
          {leagueConfig && (
            <div className="text-[10px] flex flex-row items-center  justify-end  gap-1 font-semibold text-gray-900 dark:text-gray-100">
              <p>{totalSpent}/{leagueConfig?.team_budget}</p>
              <Coins className='text-yellow-500 w-3 h-3' />
            </div>
          )}
        </div>
      </div>

      {leagueRound && <SaveTeamBar
        leagueRound={leagueRound}
        onTeamUpdated={handleTeamUpdated}
      />}

      {!isReadOnly && isSecondChance && (
        <SecondChanceCard 
        />
      )}
    </div>
  );
}

type TeamPointsProps = {
  leagueRound: ISeasonRound;
};

function TeamPointsCard({ leagueRound }: TeamPointsProps) {

  const { isReadOnly, team } = useFantasyTeam();
  const isLocked = isSeasonRoundLocked(leagueRound);
  const { highestPointsScored, averagePointsScored, isLoading } =
    useRoundScoringSummaryV2(leagueRound);

  const showScore = !isLoading && isLocked

  // Uses team?.overall_score here instead of userscore from the useRoundScoringSummary
  // because that hook returns the auth user's score not the score of the teams manager

  return (
    <div className="flex flex-col min-h-[30px] max-h-[30px]" >

      <Activity mode={showScore ? "visible" : "hidden"} >
        <div className="flex flex-row items-center justify-center gap-3" >

          <div className="flex flex-col items-center justify-center" >
            <p className="font-black text-md" >{smartRoundUp(averagePointsScored ?? 0)}</p>
            <SecondaryText className="text-[10px]" >Average</SecondaryText>
          </div>

          <div className="flex flex-col items-center justify-center" >
            <p className="font-black text-md" >{smartRoundUp(team?.overall_score ?? 0)}</p>
            <SecondaryText className="text-[10px]" >Score</SecondaryText>
          </div>

          <div className="flex flex-col items-center justify-center" >
            <p className="font-black text-md" >{smartRoundUp(highestPointsScored ?? 0)}</p>
            <SecondaryText className="text-[10px]" >Highest</SecondaryText>
          </div>
        </div>
      </Activity>

      <Activity mode={!isLocked && !isReadOnly ? "visible" : "hidden"} >
        <div className='flex flex-row w-full items-center justify-center' >
          <LeagueRoundCountdown2
              leagueRound={leagueRound}
              className='flex-col'
              leagueTitleClassName='font-normal text-xs'
              key={leagueRound.round_number}
            />
        </div>
      </Activity>

    </div>
  )
}
