import PageView from "./PageView";
import SbrProvider from "../contexts/SbrContext";
import SbrScreenHeader from "../components/sbr/SbrScreenHeader";
import useSWR from "swr";
import { sbrService } from "../services/sbrService";
import SbrFixturesHero from "../components/sbr/fixtures/SbrFixturesHero";
import TabView, { TabViewHeaderItem, TabViewPage } from "../components/shared/tabs/TabView";
import SbrPredictionsTab from "../components/sbr/predictions/SbrPredictionsTab";
import SbrFixturesTab from "../components/sbr/fixtures/SbrFixturesTab";
import SbrChatTab from "../components/sbr/SBRChatScreen";
import { getWeekGames } from "../utils/sbrUtils";
import { LoadingState } from "../components/ui/LoadingState";
import { useQueryState } from "../hooks/useQueryState";
import { dateToStrWithoutTime, safeTransformStringToDate } from "../utils/dateUtils";

export default function SbrScreen() {

  const { data, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllFixtures());
  const today = new Date();
  const [pivotDateStr] = useQueryState('pivot', {init: dateToStrWithoutTime(today)});
  const pivotDate = safeTransformStringToDate(pivotDateStr);

  if (isLoading) return <LoadingState />

  const currentRound = 0;
  const {weekGames, weeekStart, weekEnd} = getWeekGames(data ?? [], pivotDate);

  const currentRoundFixtures = weekGames;

  const tabItems: TabViewHeaderItem[] = [
    {
      label: `Fixtures`,
      tabKey: "fixtures",
      className: "flex-1"
    },
    {
      label: "Predictions",
      tabKey: "predictions",
      className: "flex-1"
    },

    {
      label: "Chat",
      tabKey: "chat",
      className: "flex-1"
    }
  ]

  return (
    <SbrProvider currentRound={currentRound} >
      <PageView className="dark:text-white p-5 flex flex-col gap-4" >
        
        <SbrScreenHeader />
        
        {currentRoundFixtures.length > 0 &&
          <SbrFixturesHero
            fixtures={currentRoundFixtures}
          />
        }

        <TabView tabHeaderItems={tabItems} >
          {/* <TabViewPage tabKey="current-week" >
            {!isLoading && <SbrCurrentWeekFixtures fixtures={currentRoundFixtures} />}
          </TabViewPage> */}

          <TabViewPage tabKey="predictions" >
            {!isLoading && <SbrPredictionsTab />}
          </TabViewPage>

          <TabViewPage tabKey="chat" >
            {!isLoading && <SbrChatTab />}
          </TabViewPage>

          <TabViewPage tabKey="fixtures" >
            {!isLoading && <SbrFixturesTab 
              fixtures={weekGames}
              weekEnd={weekEnd}
              weekStart={weeekStart}

            />}
          </TabViewPage>

        </TabView>
      </PageView>
    </SbrProvider>
  )
}
