import { ChevronRight } from "lucide-react"
import { ISbrFixture } from "../../../types/sbr"
import BlueGradientCard from "../../shared/BlueGradientCard"
import { hasSbrRoundPassed } from "../../../utils/sbrUtils"
import { Fragment, useState } from "react"
import SbrVotingModal from "../voting/SbrVotingModal"

type Props = {
    fixtures: ISbrFixture[]
}
export default function SbrFixturesHero({ fixtures }: Props) {

    const fixturesEnded = hasSbrRoundPassed(fixtures);
    const [showVoting, setShowVoting] = useState(false);
    const toggle = () => setShowVoting(!showVoting);

    return (
        <Fragment>
            <BlueGradientCard className="w-full rounded-xl p-5 bg-gradient-to-br flex flex-col gap-4 lg:p-10" >
                <h1 className="text-xl lg:text-3xl font-bold" >SBR Week 1 🇿🇼 🇿🇦</h1>

                <p className="text-md lg:text-lg font-medium text-slate-200" >
                    {fixturesEnded ?
                        "Its a wrap up for SBR week 1. Review your game predictions to see what you got right!"
                        : "It's SBR Week 1, Place your vote in, for who you got winning this week!"
                    }
                </p>
                <button onClick={toggle} className="bg-white lg:w-fit text-primary-800 px-4 flex-row justify-center sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2" >
                    {fixturesEnded ? "Review Your Predictions" : "Make Your Predictions"}
                    <ChevronRight size={20} />
                </button>
            </BlueGradientCard>

            {fixtures.length > 0 &&
                <SbrVotingModal
                    fixtures={fixtures}
                    open={showVoting}
                    onClose={toggle}
                />
            }
        </Fragment>
    )
}
