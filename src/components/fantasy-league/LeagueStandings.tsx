import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import { FantasyLeagueGroupMember } from "../../types/fantasyLeagueGroups";
import { Table2, User } from "lucide-react";
import {  } from "lucide-react";
import SecondaryText from "../shared/SecondaryText";


export function LeagueStandings() {

  const { members, userMemberRecord } = useFantasyLeagueGroup();

  // const userTeamRef = useRef<HTMLTableRowElement>(null);
  // const tableRef = useRef<HTMLDivElement>(null);

  // const ROW_HEIGHT = 64;
  // const HEADER_HEIGHT = 56;
  // const TABLE_HEIGHT = ROW_HEIGHT * 6 + HEADER_HEIGHT + 100;

  // Handle team row click
  return (
    <div className="flex flex-col gap-4" >

      <div className="flex flex-row items-center justify-between" >
        
        <div className="flex flex-row items-center gap-2" >
          <Table2 />
          <p className="font-bold text-xl" >Standings</p>
        </div>

        <div>
          {/* <PrimaryButton>
            <Plus className="w-4 h-4" />
            Invite
          </PrimaryButton> */}
        </div>

      </div>

      <div className="flex flex-row items-center p-3 justify-between" >
        
        <div className="flex flex-row items-center gap-2" >
          <SecondaryText className="text-md w-10" >Rank</SecondaryText>
          <SecondaryText className="text-md" >Manager</SecondaryText>
        </div>

        <div>
          <SecondaryText className="text-md" >Points</SecondaryText>
        </div>

      </div>
      {members.map((member, index) => {
        return <LeagueStandingsRow
          member={member}
          key={index}
          index={index}
          isUser={userMemberRecord?.user_id === member.user_id}
        />
      })}

      <div>
        {/* {isMember && <PrimaryButton onClick={handleShare} className="" >
          <Plus className="w-4 h-4" />
          <p>Invite</p>
        </PrimaryButton>} */}
      </div>
      
    </div>
  );
}

type StandingsProps = {
  member: FantasyLeagueGroupMember,
  index: number,
  isUser?: boolean
}

function LeagueStandingsRow({member, index, isUser } : StandingsProps) {


  return (
    <div className="flex flex-row rounded-xl cursor-pointer hover:bg-slate-200 hover:dark:bg-slate-800/60  p-3 items-center gap-2 justify-between" >

      <div className="flex flex-row items-center gap-2" >
        <p className="w-10" >{index + 1}</p>

        {isUser && <div className=" w-6 h-6 bg-blue-500 rounded-xl flex flex-col items-center justify-center" >
          <User className="w-4 h-4 text-white" />
        </div>}

        <div>
          <p>{member.user.username ?? member.user.first_name}</p>
          {/* <p>{member.user.first_name}</p> */}
        </div>

      </div>

      <div>
        <p>-</p>
      </div>
    </div>
  )
}