import { twMerge } from "tailwind-merge"
import { ISbrFixture } from "../../types/sbr"
import PrimaryButton from "../shared/buttons/PrimaryButton"

type Props = {
    currentFixture: ISbrFixture,
    onClickNext: () => void,
    fixtures: ISbrFixture[],
    onChange?: (newCurrent: ISbrFixture) => void
}

export default function SbrVotingModalNavigator({ currentFixture, onClickNext, fixtures, onChange }: Props) {


    return (
        <div className="w-full p-3 flex flex-col items-center justify-center gap-3" >
            
            <PrimaryButton onClick={onClickNext} >Next</PrimaryButton>
            
            <div className="flex flex-row items-center gap-2" >
                {fixtures.map((fixture, index) => {

                    const isCurrent = fixture.fixture_id === currentFixture.fixture_id;

                    return (
                        <div
                            key={index}
                            onClick={() => {
                                if (onChange) {
                                    onChange(fixture);
                                }
                            }}
                            className={twMerge(
                                "w-3 h-3 cursor-pointer border dark:border-white border-slate-600  rounded-full",
                                isCurrent && "dark:bg-white bg-slate-600"

                            )}>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}
