import { isGameLive, formatGameStatus } from '../../../utils/fixtureUtils';
import { format } from 'date-fns';
import { ISbrFixture } from '../../../types/sbr';

type Props = {
    fixture: ISbrFixture
    showKickOffTime?: boolean
}

/** Renders the game status section on an sbr fixture card */
export default function SbrFixtureCardStatusSection({showKickOffTime, fixture} : Props) {

    const { home_score, away_score } = fixture;
    const hasScores = home_score !== null && away_score !== null;

    return (
        <div className="flex-1 flex flex-col items-center gap-1 justify-center dark:text-slate-400 text-slate-700 ">
            {!hasScores &&
                !showKickOffTime &&
                !isGameLive(fixture.status) &&
                fixture.status !== 'completed' && <p className="text-sm">vs</p>}
            {fixture.status === 'completed' && !showKickOffTime && (
                <div className="flex w-full text-xs flex-row items-center justify-center gap-1">
                    <div>Final</div>
                </div>
            )}

            <div className="flex flex-col items-center justify-center">
                {showKickOffTime && fixture.kickoff_time && (
                    <p className="text-[10px]">{format(fixture.kickoff_time, 'HH:mm')}</p>
                )}
                {showKickOffTime && fixture.kickoff_time && (
                    <p className="text-[10px]">{format(fixture.kickoff_time, 'EEE, dd MMM yyyy')}</p>
                )}
                {!showKickOffTime && fixture.kickoff_time && (
                    <p className="text-sm font-semibold">{format(fixture.kickoff_time, 'HH:mm')}</p>
                )}
            </div>

            {isGameLive(fixture.status) && (
                <div className="flex flex-row items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 animate-pulse dark:bg-green-400 rounded-full " />
                    <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                        {formatGameStatus(fixture.status)}
                    </span>
                </div>
            )}
        </div>
    )
}
