import PageView from "./PageView";
import SbrScreenHeader from "../components/sbr/SbrScreenHeader";
import TabView, { TabViewHeaderItem, TabViewPage } from "../components/shared/tabs/TabView";
import SbrPredictionsTab from "../components/sbr/predictions/SbrPredictionsTab";
import SbrFixturesTab from "../components/sbr/fixtures/SbrFixturesTab";
import SbrChatTab from "../components/sbr/SBRChatScreen";
import { ScopeProvider } from "jotai-scope";
import { allSbrWeekFixturesAtom, sbrFixturesPivotDateAtom, sbrFixturesWeekEndAtom, sbrFixturesWeekStartAtom, sbrWeekFeatureGamesAtom, sbrWeekFixturesAtom } from "../state/sbrFixtures.atoms";
import { useAtomValue } from "jotai";
import SbrScreenDataProvider from "../providers/SbrScreenDataProvider";

export default function SbrScreen() {

  const atoms = [sbrFixturesPivotDateAtom, sbrFixturesWeekEndAtom, sbrFixturesWeekStartAtom,
    allSbrWeekFixturesAtom, sbrWeekFixturesAtom, sbrWeekFeatureGamesAtom
  ]

  return (
    <ScopeProvider atoms={atoms} >
      <SbrScreenDataProvider>
        <SbrScreenContent />
      </SbrScreenDataProvider>
    </ScopeProvider>
  )
}


function SbrScreenContent() {

  const weekGames = useAtomValue(sbrWeekFixturesAtom);

  const tabItems: TabViewHeaderItem[] = [
    {
      label: `Fixtures`,
      tabKey: "fixtures",
      className: "flex-1 text-sm lg:text-base"
    },
    // {
    //   label: "Predictions",
    //   tabKey: "predictions",
    //   className: "flex-1"
    // },

    {
      label: "Chat",
      tabKey: "chat",
      className: "flex-1 text-sm lg:text-base"
    }
  ]

  return (
    <PageView className="dark:text-white p-2 md:p-6 flex flex-col gap-4" >

      <SbrScreenHeader />

      <TabView tabHeaderItems={tabItems} >
        {/* <TabViewPage tabKey="current-week" >
            {!isLoading && <SbrCurrentWeekFixtures fixtures={currentRoundFixtures} />}
            </TabViewPage> */}

        <TabViewPage tabKey="predictions" >
          <SbrPredictionsTab />
        </TabViewPage>

        <TabViewPage tabKey="chat" >
          <SbrChatTab />
        </TabViewPage>

        <TabViewPage tabKey="fixtures" >
          <SbrFixturesTab fixtures={weekGames}/>
        </TabViewPage>

      </TabView>
    </PageView>
  )
}