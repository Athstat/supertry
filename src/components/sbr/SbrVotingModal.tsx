import { useState } from "react"
import { ISbrFixture } from "../../types/sbr"
import DialogModal from "../shared/DialogModal"
import SbrTeamLogo from "./SbrTeamLogo"
import { format } from "date-fns"

type Props = {
    className?: string,
    fixtures: ISbrFixture[],
    open?: boolean
}

export default function SbrVotingModal({ className, fixtures, open }: Props) {
    
    const [currentGame, setCurrentGame] = useState<ISbrFixture | undefined>(() => {
        if (fixtures.length !== 0) return fixtures[0]
        else return undefined 
    });


    
    return (
        <DialogModal open={true} title="SBR Week 1 ">
            {currentGame && <FixtureVotingCard fixture={currentGame} />}
        </DialogModal>
    )
}

type FixtureVotingCardProps = {
    fixture: ISbrFixture
}

function FixtureVotingCard({ fixture } : FixtureVotingCardProps) {
    
    const {kickoff_time} = fixture;
    
    
    return (
        <div>
            <div className="flex flex-row items-center" >
                <div className="items-center justify-center text-center flex flex-col flex-1 gap-2" >
                    <SbrTeamLogo className="w-20 h-20" />
                    <p className="text-md" >{fixture.home_team}</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-slate-400" >
                    <p>{kickoff_time && format(kickoff_time, "hh:mm a")}</p>
                    <p>{kickoff_time && format(kickoff_time, "EE dd MMM")}</p>
                </div>

                <div className="items-center  justify-center text-center flex flex-col flex-1 gap-2" >
                    <SbrTeamLogo className="w-20 h-20" />
                    <p className="text-md" >{fixture.away_team}</p>
                </div>
            </div>
        </div>
    )
}
