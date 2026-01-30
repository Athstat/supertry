import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import SecondaryText from "../../ui/typography/SecondaryText";
import RoundedCard from "../../ui/cards/RoundedCard";
import { abbreviateSeasonName } from "../../../utils/stringUtils";
import CommissionerZone from "./CommissionerZone";
import { Fragment, useState } from "react";
import { Toast } from "../../ui/Toast";

/** Renders a fantasy league details tab */
export default function FantasyLeagueDetailsTab() {

  const [message, setMessage] = useState<string>();
  const { league } = useFantasyLeagueGroup();

  const membersCount = league?.members_count || '-';
  const leagueType = league?.is_private ? 'Private' : 'Public';

  const handleCopyJoinCode = () => {
    if (league?.entry_code) {
      navigator.clipboard.writeText(league?.entry_code);
      setMessage('League join code was coppied to your clipboard');
    }
  }

  return (
    <Fragment>
      <div className="flex flex-col gap-6 px-4 mt-5" >

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold" >League Details</p>
            <SecondaryText>{league?.description}</SecondaryText>
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

            <RoundedCard onClick={handleCopyJoinCode} className="p-2 cursor-pointer w-full flex-1 flex flex-col items-center justify-center" >
              <SecondaryText className="text-xs" >Join Code</SecondaryText>
              <p className="text-sm" >{league?.entry_code}</p>
            </RoundedCard>
          </div>
        </div>


        <CommissionerZone />
      </div>

      {message && (
        <Toast 
          message={message}
          isVisible={Boolean(message)}
          onClose={() => setMessage(undefined)}
          type="success"
        />
      )}
    </Fragment>
  )
}
