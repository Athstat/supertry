import { twMerge } from "tailwind-merge";
import ScrummyLogoHorizontal from "../../components/branding/scrummy_logo_horizontal";
import PageView from "../../components/ui/containers/PageView";
import { AppColours, LeagueInviteParamsDef } from "../../types/constants";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { Trophy } from "lucide-react";
import { LoadingIndicator } from "../../components/ui/LoadingIndicator";
import FantasyLeagueGroupDataProvider from "../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider";
import { useParams } from "react-router-dom";



export default function InviteStepsScreen() {

  const {li: leagueId, usri: inviterId, jc: joinCode} = useParams<LeagueInviteParamsDef>();
  

  return (
    <PageView className="py-0 p-0" >
      <header className={twMerge(
        "sticky top-0 border-b dark:border-slate-700 flex flex-row items-center justify-between z-50 bg-white/80 backdrop-blur-sm shadow-none mb-0 pb-0",
        AppColours.BACKGROUND
      )}>
        <div className="container mx-auto px-1 h-16 overflow-hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex flex-row overflow-hidden items-start justify-start cursor-pointer"
              tabIndex={0}
              aria-label="Navigate to home"
            >
              <ScrummyLogoHorizontal className="" />
            </div>
          </div>
        </div>

        <div className="pr-2" >
          <PrimaryButton className="text-nowrap" >Download App</PrimaryButton>
        </div>
      </header>

      <FantasyLeagueGroupDataProvider
        leagueId={leagueId}
        loadingFallback={<LoadingIndicator />}
      >
        <InviteView />
      </FantasyLeagueGroupDataProvider>

    </PageView>
  )
}

function InviteView() {
  return (
    <section className="flex flex-col items-center justify-center p-4" >
      <div className="flex w-fit flex-row cursor-pointer hover:px-4 transition-all ease-in items-center gap-2 bg-blue-600 dark:bg-blue-600 text-white dark:text-white px-3 py-1 rounded-full" >
        <Trophy className="w-4 h-4" />
        <p className="font-semibold" >League Name</p>
      </div>
    </section>
  )
}

function LoadingSkeleton() {
  return (
    <div>
      <LoadingIndicator />
    </div>
  )
}