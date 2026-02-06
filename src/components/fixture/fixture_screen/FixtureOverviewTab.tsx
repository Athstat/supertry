import { Calendar, Info, Trophy } from "lucide-react"
import { IFixture } from "../../../types/games"
import { MapPin } from "lucide-react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import GameHighlightsCard from "../../ui/video/GameHighlightsCard"
import { FixtureVotingCard } from "../../pickem/voting/FixtureVotingCard"
import PastMatchupsCard from "./PastMatchupsCard"
import PreFixtureForm from "./PreFixtureForm"
import FixturePotmCard from "./FixturePotmCard"
import RoundedCard from "../../ui/cards/RoundedCard"

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
                className="flex dark:border-none flex-col gap-2 p-3 px-4 text-xs"
            >

                {fixture.competition_name && (
                    <div onClick={goToCompetitionScreen} className="flex hover:underline flex-row gap-2 items-center justify-start" >
                        <Trophy className="w-4 h-4" />
                        <p>{fixture.competition_name}</p>
                    </div>
                )}

                {fixture.kickoff_time && <div className="flex flex-row gap-2 items-center justify-start" >
                    <Calendar className="w-4 h-4" />
                    <p>{format(fixture.kickoff_time, "EEEE d MMMM yyyy")} ᐧ {format(fixture.kickoff_time, "HH:mm")}</p>
                </div>}

                {fixture.venue && <div className="flex flex-row gap-2 items-center justify-start" >
                    <MapPin className="w-4 h-4" />
                    <p>{fixture.venue}</p>
                </div>}

                {fixture.extra_info && <div className="flex flex-row gap-2 items-center justify-start" >
                    <Info className="w-4 h-4" />
                    <p>{fixture.extra_info}</p>
                </div>}

            </RoundedCard>

            <GameHighlightsCard link={fixture.highlights_link} />

            <FixtureVotingCard fixture={fixture} />
            
            <FixturePotmCard 
                fixture={fixture}
            />

            <PreFixtureForm
                fixture={fixture}
            />

            <PastMatchupsCard
                fixture={fixture}
            />


        </div>
    )
}
