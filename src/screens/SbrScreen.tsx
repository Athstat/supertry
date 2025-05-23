import PageView from "./PageView";
import SbrCurrentWeekFixtures from "../components/sbr/fixtures/SBRFixtures";
import SbrProvider from "../contexts/SbrContext";
import SbrScreenHeader from "../components/sbr/SbrScreenHeader";
import useSWR from "swr";
import { sbrService } from "../services/sbrService";
import SbrFixturesHero from "../components/sbr/fixtures/SbrFixturesHero";
import TabView, { TabViewHeaderItem, TabViewPage } from "../components/shared/tabs/TabView";
import SbrPredictionsTab from "../components/sbr/predictions/SbrPredictionsTab";
import SbrAllFixturesTab from "../components/sbr/fixtures/SbrFixturesTab";
import SbrChatTab from "../components/sbr/SBRChatScreen";

export default function SbrScreen() {

  const { data, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllMatches());

  const currentRound = 2;

  const currentRoundFixtures = (data ?? []).filter(f => {
    return f.round === currentRound
  });

  const tabItems: TabViewHeaderItem[] = [
    {
      label: "Predictions",
      tabKey: "predictions",
      className: "flex-1"
    },
    {
      label: `SBR Week ${currentRound}`,
      tabKey: "current-week",
      className: "flex-1"
    },


    {
      label: "Fixtures",
      tabKey: "fixtures",
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
      <PageView className="dark:text-white p-5 flex flex-col gap-3" >
        <SbrScreenHeader />
        {currentRoundFixtures.length > 0 &&
          <SbrFixturesHero
            fixtures={currentRoundFixtures}
          />
        }

        <TabView tabHeaderItems={tabItems} >
          <TabViewPage tabKey="current-week" >
            {!isLoading && <SbrCurrentWeekFixtures fixtures={currentRoundFixtures} />}
          </TabViewPage>

          <TabViewPage tabKey="predictions" >
            {!isLoading && <SbrPredictionsTab />}
          </TabViewPage>

          <TabViewPage tabKey="chat" >
            {!isLoading && <SbrChatTab />}
          </TabViewPage>

          <TabViewPage tabKey="fixtures" >
            {!isLoading && <SbrAllFixturesTab />}
          </TabViewPage>

        </TabView>
      </PageView>
    </SbrProvider>
  )
}
