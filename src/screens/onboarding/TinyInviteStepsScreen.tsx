import PageView from "../../components/ui/containers/PageView";
import { AppColours, leagueInviteQueryParams } from "../../types/constants";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { Trophy } from "lucide-react";
import { LoadingIndicator } from "../../components/ui/LoadingIndicator";
import { Link, useParams } from "react-router-dom";
import SecondaryText from "../../components/ui/typography/SecondaryText";
import ErrorCard from "../../components/ui/cards/ErrorCard";
import { PillCard } from "../../components/ui/buttons/PillTag";
import { GooglePlayButton, AppStoreButton } from 'react-mobile-app-button';
import { APP_GOOGLE_PLAYSTORE_LINK, APP_IOS_APPSTORE_LINK } from '../../types/constants';
import { useStoreLinks } from "../../hooks/marketing/useStoreLinks";
import { Activity, useCallback, useMemo } from "react";
import { Download } from "lucide-react";
import { isMobile } from "react-device-detect";
import { deleteTempGuestAccount } from "../../utils/authUtils";
import useSWR from "swr";
import { leagueInviteService } from "../../services/fantasy/leagueInviteService";
import DownloadAppHeader from "../../components/ui/navigation/DownloadAppHeader";
import { LeagueGroupInvite } from "../../types/fantasyLeague";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import TempGuestUserProvider from "../../components/auth/guest/TempGuestUserProvider";
import ScrummyLoadingState from "../../components/ui/ScrummyLoadingState";
import { useTheme } from "../../contexts/app_state/ThemeContext";


export default function TinyInviteStepsScreen() {

    return (
        <TempGuestUserProvider loadingFallback={<ScrummyLoadingState />} >
            <Content />
        </TempGuestUserProvider>
    )
}

function Content() {

    const { inviteId } = useParams();

    const key = inviteId ? `fantasy-league-groups/invite/${inviteId}` : null;
    const { data, isLoading } = useSWR(key, () => leagueInviteService.introspectInvite(inviteId || ''));

    return (

        <PageView className="py-0 p-0" >
            <DownloadAppHeader />
            {!isLoading && <InviteView
                invite={data}
            />}
            {isLoading && <LoadingSkeleton />}
        </PageView>
    )
}

type Props = {
    invite?: LeagueGroupInvite
}

function InviteView({ invite }: Props) {

    const league = invite?.league;
    const inviter = invite?.inviter;
    const expiresAt = invite?.expires_at;

    const { theme } = useTheme();
    const { oneLinkUrl } = useStoreLinks(league);

    const qs = leagueInviteQueryParams;

    const inAppLink = useMemo(() => {
        const resourcePath = `leagues?event=accept_invite&${qs.LEAGUE_ID}=${league?.id}&${qs.USER_ID}=${inviter?.kc_id}&${qs.JOIN_CODE}=${league?.entry_code}`;

        if (isMobile) {
            return `scrummy://${resourcePath}`;
        }

        return `/${resourcePath}`;
    }, [inviter?.kc_id, league?.entry_code, league?.id, qs.JOIN_CODE, qs.LEAGUE_ID, qs.USER_ID]);

    const handleOpenInApp = useCallback(() => {
        deleteTempGuestAccount();
        window.open(inAppLink, '_blank');
    }, [inAppLink]);

    const isInviteLinkInvalid = (!inviter || !league);

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

    return (
        <section className="flex flex-col mt-10 gap-4 items-center justify-center p-4" >

            <div className="flex w-fit flex-col cursor-pointer transition-all ease-in items-center gap-2 " >
                <Trophy className="w-20 h-20" />
                <p className="font-semibold" >{league?.title}</p>

                <div className="flex flex-row items-center gap-2" >
                    {/* <PillCard className="flex flex-row items-center justify-center gap-2" >
                        <Users className="w-4 h-4" />
                        <p>{members.length} Member{pluralMembers ? 's' : ''}</p>
                    </PillCard> */}

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

                <div className="flex flex-col w-full gap-4 items-center justify-center">

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

            {expiresAt && (
                <footer className={twMerge(
                    "fixed bottom-0  left-0 p-6 flex flex-col gap-2 items-center justify-center w-full",
                    AppColours.CARD_BACKGROUND
                )} >
                    <SecondaryText>This invite will expire on {format(expiresAt, 'EEEE dd MMMM yyyy, HH:mm')}</SecondaryText>
                    <SecondaryText className="text-xs" >SCRUMMY © {new Date().getFullYear()}</SecondaryText>
                </footer>
            )}
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