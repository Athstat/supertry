import { isGameLive, formatGameStatus } from "../../../../utils/fixtureUtils";
import { format } from "date-fns";
import { ISbrFixture } from "../../../../types/sbr";

type Props = {
    fixture?: ISbrFixture,
    showKickOffTime?: boolean
}

export default function SbrFixtureGameStatus({ fixture, showKickOffTime = false }: Props) {

    if (!fixture) return;

    const gameCompleted = fixture.status !== 'completed';

    return (
        <div className="flex-1 flex flex-col gap-1 items-center justify-center dark:text-slate-200 text-slate-700">

            {!showKickOffTime &&  gameCompleted && (
                <div className="flex w-full text-xs flex-row items-center justify-center gap-1">
                    <p className="text-sm font-medium" >Final</p>
                </div>
            )}

            {showKickOffTime && fixture.kickoff_time && !gameCompleted && (
                <p className="text font-medium">{format(fixture.kickoff_time, 'HH:mm')}</p>
            )}

            {showKickOffTime && fixture.kickoff_time && (
                <p className="text-[12px]">{format(fixture.kickoff_time, 'EEE, dd MMM')}</p>
            )}

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
