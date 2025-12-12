import { twMerge } from "tailwind-merge"
import { IFixture } from "../../types/games"
import { IProTeam } from "../../types/team"
import { fixtureSummary } from "../../utils/fixtureUtils"
import SecondaryText from "../shared/SecondaryText"
import { Activity, useState } from "react"
import { FixtureCardModal } from "../fixtures/FixtureCard"
import TeamLogo from "./TeamLogo"

type Props = {
    team: IProTeam,
    fixtures: IFixture[]
}

export default function TeamFormGnatChart({ team, fixtures }: Props) {

    const [fixture, setFixture] = useState<IFixture>();
    
    const handleClickFixture = (f: IFixture) => {
        setFixture(f)
    }

    const handleClose = () => {
        setFixture(undefined);
    }

    return (
        <div className="flex h-[40px] flex-row items-center gap-2" >

            <div className="h-[40x] flex items-center flex-row gap-2" >
                <TeamLogo 
                    url={team.image_url}
                    className="w-5 h-5"
                />
                <SecondaryText className="truncate w-[130px]" >{team.athstat_name}</SecondaryText>
            </div>

            <div className="flex overflow-clip gap-1 h-[40px] w-full flex-row items-center justify-end" >
                {fixtures.map((f, index) => {
                    return <FixtureWinLossCard
                        key={f.game_id}
                        fixture={f}
                        team={team}
                        isFirst={index === 0}
                        isLast={index === (fixtures.length - 1)}
                        onClick={handleClickFixture}
                    />
                })}
            </div>

            <Activity mode={fixture ? "visible" : "hidden"} >
                {fixture && <FixtureCardModal
                    fixture={fixture}
                    onClose={handleClose}
                    showModal={Boolean(fixture)}
                />}
            </Activity>
        </div>
    )
}

type FixtureItemProps = {
    fixture: IFixture,
    team: IProTeam,
    isFirstOrLast?: boolean,
    isFirst?: boolean,
    isLast?: boolean,
    onClick?: (fixture: IFixture) => void
}

function FixtureWinLossCard({ fixture, team, isFirst, isLast, onClick }: FixtureItemProps) {

    const { homeTeamWon, awayTeamWon, isDraw } = fixtureSummary(fixture);
    const isHomeTeam = team.athstat_id === fixture.team?.athstat_id;

    const isWin = (homeTeamWon && isHomeTeam) || (awayTeamWon && !isHomeTeam);

    const handleClick = () => {
        if (onClick) {
            onClick(fixture);
        }
    }

    return (
        <div
            className={twMerge(
                "w-12 h-8 flex flex-col cursor-pointer text-black font-bold items-center justify-center",
                isDraw ? "bg-slate-300 dark:text-white dark:bg-slate-700 hover:dark:bg-slate-600" :
                    isWin ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600",
                isFirst && "rounded-l-xl",
                isLast && "rounded-r-xl"
            )}

            onClick={handleClick}
        >
            <p>{isDraw ? "D" : isWin ? "W" : "L"}</p>
        </div>
    )
}