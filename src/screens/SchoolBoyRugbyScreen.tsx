import PageView from "./PageView";
import SBRFixtures from "../components/sbr/fixtures/SBRFixtures";
import SbrProvider from "../contexts/SBRContext";
import SbrScreenHeader from "../components/sbr/SbrScreenHeader";
import useSWR from "swr";
import { sbrService } from "../services/sbrService";

export default function SchoolBoyRugbyScreen() {

  const { data, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllMatches());

  const currentRound = 2;
  
  const fixtures = (data ?? []).filter(f => {
    return f.round === currentRound
  });

  return (
    <SbrProvider currentRound={currentRound} >
      <PageView className="dark:text-white p-5 flex flex-col gap-3" >
        <SbrScreenHeader />
        { !isLoading && <SBRFixtures fixtures={fixtures} />}
      </PageView>
    </SbrProvider>
  )
}
