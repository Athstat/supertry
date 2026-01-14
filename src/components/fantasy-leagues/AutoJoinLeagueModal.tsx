/** Component that automatically promots the user to join a league when it detects some query params  */

import { useSearchParams } from "react-router-dom"
import BottomSheetView from "../ui/modals/BottomSheetView";
import { leagueInviteQueryParams } from "../../types/constants";
import FantasyLeagueGroupDataProvider from "../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons";
import CircleButton from "../ui/buttons/BackButton";
import { Trophy, X } from "lucide-react";
import { DjangoUserMinimal } from "../../types/auth";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { useCallback } from "react";
import { useJoinLeague } from "../../hooks/leagues/useJoinLeague";
import { useFetchUser } from "../../hooks/auth/useAuthUser";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import ErrorCard from "../ui/cards/ErrorCard";

export default function AutoJoinLeagueModal() {

    const qs = leagueInviteQueryParams;

    const [searchParams, setSearchParams] = useSearchParams();
    const event = searchParams.get('event');
    const leagueId = searchParams.get(qs.LEAGUE_ID);
    const inviterId = searchParams.get(qs.USER_ID);
    const joinCode = searchParams.get(qs.JOIN_CODE);

    const { user: inviter, isLoading: loadingUser } = useFetchUser(inviterId);

    const isOpen = Boolean(leagueId) && Boolean(inviterId) && Boolean(joinCode) && Boolean(event);
    
    const handleClose = useCallback(() => {
        setSearchParams((prev) => {
            prev.delete(qs.JOIN_CODE);
            prev.delete(qs.LEAGUE_ID);
            prev.delete(qs.USER_ID);
            prev.delete('event');

            return prev;
        })
    }, [qs.JOIN_CODE, qs.LEAGUE_ID, qs.USER_ID, setSearchParams])

    if (!isOpen) {
        return null;
    }

    return (
        <BottomSheetView
            hideHandle
            className="p-4 max-h-[80vh]"
            onClickOutside={handleClose}
        >
            <FantasyLeagueGroupDataProvider
                leagueId={leagueId || ''}
                loadingFallback={<LoadingIndicator />}
            >

                {!loadingUser && <Content
                    joinCode={joinCode || undefined}
                    inviter={inviter}
                    onClose={handleClose}
                />}

                {loadingUser && <LoadingIndicator />}
            </FantasyLeagueGroupDataProvider>
        </BottomSheetView>
    )
}

type Props = {
    inviter?: DjangoUserMinimal,
    joinCode?: string,
    onClose?: () => void
}

function Content({ inviter, joinCode, onClose }: Props) {

    const { handleJoinLeague, isLoading } = useJoinLeague();
    const { selectedSeason, setSelectedSeason } = useFantasySeasons();
    const { league } = useFantasyLeagueGroup();

    const handleJoin = useCallback(() => {
        if (league?.season) {

            if (league.season.id !== selectedSeason?.id) {
                setSelectedSeason(league.season);
            }

            handleJoinLeague(league);
        }
    }, [handleJoinLeague, league, selectedSeason, setSelectedSeason]);

    const inviterUsername = inviter?.username || inviter?.first_name || inviter?.last_name;

    const joinCodeMatches = league?.entry_code === joinCode;

    if (!joinCodeMatches) {
        return (

            <div className="flex flex-col gap-1" >
                
                <div className="flex flex-row items-center justify-between" >
                    <p className="font-semibold text-lg" >{league?.title} Invite</p>

                    <CircleButton onClick={onClose}>
                        <X />
                    </CircleButton>
                </div>

                <div className="flex gap-4 flex-col justify-center " >
                    <ErrorCard
                        error="Something wen't wrong with the invite link"
                        message="The invite link appears to be broken. Please ask the inviter to send another invite link, then try again"
                        className="p-3 h-fit"
                    />

                    <PrimaryButton onClick={onClose} >Close</PrimaryButton>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8" >
            <div className="flex flex-row items-center justify-between" >
                <p className="font-semibold text-lg" >{league?.title} Invite</p>

                <CircleButton onClick={onClose} >
                    <X />
                </CircleButton>
            </div>

            <div className="flex flex-col items-center justify-center gap-4" >
                <Trophy className="w-24 h-24" />
                <p className="text-center max-w-[80vh]" >You have been invited {inviterUsername ? `by ${inviterUsername}` : ''} to join <strong>{league?.title}</strong> for {league?.season.name}. Accept the invite to join league</p>
            </div>

            <div>
                <PrimaryButton
                    isLoading={isLoading}
                    disabled={isLoading}
                    onClick={handleJoin}
                    className="py-3"
                >
                    Accept Invite & Join League
                </PrimaryButton>
            </div>
        </div>
    )
}
