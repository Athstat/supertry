import PageView from "./PageView";
import SBRFixtures from "../components/sbr/fixtures/SBRFixtures";
import SbrProvider from "../contexts/SBRContext";
import SbrScreenHeader from "../components/sbr/SbrScreenHeader";

export default function SchoolBoyRugbyScreen() {

  const currentRound = 2;

  return (
    <SbrProvider currentRound={currentRound} >
      <PageView className="dark:text-white p-5 flex flex-col gap-3" >
        
        <SbrScreenHeader />

        <div>
          <SBRFixtures />
        </div>
      </PageView>
    </SbrProvider>
  )
}
