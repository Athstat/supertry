import { TriangleAlert } from "lucide-react"
import { useGeneralPlayerAvailability } from "../../../hooks/fantasy/usePlayerSquadReport"
import { IProAthlete } from "../../../types/athletes"
import WarningCard from "../../ui/cards/WarningCard"
import { useMemo } from "react"
import { IProTeam } from "../../../types/team"
import { isPastFixture } from "../../../utils/fixtureUtils"
import { twMerge } from "tailwind-merge"
import { IFantasyLeagueRound } from "../../../types/fantasyLeague"
import { usePlayerRoundAvailability } from "../../../hooks/fantasy/usePlayerRoundAvailability"
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup"
import { usePlayerSeasonTeam } from "../../../hooks/seasons/useSeasonTeams"

type Props = {
    athlete: IProAthlete,
    iconClassName?: string,
    className?: string
}

/** Renders an Availability Indicator Icon, usually to be placed on top of a card */
export default function AvailabilityIcon({ athlete, className, iconClassName }: Props) {

    const {seasonTeam} = usePlayerSeasonTeam(athlete);
    const { report, isLoading } = useGeneralPlayerAvailability(athlete.tracking_id, seasonTeam?.athstat_id);

    if (isLoading) {
        return;
    }

    if (report?.status === "PENDING") {
        return;
    }

    if (report?.status === "TEAM_NOT_PLAYING") {
        return;
    }

    const notAvailable = report?.status === "NOT_AVAILABLE";

    if (!notAvailable) {
        return;
    }

    return (
        <div >
            <div className={twMerge(
                "bg-yellow-100 dark:bg-yellow-900/40 hover:bg-yellow-400 border border-yellow-500 dark:border-yellow-700 w-7 h-7 rounded-xl flex flex-col items-center justify-center",
                className
            )} >
                <TriangleAlert className={twMerge(
                    "w-4 text-yellow-500 dark:text-yellow-500 h-4",
                    iconClassName
                )} />
            </div>
        </div>
    )
}

/** Renders an Availability Text Report explaining the absense, usually to be placed on top of a card */
export function AvailabilityText({ athlete, className }: Props) {

    const {seasonTeam} = usePlayerSeasonTeam(athlete);
    const { report, isLoading } = useGeneralPlayerAvailability(athlete.tracking_id, seasonTeam?.athstat_id);

    const opposition = useMemo<IProTeam | undefined>(() => {

        if (!report) return undefined;

        const { game } = report;
        const athelteTeamId = athlete.team_id;

        if (athelteTeamId !== game?.team?.athstat_id) {
            return game?.team;
        }

        return game?.opposition_team;
    }, [report, athlete]);

    if (isLoading) {
        return;
    }

    if (!report) {
        return;
    }

    if (report?.status === "PENDING") {
        return;
    }

    const notAvailable = Boolean(report.game) && report?.status === "NOT_AVAILABLE";
    const isPast = isPastFixture(report.game)

    if (!notAvailable) {
        return;
    }

    // const handleViewGame = () => {
    //     navigate(`/fixtures/${report.game?.game_id}`);
    // }

    return (
        <WarningCard className={twMerge(
            'text-xs',
            className
        )} >
            <TriangleAlert className="min-w-5  min-h-5" />

            {report.status == "NOT_AVAILABLE" && (<p className="text-xs" >
                {athlete.player_name} {isPast ? 'was' : 'is'} not on the team roster for the match
                against <a href={`/fixtures/${report.game?.game_id}`} className="underline cursor-pointer text-primary-500" >
                    <strong>{opposition?.athstat_name}</strong>
                </a>
                .
                {!isPast && 'Consider taking action if he is in your team'}
            </p>)}

            {report.status == "TEAM_NOT_PLAYING" && (<p className="text-xs" >
                {athlete.player_name}'s {isPast ? 'was' : 'is'} team is not playing in this round
                {!isPast && ' Consider taking action if he is in your team'}
            </p>)}
        </WarningCard>
    )
}

type RoundProps = Props & {
    round: IFantasyLeagueRound
}


export function RoundAvailabilityText({ athlete, className, round }: RoundProps) {

    const { league } = useFantasyLeagueGroup();
    const { report, isLoading, isNotAvailable, isTeamNotPlaying } = usePlayerRoundAvailability(
        athlete.tracking_id,
        league?.season_id ?? "",
        round.start_round ?? 0
    );

    const opposition = useMemo<IProTeam | undefined>(() => {

        if (!report) return undefined;

        const { game } = report;
        const athelteTeamId = athlete.team_id;

        if (athelteTeamId !== game?.team?.athstat_id) {
            return game?.team;
        }

        return game?.opposition_team;
    }, [report, athlete]);

    if (isLoading) {
        return;
    }

    if (!report) {
        return;
    }

    const notAvailable = Boolean(report.game) && report?.status === "NOT_AVAILABLE" || isNotAvailable || isTeamNotPlaying;
    const isPast = isPastFixture(report.game);

    if (!notAvailable) {
        return;
    }

    // const handleViewGame = () => {
    //     navigate(`/fixtures/${report.game?.game_id}`);
    // }

    console.log(report);

    return (
        <WarningCard className={twMerge(
            'text-xs',
            className,
        )} >
            <TriangleAlert className="min-w-5  min-h-5" />

            {report.status == "NOT_AVAILABLE" && (<p className="text-xs" >
                {athlete.player_name} {isPast ? 'was' : 'is'} not on the team roster for the match
                against <a href={`/fixtures/${report.game?.game_id}`} className="underline cursor-pointer text-primary-500" >
                    <strong>{opposition?.athstat_name}</strong>
                </a>
                .
                {!isPast && 'Consider taking action if he is in your team'}
            </p>)}

            {report.status == "TEAM_NOT_PLAYING" && (<p className="text-xs" >
                {athlete.player_name}'s {isPast ? 'was' : 'is'} team is not playing in this round
                {!isPast && ' Consider taking action if he is in your team'}
            </p>)}
        </WarningCard>
    )
}
