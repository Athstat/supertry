import { Calendar, Sparkles, Trophy } from "lucide-react"
import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { MapPin } from "lucide-react"
import { format } from "date-fns"
import { Watch } from "lucide-react"
import { useNavigate } from "react-router-dom"

type Props = {
    fixture: IFixture
}

export default function FixtureScreenOverview({ fixture }: Props) {

    const navigate = useNavigate();

    const goToCompetitionScreen = () => {
        navigate(`/seasons/${fixture.league_id}`);   
    }

    return (
        <TitledCard
            title="Kickoff"
            className="flex flex-col gap-3"
        >

            {fixture.competition_name && <button onClick={goToCompetitionScreen} className="flex hover:underline flex-row gap-2 items-center justify-start" >
                <Trophy className="text-blue-500" />
                <p>{fixture.competition_name}</p>
            </button>}

            {fixture.venue && <div className="flex flex-row gap-2 items-center justify-start" >
                <MapPin className="text-blue-500" />
                <p>{fixture.venue}</p>
            </div>}

            {fixture.extra_info && <div className="flex flex-row gap-2 items-center justify-start" >
                <Sparkles className="text-blue-500" />
                <p>{fixture.extra_info}</p>
            </div>}

            {fixture.kickoff_time && <div className="flex flex-row gap-2 items-center justify-start" >
                <Calendar className="text-blue-500" />
                <p>{format(fixture.kickoff_time, "EEEE MMMM yyyy")}</p>
            </div>}

            {fixture.kickoff_time && <div className="flex flex-row gap-2 items-center justify-start" >
                <Watch className="text-blue-500" />
                <p>{format(fixture.kickoff_time, "h:mm a")}</p>
            </div>}


        </TitledCard>
    )
}
