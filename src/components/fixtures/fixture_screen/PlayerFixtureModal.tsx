import { Activity, useCallback, useMemo, useState } from "react"
import { IProAthlete } from "../../../types/athletes"
import { IFixture } from "../../../types/games"
import BottomSheetView from "../../ui/BottomSheetView"
import CircleButton from "../../shared/buttons/BackButton"
import { Binoculars, X, Info } from "lucide-react"
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot"
import MatchPrCard from "../../rankings/MatchPrCard"
import { useAthleteMatchPr } from "../../../hooks/athletes/useAthleteMatchPr"
import SecondaryText from "../../shared/SecondaryText"
import { StatCard } from "../../shared/StatCard"
import { swrFetchKeys } from "../../../utils/swrKeys"
import useSWR from "swr"
import { gamesService } from "../../../services/gamesService"
import { GameSportAction } from "../../../types/boxScore"
import { getStatUnit, sanitizeStat } from "../../../utils/stringUtils"
import QuickActionButton from "../../ui/QuickActionButton"
import { useFixtureScreen } from "../../../hooks/fixtures/useFixture"
import { fixtureSummary } from "../../../utils/fixtureUtils"
import RoundedCard from "../../shared/RoundedCard"
import { twMerge } from "tailwind-merge"
import TeamLogo from "../../team/TeamLogo"
import PrimaryButton from "../../shared/buttons/PrimaryButton"
import { useNavigate } from "react-router-dom"
import FantasyPointsInfoModal from "../../branding/help/FantasyPointsInfoModal"

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

    const getAction = useCallback((...actionNames: string[]) => {
        return sportActions.find((s) => {
            return actionNames.includes(s.action);
        })
    }, [sportActions]);

    const handleViewPlayerProfile = () => {
        openPlayerProfileModal(player);
    }

    const minutesPlayed = getAction("minutes_played_total", "MinutesPlayedTotal");
    const pointsScored = getAction("points", "Points");

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

                    <div className="flex py-2 flex-row items-center justify-between " >

                        <div className="flex flex-row items-center gap-2" >
                            <Binoculars />
                            <p>Match Performance Overview</p>
                        </div>

                        <div>
                            <CircleButton
                                onClick={handleClose}
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

                            {pr && <MatchPrCard
                                pr={pr.updated_power_ranking}
                            />}

                            <SecondaryText className="text-wrap text-center text-xs" >Match Rating</SecondaryText>
                        </div>
                    </div>

                    <div className="" >
                        {!hideViewPlayerProfile && <QuickActionButton
                            onClick={handleViewPlayerProfile}
                        >
                            View Player Profile
                        </QuickActionButton>}
                    </div>

                    {/* Tabs */}
                    <Activity mode={hasActions ? "visible" : "hidden"} >
                        <div className="flex flex-row gap-2 mt-4 border-b dark:border-slate-700">
                            <button
                                onClick={() => setActiveTab("match-stats")}
                                className={`px-4 py-2 font-semibold transition-colors ${activeTab === "match-stats"
                                    ? "border-b-2 border-primary-500 text-primary-500"
                                    : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                Match Stats
                            </button>
                            <button
                                onClick={() => setActiveTab("points-breakdown")}
                                className={`px-4 py-2 font-semibold transition-colors ${activeTab === "points-breakdown"
                                    ? "border-b-2 border-primary-500 text-primary-500"
                                    : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                Points Breakdown
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
                        <div className="flex flex-col gap-4 mt-4" >

                            <div className="flex flex-row items-center gap-2" >
                                <StatCard
                                    label="Minutes Played"
                                    value={sanitizeStat(minutesPlayed?.action_count) + `${getStatUnit("Minutes Played") || ''}`}
                                    className="flex-1"
                                />

                                <StatCard
                                    label="Points Scored"
                                    value={sanitizeStat(pointsScored?.action_count)}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <StatsGroup
                            groupTitle="General"
                            sportActions={sportActions}
                            actionNames={[
                                ["minutes_played_total", "MinutesPlayedTotal"],
                                ["minutes_played_first_half", "	MinutesPlayedFirstHalf"],
                                ["minutes_played_second_half", "MinutesPlayedSecondHalf"],
                            ]}
                        />

                        <StatsGroup
                            groupTitle="Attacking"
                            sportActions={sportActions}
                            actionNames={[
                                ["tries", "Tries"],
                                ["points", "Points"],
                                ["passes", "Passes"],
                                ["defenders_beaten", "DefendersBeaten"],
                                ["try_assit", "TryAssit"],
                                ["offload", "Offload"],
                                ["turnovers_conceded", "TurnoversConceded"],
                                ["ruck_arrival_attack", "RuckArrivalAttack"],
                            ]}
                        />

                        <StatsGroup
                            groupTitle="Ball Carrying"
                            sportActions={sportActions}
                            actionNames={[
                                ["carries_metres", "CarriesMetres"],
                                ["post_contact_metres", "PostContactMetres"],
                                ["carry_dominant", "CarryDominant"],
                                ["carries_opp_half", "CarriesOppHalf"],
                                ["carries_own_half", "CarriesOwnHalf"],
                                ["clean_breaks", "CleanBreaks"],
                            ]}
                        />

                        <StatsGroup
                            groupTitle="Defense"
                            sportActions={sportActions}
                            actionNames={[
                                ["tackles", "Tackles"],
                                ["missed_tackles", "MissedTackles"],
                                ["rucks_lost", "RucksLost"],
                                ["collection_loose_ball", "CollectionLooseBall"],
                                ["dominant_tackles", "DominantTackles"],
                                ["turnover_won", "TurnoverWon"],
                                ["tackle_try_saver", "TacklesTrySaver"],
                            ]}
                        />

                        <StatsGroup
                            groupTitle="Kicking"
                            sportActions={sportActions}
                            actionNames={[
                                ["conversion_goals", "ConversionGoals"],
                                ["missed_conversion_goals", "MissedConversionGoals"],
                                ["kick_penalty_good", "KickPenaltyGood"],
                                ["kick_penalty_bad", "KickPenaltyBad"],
                                ["drop_goals_converted", "DropGoalsConverted"],
                                ["try_kicks", "TryKicks"],
                            ]}
                        />

                        <StatsGroup
                            groupTitle="Discipline"
                            sportActions={sportActions}
                            actionNames={[
                                ["red_cards", "RedCards"],
                                ["yellow_cards", "YellowCards"],
                                ["penalties_conceded", "PenaltiesConceded"],
                            ]}
                        />

                    </Activity>

                    {/* Points Breakdown Tab */}
                    <Activity mode={hasActions && activeTab === "points-breakdown" ? "visible" : "hidden"} >
                        <MatchPointsBreakdown sportActions={sportActions} />
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

type StatGroupProps = {
    actionNames: string[][],
    sportActions: GameSportAction[],
    groupTitle?: string,
}

function StatsGroup({ actionNames, sportActions, groupTitle }: StatGroupProps) {

    const sanitizeStat = (actionCount?: number) => {
        if (!actionCount || actionCount === undefined || actionCount === null) {
            return '-';
        }


        const [, decimal] = actionCount.toString().split(".");

        if (Number(decimal) > 0) {
            return Number(actionCount.toString()).toFixed(1);
        }

        return Math.floor(actionCount);
    }

    const getStatUnit = (actionDisplayName?: string) => {
        if (!actionDisplayName) {
            return undefined;
        }

        if (actionDisplayName.includes("Minute")) {
            return "'"
        }

        if (actionDisplayName.includes("Metres")) {
            return "m"
        }
        return undefined;
    }

    return (
        <div className="border-t dark:border-slate-700 p-2 flex flex-col gap-2" >
            <div>
                <SecondaryText className="text-sm font-semibold" >{groupTitle}</SecondaryText>
            </div>

            <div className="flex flex-col gap-2" >
                {actionNames.map((a) => {

                    const sportAction = sportActions.find((s) => {
                        return a.includes(s.action);
                    });


                    if (!sportAction) {
                        return null;
                    }

                    return (
                        <div className="flex flex-row items-center gap-2 justify-between" >
                            <div>
                                <p className="text-sm" >{sportAction.definition?.display_name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold" >{sanitizeStat(sportAction.action_count)}{getStatUnit(sportAction.definition?.display_name)}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

type MatchPointsBreakdownProps = {
    sportActions: GameSportAction[]
}

// Fantasy Points Scoring Rules (client-side calculation)
const FANTASY_POINTS_MAP: Record<string, number> = {
    // High Impact Actions
    'tries': 4,
    'try_assit': 2,
    'try_kicks': 2,

    // Core Actions
    'clean_breaks': 1,
    'defenders_beaten': 1,
    'dominant_tackles': 1,
    'lineout_won_steal': 1,
    'offload': 1,
    'tackle_turnover': 1,
    'turnover_won': 1,

    // Goal Kicking
    'conversion_goals': 0.5,
    'kick_penalty_good': 0.5,
    'drop_goals_converted': 0.5,

    // Minor Actions
    'tackles': 0.5,
    'carries_crossing_gain_line': 0.3,
    'post_contact_metres': 0.1,
    'carries_metres': 0.05,
    'ruck_arrival_attack': 0.05,

    // Penalties (negative)
    'missed_tackles': -0.5,
    'missed_conversion_goals': -0.5,
    'kick_penalty_bad': -0.5,
    'drop_goals_missed': -0.5,
    'turnovers_conceded': -1,
    'red_cards': -5,
    'yellow_cards': -5,
};

function MatchPointsBreakdown({ sportActions }: MatchPointsBreakdownProps) {
    const [showPointsInfo, setShowPointsInfo] = useState(false);

    const actionsWithPoints = useMemo(() => {
        return sportActions
            .map((action) => {
                // Get point value from mapping
                const pointValue = FANTASY_POINTS_MAP[action.action] || 0;
                const calculatedPoints = pointValue * action.action_count;

                return {
                    ...action,
                    calculatedPoints
                };
            })
            .filter((action) => action.action_count > 0 && action.calculatedPoints !== 0);
    }, [sportActions]);

    const totalFantasyPoints = useMemo(() => {
        return actionsWithPoints.reduce((sum, action) => {
            return sum + action.calculatedPoints;
        }, 0);
    }, [actionsWithPoints]);

    if (actionsWithPoints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4">
                <SecondaryText className="text-center">
                    No fantasy points earned in this match yet
                </SecondaryText>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-2 mt-4 pb-4">
                <div className="mb-2 flex flex-row items-center justify-between">
                    <div className="flex flex-col">
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
                    <div className="font-bold text-2xl text-primary-600 dark:text-primary-400 pr-2">
                        {totalFantasyPoints.toFixed(1)}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {actionsWithPoints.map((action, index) => {
                        const points = action.calculatedPoints;
                        const isNegative = points < 0;
                        const displayName = action.definition?.display_name || action.action;

                        // Determine the correct unit based on action type
                        const isMetreBased = displayName.toLowerCase().includes('metres') || displayName.toLowerCase().includes('meters');
                        const unit = isMetreBased ? 'm' : '';

                        return (
                            <RoundedCard
                                key={index}
                                className="border-none shadow-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 hover:dark:bg-slate-700 flex py-2.5 px-4 flex-row items-center justify-between"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm font-medium dark:text-white">
                                        {displayName}
                                    </p>
                                    <SecondaryText className="text-xs">
                                        {action.action_count} {unit}
                                    </SecondaryText>
                                </div>

                                <div
                                    className={`font-bold text-base ${isNegative
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-green-600 dark:text-green-400'
                                        }`}
                                >
                                    {isNegative ? '' : '+'}{points.toFixed(1)}
                                </div>
                            </RoundedCard>
                        );
                    })}
                </div>
            </div>

            <FantasyPointsInfoModal
                isOpen={showPointsInfo}
                onClose={() => setShowPointsInfo(false)}
            />
        </>
    );
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
