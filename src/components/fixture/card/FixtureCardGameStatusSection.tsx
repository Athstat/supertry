import { format } from "date-fns";
import { useLiveFixture } from "../../../hooks/fixtures/useLiveFixture";
import { useLiveGameClock } from "../../../hooks/fixtures/useLiveGameClock";
import { IFixture } from "../../../types/games";
import { isGameLive, formatGameStatus } from "../../../utils/fixtureUtils";

type KickoffSectionProps = {
  fixture: IFixture,
  hideDate?: boolean
}

export function FixtureCardGameStatusSection({ fixture, hideDate }: KickoffSectionProps) {

  // Use live fixture polling hook
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

      {kickoff_time && (
        <p className="text-[18px] font-medium">{format(kickoff_time, 'HH:mm ')}</p>
      )}

      {!hideDate && kickoff_time && (
        <p className="text-[10px]">{format(kickoff_time, 'EEE, dd MMM ')}</p>
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

