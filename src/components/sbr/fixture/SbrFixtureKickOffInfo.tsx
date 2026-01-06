import { format } from "date-fns";
import { Calendar, Trophy, Watch } from "lucide-react";
import { ISbrFixture } from "../../../types/sbr";
import RoundedCard from "../../shared/RoundedCard";
import NoContentCard from "../../ui/typography/NoContentMessage";
import SbrFixturePredictionBox from "../predictions/SbrFixturePredictionBox";

type Props = {
    fixture: ISbrFixture
}

export default function SbrFixtureKickOffInfo({ fixture }: Props) {

    const { kickoff_time, season } = fixture;
    const isNoKickoffInfo = season === undefined && kickoff_time === undefined

    return (
        <div className="flex flex-col gap-4" >
            <RoundedCard className="p-4 flex flex-col gap-2" >

                <h1 className="text-md font-bold" >Kick Off</h1>

                { kickoff_time && <div className="flex flex-row items-center mt-3 gap-2" >
                    <Watch className="text-blue-500" />
                    {kickoff_time && <p>{format(kickoff_time, "hh:mm a")}</p>}
                </div>}

                {kickoff_time && <div className="flex flex-row items-center gap-2" >
                    <Calendar className="text-blue-500" />
                    {kickoff_time && <p>{format(kickoff_time, "EEEE dd MMMM yyyy")}</p>}
                </div>}

                { season && <div className="flex flex-row items-center gap-2" >
                    <Trophy className="text-blue-500" />
                    <p>{season}</p>
                </div>}

                {isNoKickoffInfo && (
                    <NoContentCard message="No Kickoff Information Available" />
                )}
            </RoundedCard>


            <SbrFixturePredictionBox 
                fixture={fixture}
            />
        </div>
    )
}
