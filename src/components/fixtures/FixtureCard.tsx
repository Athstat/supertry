
// import { Shield } from 'lucide-react'
import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../types/games'

type Props = {
    fixture: IFixture
}

export default function FixtureCard({ fixture }: Props) {

    console.log(fixture);

    const { team_score, opposition_team_id, result, game_status, opposition_score } = fixture;

    const homeTeamWon = (game_status && team_score && opposition_score) ? team_score > opposition_score : false;
    const awayTeamWon = (game_status && team_score && opposition_score) ? team_score < opposition_score : false;
    const draw = (game_status && team_score && opposition_score) ? team_score === opposition_score : false;

    return (
        <div
            className="p-4 flex flex-row text-white hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
        >

            <div className='flex-1 flex text-slate-700 dark:text-slate-100 flex-col items-start justify-start' >
                <div className='flex flex-row gap-3 items-center' >
                    <p className={twMerge(
                        ' ',
                        homeTeamWon && "font-bold text-slate-600 dark:text-white"
                    )} >{fixture.home_team}</p>
                    {fixture.team_score && <p className='' >{fixture.team_score}</p>}
                </div>

                <div className='flex flex-row gap-3 items-center' >
                    <p className={twMerge(
                        '',
                        awayTeamWon && "font-bold text-slate-600 dark:text-white"
                    )} >{fixture.away_team}</p>
                    {fixture.team_score && <p className='' >{fixture.team_score}</p>}
                </div>
            </div>


            <div className='flex-1' >
            </div>

        </div>
    )
}
