import { useLiveFixture } from "../../../hooks/fixtures/useLiveFixture";
import { IFixture } from "../../../types/fixtures";
import { abbreviateSeasonName } from "../../../utils/stringUtils";

type HeaderProps = {
  fixture: IFixture,
  showVenue?: boolean,
  showCompetition?: boolean
}

/** Renders the header area on a fixture card showing the competition name, venue and round info */
export function FixtureCardHeaderSection({ fixture, showCompetition, showVenue }: HeaderProps) {

  // Use live fixture polling hook
  const { liveFixture } = useLiveFixture({ fixture });

  // Use the live fixture data if available, otherwise use prop fixture
  const displayFixture = liveFixture || fixture;

  const {
    competition_name,
    venue,
  } = displayFixture;

  return (
    <div className="w-full text-gray-600 items-center justify-center flex flex-col">
      {showCompetition && competition_name && fixture.round && venue && (
        <div className='flex bg-[#F0F3F7] dark:bg-transparent rounded-full px-2 flex-row items-center justify-center gap-1 text-[10px] lg:text-sm text-[#1F396F]  dark:text-slate-400' >
          <p>{abbreviateSeasonName(competition_name)}</p>
          <p className='text-xs' >|</p>
          <p>Round {fixture.round}</p>
          {showVenue && (
            <>
              <p className='text-xs' >|</p>
              <p>{venue}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}