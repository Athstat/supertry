import { IFixture } from '../../../types/games'
import { useLiveFixture } from '../../../hooks/fixtures/useLiveFixture';
import { useLiveGameClock } from '../../../hooks/fixtures/useLiveGameClock';
import { isGameLive, formatGameStatus } from '../../../utils/fixtureUtils';
import { format } from 'date-fns';

type Props = {
    fixture: IFixture,
    hideDate?: boolean
}

export default function FixtureCardGameStatus({ fixture, hideDate = false }: Props) {

    const { liveFixture } = useLiveFixture({ fixture });

    // Use the live fixture data if available, otherwise use prop fixture
    const displayFixture = liveFixture || fixture;

    // Use live game clock hook
    const liveGameClock = useLiveGameClock({
        gameStatus: displayFixture.game_status,
        serverGameClock: displayFixture.game_clock,
    });

    const {
        kickoff_time,
        game_status,
    } = displayFixture;


    return (
        <div className="flex-1 text-slate-700 dark:text-slate-400 flex flex-col items-center text-center justify-center">
            {/* <p className='text-xs' >{fixture.venue}</p> */}
            {!hideDate && kickoff_time && (
                <p className="text-xs">{format(kickoff_time, 'EEE, dd MMM yyyy')}</p>
            )}
            {kickoff_time && (
                <p className="text-sm font-semibold">{format(kickoff_time, 'h:mm a')}</p>
            )}

            {isGameLive(game_status) && (
                <div className="flex flex-col items-center gap-0.5">
                    <div className="flex flex-row items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 animate-pulse dark:bg-green-400 rounded-full " />
                        <span className="text-sm text-green-600 dark:text-green-400 font-bold">
                            {formatGameStatus(game_status)}
                        </span>
                    </div>
                    {liveGameClock && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                            {liveGameClock}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
