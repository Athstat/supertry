import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import SecondaryText from "../../ui/typography/SecondaryText";
import RoundedCard from "../../ui/cards/RoundedCard";
import { abbreviateSeasonName } from "../../../utils/stringUtils";
import CommissionerZone from "./CommissionerZone";

/** Renders a fantasy league details tab */
export default function FantasyLeagueDetailsTab() {

  const { league, members } = useFantasyLeagueGroup();

  const membersCount = members.length;
  const leagueType = league?.is_private ? 'Private' : 'Public';

  return (
    <div className="flex flex-col gap-6 px-4" >

      <div className="flex flex-col gap-2">
        <div>
          <p className="font-bold" >League Details</p>
        </div>

        <div className="grid grid-cols-2 gap-2" >
          <RoundedCard className="p-2 w-full flex-1 flex flex-col items-center justify-center" >
            <SecondaryText className="text-xs" >Members</SecondaryText>
            <p className="text-sm" >{membersCount}</p>
          </RoundedCard>

          <RoundedCard className="p-2 w-full flex-1 flex flex-col items-center justify-center" >
            <SecondaryText className="text-xs" >Type</SecondaryText>
            <p className="text-sm" >{leagueType}</p>
          </RoundedCard>

          <RoundedCard className="p-2 w-full flex-1 flex flex-col items-center justify-center" >
            <SecondaryText className="text-xs" >Competition</SecondaryText>
            <p className="text-sm" >{abbreviateSeasonName(league?.season.name || '')}</p>
          </RoundedCard>

          <RoundedCard className="p-2 w-full flex-1 flex flex-col items-center justify-center" >
            <SecondaryText className="text-xs" >Entry Code</SecondaryText>
            <p className="text-sm" >{league?.entry_code}</p>
          </RoundedCard>
        </div>
      </div>


      <CommissionerZone />
    </div>
  )
}
