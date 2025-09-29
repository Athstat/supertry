import { useEffect } from "react";
import { useGameAthleteStats } from "../../../../hooks/fixtures/useGameAthleteStats";
import { IFixture } from "../../../../types/games";
import { useGameStory } from "../../../../hooks/dashboard/useGameStory";
import { LoadingState } from "../../../ui/LoadingState";
import { StatLeaderCard } from "./StatLeaderCard";

interface AttackLeadersSlideProps {
  game: IFixture;
}

export default function AttackLeadersSlide({ game }: AttackLeadersSlideProps) {

  const { isLoading, getStatLeader } = useGameAthleteStats(game);
  const { pauseStory, resumeStory } = useGameStory();

  useEffect(() => {
    if (isLoading) {
      pauseStory();
    } else {
      resumeStory();
    }
  }, [isLoading, pauseStory, resumeStory]);

  const triesLeader = getStatLeader('tries');
  const pointsLeader = getStatLeader('points');
  const postContactLeader = getStatLeader('post_contact_metres');
  const dominantCarriesLeader = getStatLeader('clean_breaks');
  const passesLeader = getStatLeader('passes');
  const assitsLeader = getStatLeader('try_assist');

  if (isLoading) {
    return (
      <LoadingState />
    )
  }


  return (
    <div className="h-full flex flex-col px-4 bg-gradient-to-b from-gray-900 to-gray-900 overflow-y-auto">

      {/* Header */}
      <div className="text-center py-4  border-gray-700">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-lg font-bold">Attack Leaders</h2>
        </div>
      </div>

      <div className="flex flex-col gap-2" >

        {triesLeader && (
          <StatLeaderCard
            leader={triesLeader}
          />
        )}

        {pointsLeader && (
          <StatLeaderCard
            leader={pointsLeader}
          />
        )}

        {passesLeader && (
          <StatLeaderCard
            leader={passesLeader}
          />
        )}

        {assitsLeader && (
          <StatLeaderCard
            leader={assitsLeader}
          />
        )}

        {dominantCarriesLeader && (
          <StatLeaderCard
            leader={dominantCarriesLeader}
          />
        )}

        {postContactLeader && (
          <StatLeaderCard
            leader={postContactLeader}
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

