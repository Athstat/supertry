import { twMerge } from "tailwind-merge";
import { useLiveFixture } from "../../../hooks/fixtures/useLiveFixture";
import { IFixture } from "../../../types/games";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import TeamLogo from "../../team/TeamLogo";
import { trimTeamName } from "../../../utils/stringUtils";

type Props = {
    fixture: IFixture,
    showLogo?: boolean,
    isHome?: boolean
}

export default function FixtureCardTeam({ fixture, showLogo, isHome = true }: Props) {

    // Use live fixture polling hook
    const { liveFixture } = useLiveFixture({ fixture });

    // Use the live fixture data if available, otherwise use prop fixture
    const displayFixture = liveFixture || fixture;

    const {
        team_score,
        game_status,
        opposition_score,
    } = displayFixture;

    const matchFinal = game_status === 'completed' && team_score && opposition_score;

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;

    const { gameKickedOff } = fixtureSummary(displayFixture);

    const team = isHome ? fixture.team : fixture.opposition_team;
    const teamScore = isHome ? fixture.team_score : fixture.opposition_score;
    const teamWon = isHome ? homeTeamWon : awayTeamWon;

    const showScore = gameKickedOff && fixture.team_score !== null && fixture.opposition_score !== null;

    const showScoreOnRight = isHome && showScore;
    const showScoreOnLeft = !isHome && showScore;

    return (
        <div className={twMerge(
            "flex-1 flex text-slate-700 dark:text-white flex-row items-center justify-start gap-2",
            !isHome && "justify-end"
        )}>

            {showScoreOnLeft ? (
                <div
                    className={twMerge(
                        'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
                        teamWon && 'font-bold'
                    )}
                >
                    {teamScore}
                </div>
            ) : null}

            <div className={twMerge(
                "flex flex-col gap-1 items-center w-fit justify-center",
                !isHome && "items-center"
            )}>
                {showLogo && (
                    <TeamLogo
                        url={team?.image_url}
                        teamName={team?.athstat_name}
                        className="w-10 h-10"
                    />
                )}

                <p className={twMerge('text-[10px] md:text-sm w-fit text-center')}>
                     {trimTeamName(team?.athstat_name)}
                </p>
            </div>

            {showScoreOnRight ? (
                <div
                    className={twMerge(
                        'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
                        teamWon && 'font-bold'
                    )}
                >
                    {teamScore}
                </div>
            ) : null}
        </div>

    )
}
