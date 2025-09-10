import { Trophy } from "lucide-react"
import { FantasyLeagueGroup } from "../../../../types/fantasyLeagueGroups"
import { FantasyLeagueGroupCard } from "../../league_card_small/FantasyLeagueGroupCard"
import { FantasyLeagueGroupHorizontalCard } from "../../league_card_small/FantasyLeagueGroupHorizontalCard"

type Props = {
    joinedLeagues: FantasyLeagueGroup[]
}

export default function OtherLeaguesSection({ joinedLeagues }: Props) {



    return (
        <div className="flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-2" > 
                <Trophy className="" />
                <p className="text-lg font-semibold" >Others Leagues</p>
            </div>

            <div className="flex flex-col gap-4" >
                {joinedLeagues.map((l) => {
                    return (
                        <FantasyLeagueGroupHorizontalCard 
                            leagueGroup={l}
                            key={l.id}
                        />
                    )
                })}
            </div>
        </div>
    )
}
