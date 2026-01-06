import { Activity, useMemo, useState } from "react"
import { IProAthlete } from "../../../types/athletes"
import { IFixture } from "../../../types/games"
import CircleButton from "../../ui/buttons/BackButton"
import { Binoculars, X, Info } from "lucide-react"
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot"
import { useAthleteMatchPr } from "../../../hooks/athletes/useAthleteMatchPr"
import SecondaryText from "../../ui/typography/SecondaryText"
import { swrFetchKeys } from "../../../utils/swrKeys"
import useSWR from "swr"
import { gamesService } from "../../../services/gamesService"
import { useFixtureScreen } from "../../../hooks/fixtures/useFixture"
import { fixtureSummary } from "../../../utils/fixtureUtils"
import { twMerge } from "tailwind-merge"
import TeamLogo from "../../team/TeamLogo"
import PrimaryButton from "../../ui/buttons/PrimaryButton"
import { useNavigate } from "react-router-dom"
import FantasyPointsInfoModal from "../../branding/help/FantasyPointsInfoModal"
import FixtureModalHeader from "./FixtureModalHeader"
import PlayerFixtureStatsView from "./PlayerFixtureStatsView"
import PlayerPointsBreakdownView from "../../points_breakdown/PlayerPointsBreakdownView"
import RoundedCard from "../../ui/cards/RoundedCard"
import BottomSheetView from "../../ui/modals/BottomSheetView"

type Props = {
    fixture: IFixture,
    player: IProAthlete,
    onClose?: () => void,
    isOpen?: boolean,
    className?: string,
    showMatchInfo?: boolean,
    hideViewPlayerProfile?: boolean
}

