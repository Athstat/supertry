import { twMerge } from "tailwind-merge"
import { IFixture } from "../../types/games"
import { IProTeam } from "../../types/team"
import { fixtureSummary } from "../../utils/fixtureUtils"
import SecondaryText from "../shared/SecondaryText"

type Props = {
    team: IProTeam,
    fixtures: IFixture[]
}

export default function TeamFormGnatChart({team, fixtures} : Props) {
  return (
    <div className="flex h-[40px] flex-row items-center gap-2" >
        
        <div className="h-[40x] w-2/5 flex items-center flex-row" >
            <SecondaryText>{team.athstat_name}</SecondaryText>
        </div>
        
        <div className="flex overflow-clip gap-1 h-[40px] w-full flex-row items-center" >
            {fixtures.map((f, index) => {
                return <FixtureWinLossCard 
                    key={f.game_id}
                    fixture={f}
                    team={team}
                    isFirst={index === 0}
                    isLast={index === (fixtures.length - 1)}
                />
            })}
        </div>
    </div>
  )
}

type FixtureItemProps = {
    fixture: IFixture,
    team: IProTeam,
    isFirstOrLast?: boolean,
    isFirst?: boolean,
    isLast?: boolean
}

function FixtureWinLossCard({fixture, team, isFirst, isLast} : FixtureItemProps) {
    
    const {homeTeamWon, awayTeamWon, isDraw} = fixtureSummary(fixture);
    const isHomeTeam = team.athstat_id === fixture.team?.athstat_id;

    const isWin = (homeTeamWon && isHomeTeam) || (awayTeamWon && !isHomeTeam);
    
    return (
        <div className={twMerge(
            "w-12 h-8 flex flex-col cursor-pointer text-black font-bold items-center justify-center",
            isDraw ? "bg-slate-300 dark:text-white dark:bg-slate-700 hover:dark:bg-slate-600" :
             isWin ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600",
             isFirst && "rounded-l-xl",
             isLast && "rounded-r-xl"
        )} >
            <p>{isDraw ? "D" : isWin ? "W" : "L"}</p>
        </div>
    )
}