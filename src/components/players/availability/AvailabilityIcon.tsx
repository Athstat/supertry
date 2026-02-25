import { TriangleAlert } from "lucide-react"
import { IProAthlete } from "../../../types/athletes"
import WarningCard from "../../ui/cards/WarningCard"
import { isPastFixture } from "../../../utils/fixtureUtils"
import { twMerge } from "tailwind-merge"
import { usePlayerRoundAvailability } from "../../../hooks/fantasy/usePlayerRoundAvailability"
import { usePlayerSeasonTeam } from "../../../hooks/seasons/useSeasonTeams"
import { ISeasonRound } from "../../../types/fantasy/fantasySeason"
import { useFantasySeasons } from "../../../hooks/dashboard/useFantasySeasons"
import { useInView } from "react-intersection-observer"

type Props = {
    athlete: IProAthlete,
    iconClassName?: string,
    className?: string,
    shouldFetch?: boolean
}

/** Renders an Availability Indicator Icon, usually to be placed on top of a card */
export default function AvailabilityIcon({ athlete, className, iconClassName, shouldFetch }: Props) {

    const {inView, ref} = useInView({triggerOnce: true});

    const { currentRound } = useFantasySeasons();
    const { seasonTeam } = usePlayerSeasonTeam(athlete);

    const athleteId = athlete.tracking_id;
    const seasonId = currentRound?.season;
    const roundNumber = currentRound?.round_number;
    const teamId = seasonTeam?.athstat_id

    const finalShouldFetch = shouldFetch && inView;

    const { isLoading, showAvailabilityWarning } = usePlayerRoundAvailability(athleteId, seasonId || '', roundNumber || 0, teamId, finalShouldFetch);

    if (isLoading) {
        return;
    }


    if (!showAvailabilityWarning) {
        return;
    }

    return (
        <div ref={ref} >
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

    const { currentRound, selectedSeason } = useFantasySeasons();
    const { seasonTeam } = usePlayerSeasonTeam(athlete);

    const athleteId = athlete.tracking_id;
    const seasonId = currentRound?.season;
    const roundNumber = currentRound?.round_number;
    const teamId = seasonTeam?.athstat_id

    const { report, isLoading, showAvailabilityWarning, opponent } = usePlayerRoundAvailability(athleteId, seasonId || '', roundNumber || 0, teamId);

    if (isLoading) {
        return;
    }

    if (!report) {
        return;
    }

    if (report?.status === "PENDING") {
        return;
    }

    const isPast = isPastFixture(report.game)

    if (!showAvailabilityWarning) {
        return;
    }

    return (
        <WarningCard className={twMerge(
            'text-xs',
            className
        )} >
            <TriangleAlert className="min-w-5  min-h-5" />

            {report.status == "NOT_AVAILABLE" && (<p className="text-xs" >
                {athlete.player_name} {isPast ? 'was' : 'is'} not on the team roster for the match
                against <a href={`/fixtures/${report.game?.game_id}`} className="underline cursor-pointer text-primary-500" >
                    <strong>{opponent?.athstat_name}</strong>
                </a>
                .
                {!isPast && 'Consider taking action if he is in your team'}
            </p>)}

            {report.status == "TEAM_NOT_PLAYING" && (<p className="text-xs" >
                {athlete.player_name}'s {isPast ? 'was' : 'is'} team is not playing in this round
                {!isPast && ' Consider taking action if he is in your team'}
            </p>)}

            {report.status == "INJURED" && (<p className="text-xs" >
                {athlete.player_name} is on injury
                {!isPast && ', consider taking action if he is in your team'}
            </p>)}


            {report.status == "NOT_IN_SEASON_SQUAD" && (<p className="text-xs" >
                {athlete.player_name} is not on his team's {selectedSeason?.name || ''} squad
            </p>)}
        </WarningCard>
    )
}

type RoundProps = Props & {
    round?: ISeasonRound
}


export function RoundAvailabilityText({ athlete, className, round }: RoundProps) {


    const { selectedSeason, currentRound } = useFantasySeasons();
    const { seasonTeam } = usePlayerSeasonTeam(athlete);

    const roundNumber = round?.round_number || currentRound?.round_number;

    const { report, isLoading, showAvailabilityWarning, opponent } = usePlayerRoundAvailability(
        athlete.tracking_id,
        selectedSeason?.id ?? "",
        roundNumber ?? 0,
        seasonTeam?.athstat_id
    );

    if (isLoading) {
        return;
    }

    if (!report) {
        return;
    }

    const isPast = isPastFixture(report.game);

    if (!showAvailabilityWarning) {
        return;
    }

    return (
        <WarningCard className={twMerge(
            'text-xs',
            className,
        )} >
            <TriangleAlert className="min-w-5  min-h-5" />

            {report.status == "NOT_AVAILABLE" && (<p className="text-xs" >
                {athlete.player_name} {isPast ? 'was' : 'is'} not on the team roster for the match
                against <a href={`/fixtures/${report.game?.game_id}`} className="underline cursor-pointer text-primary-500" >
                    <strong>{opponent?.athstat_name}</strong>
                </a>
                .
                {!isPast && 'Consider taking action if he is in your team'}
            </p>)}

            {report.status == "TEAM_NOT_PLAYING" && (<p className="text-xs" >
                {athlete.player_name}'s {isPast ? 'was' : 'is'} team is not playing in this round
                {!isPast && ' Consider taking action if he is in your team'}
            </p>)}

            {report.status == "INJURED" && (<p className="text-xs" >
                {athlete.player_name} is on injury
                {!isPast && ', consider taking action if he is in your team'}
            </p>)}


            {report.status == "NOT_IN_SEASON_SQUAD" && (<p className="text-xs" >
                {athlete.player_name} is not on his team's {selectedSeason?.name || ''} squad
            </p>)}
        </WarningCard>
    )
}