export default function PlayerFixtureModal({ fixture, player, onClose, isOpen, className, showMatchInfo, hideViewPlayerProfile = false }: Props) {

    const { gameKickedOff, matchFinal } = fixtureSummary(fixture);

    const navigate = useNavigate();
    const { openPlayerProfileModal } = useFixtureScreen();
    const { pr, isLoading: loadingPr } = useAthleteMatchPr(player.tracking_id, fixture.game_id);

    const [showPointsInfo, setShowPointsInfo] = useState(false);

    const key = gameKickedOff ? swrFetchKeys.getAthleteFixtureSportsActions(fixture.game_id, player.tracking_id) : null;
    const { data, isLoading: loadingSportsActions } = useSWR(key, () => gamesService.getAthleteFixtureSportsActions(fixture.game_id, player.tracking_id));

    const sportActions = useMemo(() => {
        return data ?? [];
    }, [data]);

    const isLoading = loadingPr || loadingSportsActions;


    const hasActions = sportActions.length > 0;
    const [activeTab, setActiveTab] = useState<"match-stats" | "points-breakdown">("match-stats");

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
    }

    const handleViewPlayerProfile = () => {
        openPlayerProfileModal(player);
    }

    const handleViewFullMatch = () => {
        navigate(`/fixtures/${fixture.game_id}`);
    }

    return (
        <Activity mode={isOpen ? "visible" : "hidden"} >
            <BottomSheetView
                className={twMerge(
                    "min-h-[80vh] dark:bg-[#161c27] z-20 max-h-[80vh] py-2 px-4 flex flex-col gap-2",
                    className
                )}
                hideHandle
            >

                <Activity mode={isLoading ? "hidden" : "visible"} >

                    <FixtureModalHeader
                        player={player}
                        onClose={handleClose}
                        onViewPlayerProfile={handleViewPlayerProfile}
                        hideViewPlayerProfile={hideViewPlayerProfile}
                        powerRanking={pr}
                    />

                    {/* Tabs */}
                    <Activity mode={hasActions ? "visible" : "hidden"} >
                        <div className="flex flex-row gap-2 mt-4 border-b dark:border-slate-700">
                            <button
                                onClick={() => setActiveTab("match-stats")}
                                className={`px-4 py-2 font-semibold transition-colors ${activeTab === "match-stats"
                                    ? "border-b-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                                    : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                Match Stats
                            </button>
                            <button
                                onClick={() => setActiveTab("points-breakdown")}
                                className={`px-4 py-2 font-semibold transition-colors ${activeTab === "points-breakdown"
                                    ? "border-b-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                                    : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                Fantasy Points Breakdown
                            </button>
                        </div>
                    </Activity>

                    

                    {showMatchInfo && <RoundedCard className="flex flex-col p-4 mt-2 gap-2" >

                        <div className="flex flex-row w-full items-start" >
                            <SecondaryText className="text-sm" >{fixture.team?.athstat_name} vs {fixture.opposition_team?.athstat_name}</SecondaryText>
                        </div>

                        <div className="flex flex-row items-center justify-between" >
                            <div className="flex flex-row items-center gap-2" >
                                <TeamLogo
                                    url={fixture.team?.image_url}
                                    className="w-8 h-8"
                                />

                                <p>vs</p>

                                <TeamLogo
                                    url={fixture.opposition_team?.image_url}
                                    className="w-8 h-8"
                                />
                            </div>

                            <div>
                                <PrimaryButton onClick={handleViewFullMatch} className="text-xs" >View Match Details</PrimaryButton>
                            </div>
                        </div>
                    </RoundedCard>}

                    <Activity mode={hasActions && activeTab === "match-stats" ? "visible" : "hidden"} >
                        <PlayerFixtureStatsView
                            sportActions={sportActions}
                        />
                    </Activity>

                    {/* Points Breakdown Tab */}
                    <Activity mode={hasActions && activeTab === "points-breakdown" ? "visible" : "hidden"} >
                        <PlayerPointsBreakdownView
                            key={fixture.game_id}
                            athlete={player}
                            game={fixture}
                            hideSubtitle
                            headerTitle={(
                                <div className="flex flex-col py-2 pl-2">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-lg">Fantasy Points</p>
                                        <button
                                            onClick={() => setShowPointsInfo(true)}
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                            aria-label="View points breakdown information"
                                        >
                                            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div>
                                    <SecondaryText className="text-sm">Points earned in this match</SecondaryText>
                                </div>
                            )}
                        />

                        <FantasyPointsInfoModal
                            isOpen={showPointsInfo}
                            onClose={() => setShowPointsInfo(false)}
                        />
                    </Activity>

                    <Activity mode={!hasActions ? "visible" : "hidden"} >
                        <div className="flex flex-col items-center justify-center px-[15%] h-[200px] text-center" >
                            {!gameKickedOff && <SecondaryText>Match Statisitics for <strong>{player.player_name}</strong> will become available when game kicks off</SecondaryText>}
                            {gameKickedOff && <SecondaryText>Match Statisitics for <strong>{player.player_name}</strong> are not yet available</SecondaryText>}
                            {matchFinal && <SecondaryText>Match Statisitics for <strong>{player.player_name}</strong> are not yet available</SecondaryText>}
                        </div>
                    </Activity>

                </Activity>

                <Activity mode={isLoading ? "visible" : "hidden"} >

                    <LoadingSkeleton
                        player={player}
                        onClose={handleClose}
                    />

                </Activity>
            </BottomSheetView>
        </Activity>
    )
}

type SkeletonProps = {
    player: IProAthlete,
    onClose?: () => void
}

function LoadingSkeleton({ player, onClose }: SkeletonProps) {
    return (

        <div className="flex flex-col gap-2" >

            <div className="flex py-2 flex-row items-center justify-between " >

                <div className="flex flex-row items-center gap-2" >
                    <Binoculars />
                    <p>Match Performance Overview</p>
                </div>

                <div>
                    <CircleButton
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </CircleButton>
                </div>
            </div>

            <div className="flex mt-2 flex-row items-center justify-between" >

                <div className="flex flex-row items-center gap-2" >

                    <div>
                        <SmartPlayerMugshot
                            url={player.image_url}
                            teamId={player.team_id}
                            playerImageClassName="w-16 h-16"
                            jerseyClassName="min-w-16 min-h-16"
                            jerseyConClassName="min-w-16 min-h-16"
                        />
                    </div>

                    <div className="flex flex-col gap-0.5" >
                        <p>{player.player_name}</p>
                        <SecondaryText>{player.team?.athstat_name}</SecondaryText>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-center gap-2" >

                    <RoundedCard className="h-[30px] w-[30px] animate-pulse rounded-xl border-none bg-slate-200" />

                    <SecondaryText className="text-wrap text-center text-xs" >Match Rating</SecondaryText>
                </div>
            </div>

            <div className="mt-2 flex flex-row animate-pulse items-center gap-2 " >
                <RoundedCard className="border-none h-[50px] w-full flex-1 bg-slate-200" />
                <RoundedCard className="border-none h-[50px] w-full flex-1 bg-slate-200" />
            </div>

            <div className="flex flex-col gap-4" >
                <RoundedCard className="h-[100px] w-full border-none bg-slate-200" />
                <RoundedCard className="h-[300px] w-full border-none bg-slate-200" />
                <RoundedCard className="h-[100px] w-full border-none bg-slate-200" />
                <RoundedCard className="h-[100px] w-full border-none bg-slate-200" />
                <RoundedCard className="h-[100px] w-full border-none bg-slate-200" />
            </div>
        </div>
    )
}
