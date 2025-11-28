import { Calendar, Info, Trophy } from "lucide-react"
import { IFixture } from "../../../types/games"
import { MapPin } from "lucide-react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import GameHighlightsCard from "../../video/GameHighlightsCard"
import RoundedCard from "../../shared/RoundedCard"
import { FixtureVotingCard } from "../voting/FixtureVotingCard"
import PastMatchupsCard from "./PastMatchupsCard"
import PreFixtureForm from "./PreFixtureForm"

type Props = {
    fixture: IFixture
}

/** Renders fixture overview tab */
export default function FixtureOverviewTab({ fixture }: Props) {

    const navigate = useNavigate();

    const goToCompetitionScreen = () => {
        navigate(`/seasons/${fixture.league_id}`);
    }

    return (

        <div className="flex flex-col gap-6" >
            <RoundedCard
                className="flex dark:border-none flex-col gap-2 p-4 text-sm"
            >

                {/* <div>
                    <h2>Kick Off</h2>
                </div> */}

                {fixture.competition_name && (
                    <div onClick={goToCompetitionScreen} className="flex hover:underline flex-row gap-2 items-center justify-start" >
                        <Trophy className="w-5 h-5" />
                        <p>{fixture.competition_name}</p>
                    </div>
                )}

                {fixture.kickoff_time && <div className="flex flex-row gap-2 items-center justify-start" >
                    <Calendar className="w-5 h-5" />
                    <p>{format(fixture.kickoff_time, "EEEE MMMM yyyy")} ᐧ {format(fixture.kickoff_time, "HH:mm")}</p>
                </div>}

                {fixture.venue && <div className="flex flex-row gap-2 items-center justify-start" >
                    <MapPin className="w-5 h-5" />
                    <p>{fixture.venue}</p>
                </div>}

                {fixture.extra_info && <div className="flex flex-row gap-2 items-center justify-start" >
                    <Info className="w-5 h-5" />
                    <p>{fixture.extra_info}</p>
                </div>}

            </RoundedCard>



            <GameHighlightsCard link={fixture.highlights_link} />

            <FixtureVotingCard fixture={fixture} />


            <PreFixtureForm
                fixture={fixture}
            />

            <PastMatchupsCard
                fixture={fixture}
            />


        </div>
    )
}
