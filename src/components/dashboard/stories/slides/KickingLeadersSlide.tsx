import { useEffect } from "react";
import { useGameStory } from "../../../../hooks/dashboard/useGameStory";
import { useGameAthleteStats } from "../../../../hooks/fixtures/useGameAthleteStats";
import { IFixture } from "../../../../types/games";
import { Target } from "lucide-react";
import { LoadingState } from "../../../ui/LoadingState";
import { StatLeaderCard } from "./StatLeaderCard";

interface KickingLeadersSlideProps {
  game: IFixture;
}


export default function KickingLeadersSlide({ game }: KickingLeadersSlideProps) {
  const { isLoading, getStatLeader } = useGameAthleteStats(game);
  const { pauseStory, resumeStory } = useGameStory();

  useEffect(() => {
    if (isLoading) {
      pauseStory();
    } else {
      resumeStory();
    }
  }, [isLoading, pauseStory, resumeStory]);

  const tryKicks = getStatLeader('conversion_goals');
  const penaltyGoalsScored = getStatLeader('penalty_goals');
  const dropGoalsLeaders = getStatLeader('drop_goals_converted');
  const kicksMadeLeader = getStatLeader('kicks');

  if (isLoading) {
    return (
      <LoadingState />
    )
  }

  return (
    <div className="h-full flex flex-col px-4 bg-gradient-to-b from-gray-900 to-gray-900 overflow-y-auto">

      {/* Header */}
      <div className="text-center py-4 ">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target size={20} className="text-purple-400" />
          <h2 className="text-lg font-bold">Kicking Leaders</h2>
        </div>
      </div>

      <div className="flex flex-col gap-2" >

        {tryKicks && (
          <StatLeaderCard
            isKicking
            leader={tryKicks}
          />
        )}

        {penaltyGoalsScored && (
          <StatLeaderCard
            isKicking
            leader={penaltyGoalsScored}
          />
        )}

        {dropGoalsLeaders && (
          <StatLeaderCard
            isKicking
            leader={dropGoalsLeaders}
          />
        )}

        {kicksMadeLeader && (
          <StatLeaderCard
            isKicking
            leader={kicksMadeLeader}
          />
        )}
      </div>

      {/* Footer note */}
      <div className="text-center py-4 mt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Based on current match performance
        </p>
      </div>
    </div>
  );
}
