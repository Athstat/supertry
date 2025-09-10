import { ArrowRight, Globe } from "lucide-react"
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup"
import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups"
import FantasyLeagueGroupDataProvider from "../../fantasy-league/providers/FantasyLeagueGroupDataProvider"
import SecondaryText from "../../shared/SecondaryText"

type Props = {
  leagueGroup: FantasyLeagueGroup
}

/** Renders the showcase league section */
export default function ShowcaseLeagueSection({ leagueGroup }: Props) {



  return (
    <FantasyLeagueGroupDataProvider leagueId={leagueGroup.id} >
      <Content />
    </FantasyLeagueGroupDataProvider>
  )
}

function Content() {

  const {league, currentRound} = useFantasyLeagueGroup();

  if (!league) return;

  return (
    <div>
      <div className="flex flex-row items-center gap-2 justify-between" >

        <div>
          <div className="flex flex-row items-center gap-1" >
            <Globe className='' />
            <p className="font-semibold text-lg" >{league.title}</p>
          </div>
          <SecondaryText>{currentRound?.title}</SecondaryText>
        </div>
        
        <div>
          <button>
            <ArrowRight className="" />
          </button>
        </div>
      </div>
    </div>
  )
}