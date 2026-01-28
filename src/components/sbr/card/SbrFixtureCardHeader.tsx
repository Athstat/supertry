import { ISbrFixture } from "../../../types/sbr"

type Props = {
    showCompetition?: boolean,
    fixture: ISbrFixture
}

/** Renders an SBR Fixture Card Header */
export default function SbrFixtureCardHeader({ showCompetition, fixture }: Props) {
    return (
        <div className="flex flex-row items-center justify-center" >

            {showCompetition && <div className="flex bg-[#F0F3F7] rounded-full px-2 flex-row items-center justify-center gap-1 text-[10px] lg:text-sm text-[#1F396F]  dark:text-slate-400" >
                <p>{fixture.season}</p>
                <p>|</p>
                <p>Round {fixture.round}</p>
                {fixture.venue && (
                    <>
                        <p>|</p>
                        <p>{fixture.venue}</p>
                    </>
                )}
            </div>}
        </div>
    )
}
