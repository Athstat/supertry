import PageView from "./PageView";
import SBRFixtures from "../components/sbr/fixtures/SBRFixtures";
import SbrProvider from "../contexts/SBRContext";
import SbrScreenHeader from "../components/sbr/SbrScreenHeader";
import useSWR from "swr";
import { sbrService } from "../services/sbrService";
import SbrFixturesHero from "../components/sbr/fixtures/SbrFixturesHero";

export default function SchoolBoyRugbyScreen() {

  const { data, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllMatches());

  const currentRound = 2;

  const currentRoundFixtures = (data ?? []).filter(f => {
    return f.round === currentRound
  });

  return (
    <SbrProvider currentRound={currentRound} >
      <PageView className="dark:text-white p-5 flex flex-col gap-3" >
        <SbrScreenHeader />
        {currentRoundFixtures.length > 0 &&
          <SbrFixturesHero
            fixtures={currentRoundFixtures}
          />
        }

        

        {!isLoading && <SBRFixtures fixtures={currentRoundFixtures} />}
      </PageView>
    </SbrProvider>
  )
}
