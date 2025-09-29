import { useEffect } from "react";
import { useGameStory } from "../../../../hooks/dashboard/useGameStory";
import { useGameAthleteStats } from "../../../../hooks/fixtures/useGameAthleteStats";
import { IFixture } from "../../../../types/games";
import { BrickWall } from "lucide-react";
import { LoadingState } from "../../../ui/LoadingState";
import { StatLeaderCard } from "./StatLeaderCard";

interface DefenseLeadersSlideProps {
  game: IFixture;
}

export default function DefenseLeadersSlide({ game }: DefenseLeadersSlideProps) {

  const { isLoading, getStatLeader } = useGameAthleteStats(game);
  const { pauseStory, resumeStory } = useGameStory();

  useEffect(() => {
    if (isLoading) {
      pauseStory();
    } else {
      resumeStory();
    }
  }, [isLoading, pauseStory, resumeStory]);

  const tacklesMadeLeader = getStatLeader('tackles');
  const dominantTackleLeader = getStatLeader('dominant_tackles');
  const turnoversWonLeader = getStatLeader('turnover_won');
  const trySavingTackle = getStatLeader('tackle_try_saver');
  const loseBallCollection = getStatLeader('collection_loose_ball');

  if (isLoading) {
    return (
      <LoadingState />
    )
  }

  return (
    <div className="h-full flex flex-col px-4 bg-gradient-to-b from-gray-900 to-gray-900 overflow-y-auto">

      {/* Header */}
      <div className="text-center py-4 border-b border-gray-700 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BrickWall size={20} className="text-red-400" />
          <h2 className="text-lg font-bold">Defense Leaders</h2>
        </div>
        <p className="text-xs text-gray-400">Top defensive performers</p>
      </div>

      <div className="flex flex-col gap-2" >

        {tacklesMadeLeader && (
          <StatLeaderCard
            isDefense
            leader={tacklesMadeLeader}
          />
        )}

        {dominantTackleLeader && (
          <StatLeaderCard
            isDefense
            leader={dominantTackleLeader}
          />
        )}

        {loseBallCollection && (
          <StatLeaderCard
            isDefense
            leader={loseBallCollection}
          />
        )}

        {turnoversWonLeader && (
          <StatLeaderCard
            isDefense
            leader={turnoversWonLeader}
          />
        )}

        {trySavingTackle && (
          <StatLeaderCard
            isDefense
            leader={trySavingTackle}
          />
        )}

        {dominantTackleLeader && (
          <StatLeaderCard
            isDefense
            leader={dominantTackleLeader}
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
