import { ChevronRight } from "lucide-react";
import { FixtureListViewMode, IFixture } from "../../../types/games";
import NoContentCard from "../../ui/typography/NoContentMessage";
import GroupedFixturesList from "../GroupedFixturesList";
import { TabSwitchContainer, TabSwitchOption } from "../../ui/buttons/TabSwitchOption";
import { Activity, useCallback, useState } from "react";
import ProPickemLeaderboard from "../../pickem/ProPickemLeaderboard";
import { twMerge } from "tailwind-merge";

type Props = {
  searchQuery: string;
  viewMode: FixtureListViewMode;
  onViewModeChange: (mode: FixtureListViewMode) => void;
  onMoveNextWeek: () => void,
  displayFixtures: IFixture[],
  hasAnyFixtures?: boolean,
  className?: string
};

type LocalViewMode = "predict" | "leaderboard";

/** Renders a Pro Pick'em view, with fixtures and leaderboard options */
export default function FixturesProPickemView({ displayFixtures, hasAnyFixtures, onMoveNextWeek, className }: Props) {

  const [localView, setLocalView] = useState<LocalViewMode>("predict");

  const handleJumpToNextFixtures = () => {
    onMoveNextWeek();
  };

  const handleChangeLocalView = useCallback((val?: string) => {
    if (val) {
      setLocalView(val as LocalViewMode);
    }
  }, [setLocalView]);

  return (
    <div className={twMerge(
      "flex flex-col gap-4",
      className
    )} >

      {displayFixtures.length === 0 && hasAnyFixtures && (
        <div className="flex flex-col gap-3 items-center">
          <NoContentCard message="No fixtures found for this week" />
          {(
            <button
              onClick={handleJumpToNextFixtures}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <span>View Next Fixtures</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <TabSwitchContainer >
        <TabSwitchOption
          label="Predict"
          value="predict"
          current={localView}
          onSelect={handleChangeLocalView}
          className="text-sm font-semibold"
        />

        <TabSwitchOption
          label="Leaderboard"
          value="leaderboard"
          current={localView}
          onSelect={handleChangeLocalView}
          className="text-sm font-semibold"
        />
      </TabSwitchContainer>

      <Activity mode={localView === "predict" ? "visible" : "hidden"} >
        <GroupedFixturesList
          fixtures={displayFixtures}
          viewMode={"pickem"}
        />
      </Activity>

      <Activity mode={localView === "leaderboard" ? "visible" : "hidden"} >
        <ProPickemLeaderboard />
      </Activity>
    </div>
  )
}


// /* Component responsible for switiching the view to leaderboard or  */
// function Header() {

// }