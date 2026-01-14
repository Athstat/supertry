import { twMerge } from "tailwind-merge";
import ScrummyLogoHorizontal from "../../components/branding/scrummy_logo_horizontal";
import PageView from "../../components/ui/containers/PageView";
import { AppColours, leagueInviteQueryParams } from "../../types/constants";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { Trophy, Users } from "lucide-react";
import { LoadingIndicator } from "../../components/ui/LoadingIndicator";
import FantasyLeagueGroupDataProvider from "../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider";
import { Link, useSearchParams } from "react-router-dom";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import SecondaryText from "../../components/ui/typography/SecondaryText";
import { useFetchUser } from "../../hooks/auth/useAuthUser";
import ErrorCard from "../../components/ui/cards/ErrorCard";
import { PillCard } from "../../components/ui/buttons/PillTag";
import { GooglePlayButton, AppStoreButton } from 'react-mobile-app-button';
import { APP_GOOGLE_PLAYSTORE_LINK, APP_IOS_APPSTORE_LINK } from '../../types/constants';
import { useStoreLinks } from "../../hooks/marketing/useStoreLinks";
import { useTheme } from "../../contexts/ThemeContext";
import { Activity, useCallback, useMemo } from "react";
import { Download } from "lucide-react";
import { isMobile } from "react-device-detect";
import TempGuestUserProvider from "../../components/auth/guest/TempGuestUserProvider";
import ScrummyLoadingState from "../../components/ui/ScrummyLoadingState";
import { getAuthHeader } from "../../utils/backendUtils";
import { deleteTempGuestAccount } from "../../utils/authUtils";


export default function InviteStepsScreen() {

  console.log('Auth Headers ', getAuthHeader());

  return (
    <TempGuestUserProvider
      loadingFallback={<ScrummyLoadingState />}
    >
      <Content />
    </TempGuestUserProvider>
  )
}


function Content() {

  const [searchParams] = useSearchParams();
  const leagueId = searchParams.get(leagueInviteQueryParams.LEAGUE_ID);
  const { oneLinkUrl } = useStoreLinks();

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
          <Link to={oneLinkUrl || ''} target={'blank'} >
            <PrimaryButton className="text-nowrap" >Download App</PrimaryButton>
          </Link>
        </div>
      </header>

      <FantasyLeagueGroupDataProvider
        leagueId={leagueId || ''}
        loadingFallback={<LoadingIndicator />}
      >
        <InviteView />
      </FantasyLeagueGroupDataProvider>

    </PageView>
  )
}

function InviteView() {

  const { theme } = useTheme();

  const { league, members, isLoading: loadingLeague } = useFantasyLeagueGroup();

  const [searchParams] = useSearchParams();
  const inviterId = searchParams.get(leagueInviteQueryParams.USER_ID);
  const joinCode = searchParams.get(leagueInviteQueryParams.JOIN_CODE);

  const { user: inviter, isLoading: loadingUser } = useFetchUser(inviterId);
  const isJoinCodeMatch = joinCode?.toUpperCase() === league?.entry_code?.toUpperCase();

  const { oneLinkUrl } = useStoreLinks(league);

  const isLoading = loadingLeague || loadingUser;

  const qs = leagueInviteQueryParams;

  const inAppLink = useMemo(() => {
    const resourcePath = `leagues?event=accept_invite&${qs.LEAGUE_ID}=${league?.id}&${qs.USER_ID}=${inviter?.kc_id}&${qs.JOIN_CODE}=${joinCode}`;

    if (isMobile) {
      return `scrummy://${resourcePath}`;
    }

    return `/${resourcePath}`;
  }, [inviter?.kc_id, joinCode, league?.id, qs.JOIN_CODE, qs.LEAGUE_ID, qs.USER_ID]);

  const handleOpenInApp = useCallback(() => {
    deleteTempGuestAccount();
    window.open(inAppLink, '_blank');
  }, [inAppLink]);

  if (isLoading) {
    return (
      <LoadingSkeleton />
    )
  }

  const isInviteLinkInvalid = (!inviter || !league || !isJoinCodeMatch) && !isLoading;

  if (isInviteLinkInvalid) {
    return (
      <div className="flex flex-col items-center justify-center p-6" >
        <ErrorCard
          error="Something wen't wrong with the invite link"
          message="The invite link appears to be broken. Please ask the inviter to send another invite link, then try again"
          className="p-3 h-fit"
        />
      </div>
    )
  }

  const pluralMembers = members.length > 1;

  return (
    <section className="flex flex-col mt-10 gap-4 items-center justify-center p-4" >

      <div className="flex w-fit flex-col cursor-pointer transition-all ease-in items-center gap-2 " >
        <Trophy className="w-20 h-20" />
        <p className="font-semibold" >{league?.title}</p>

        <div className="flex flex-row items-center gap-2" >
          <PillCard className="flex flex-row items-center justify-center gap-2" >
            <Users className="w-4 h-4" />
            <p>{members.length} Member{pluralMembers ? 's' : ''}</p>
          </PillCard>

          <PillCard className="flex flex-row items-center justify-center gap-2" >
            <Trophy className="w-4 h-4" />
            <p>{league?.season.name}</p>
          </PillCard>
        </div>

      </div>

      <div className="flex flex-col gap-4 items-center justify-center " >
        <SecondaryText className="max-w-[60%] text-center" >You have been invited by {inviter?.username} to join {league?.title} on SCRUMMY</SecondaryText>

        <PrimaryButton onClick={handleOpenInApp} className="w-fit py-3 px-8" >Join League In SCRUMMY App</PrimaryButton>

      </div>

      <div className="flex flex-col gap-2 mt-6 items-center justify-center" >
        <SecondaryText className="text-center max-w-[80%]" >Don't have the SCRUMMY App installed? First install the app then follow this link again to join the league</SecondaryText>

        <div className="flex flex-col w-full gap-4">

          <Activity mode={oneLinkUrl ? 'hidden' : 'visible'} >
            <AppStoreButton
              url={APP_IOS_APPSTORE_LINK}
              theme={theme === 'dark' ? 'dark' : 'dark'}
              width={300}
              height={60}
            />

            <GooglePlayButton
              url={APP_GOOGLE_PLAYSTORE_LINK}
              theme={theme === 'dark' ? 'dark' : 'dark'}
              className="w-[300px] text-nowrap p-4"
              width={300}
              height={60}
            />
          </Activity>

          <Activity mode={oneLinkUrl ? 'visible' : 'hidden'} >
            <Link to={oneLinkUrl || ''} target="blank" >
              <div className="flex flex-col items-center justify-center w-full" >
                <PrimaryButton className="flex w-fit flex-row items-center gap-4" >
                  <p> Download App</p>
                  <Download />
                </PrimaryButton>
              </div>
            </Link>
          </Activity>
        </div>
      </div>
    </section >
  )
}

function LoadingSkeleton() {
  return (
    <div>
      <LoadingIndicator />
    </div>
  )
}