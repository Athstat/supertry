// import { Shield } from 'lucide-react'
import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../types/games'
import { format } from 'date-fns';

type Props = {
    fixture: IFixture,
    showCompetition?: boolean
}

export default function FixtureCard({ fixture, showCompetition }: Props) {

    console.log(fixture);

    const { team_score, opposition_team_id, kickoff_time, result, round, game_status, opposition_score } = fixture;

    const matchFinal = game_status === "completed" && team_score && opposition_score; 

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;
    // const draw = matchFinal ? team_score === opposition_score : false;

    return (
        <div
            className="p-4 flex flex-row text-white hover:bg-slate-50/50 gap-3 dark:hover:bg-dark-800 transition-colors"
        >

            <div className='flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center' >

                <div className='flex flex-row gap-2 items-center w-full justify-start' >
                    <div className='flex flex-row gap-2 items-center w-full justify-start' >
                        <p className={twMerge(
                            'text-sm w-fit text-left',
                            awayTeamWon && ""
                        )} >{fixture.home_team}</p>
                    </div>

                    {fixture.team_score !== null && fixture.opposition_score !== null ? (
                        <div className={twMerge(
                            'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-sm',
                            homeTeamWon && "font-bold",
                        )}>
                            {fixture.team_score}
                        </div>
                    ) : null}

                </div>
            </div>


            <div className='flex-1 text-slate-700 dark:text-slate-400 flex flex-col items-center text-center justify-center' >
                {/* <p className='text-xs' >{fixture.venue}</p> */}
                {showCompetition && <p className='text-xs' >{fixture.competition_name}{round && ", Round " + round}</p>}
                {kickoff_time && <p className='text-xs' >{format(kickoff_time, "dd, MMM yyyy")}</p>}
                {kickoff_time && <p className='text-sm font-semibold' >{format(kickoff_time, "h:mm a")}</p>}
            </div>


            <div className='flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center' >

                <div className='flex flex-row gap-2 items-center w-full justify-start' >
                    {fixture.team_score !== null && fixture.opposition_score !== null ? (
                        <div className={twMerge(
                            'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-sm',
                            awayTeamWon && "font-bold",
                        )}>
                            {fixture.opposition_score}
                        </div>
                    ) : null}

                    <div className='flex flex-row gap-2 items-center w-full justify-end' >
                        <p className={twMerge(
                            'text-sm w-fit text-wrap text-right',
                            awayTeamWon && ""
                        )} >{fixture.away_team}</p>
                    </div>

                </div>
            </div>


        </div>
    )
}
