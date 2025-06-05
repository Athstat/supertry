import { motion } from "framer-motion";
import { Trophy, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useFetch } from "../../../hooks/useFetch";
import { fantasyTeamService } from "../../../services/fantasyTeamService";
import { leagueService } from "../../../services/leagueService";
import { IFantasyClubTeam, IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import PillTag from "../../shared/PillTap";
import PlayerMugshot from "../../shared/PlayerMugshot";

type Props = {
  team: IFantasyClubTeam
}

/** Renders my team list single team card */
export function MyTeamsListCard({ team }: Props) {

  const { data: league } = useFetch(
    "fantasy-leagues",
    team.league_id ?? 0,
    leagueService.getLeagueById
  )

  const navigate = useNavigate();
  const { data: teamAthletes, isLoading: loadingAthletes } = useSWR(`fantasy-team-athletes/${team.id}`, () => fantasyTeamService.fetchTeamAthletes(team.id));

  const handleTeamClick = (teamId: string) => {
    const athletes = teamAthletes ?? [];

    navigate(`/my-team/${teamId}`, {
      state: {
        team,
        athletes,
      },
    });
  };

  const totalPoints = teamAthletes?.reduce((sum, a) => {
    return sum + (a.score ?? 0);
  }, 0) || 0;

  return (
    <motion.div
      key={team.id}
      onClick={() => handleTeamClick(team.id)}
      className="relative flex flex-col justify-between p-4 rounded-xl gap-2
                  bg-gray-50 dark:bg-dark-800/40 hover:dark:bg-slate-800/60 border border-gray-100 dark:border-gray-700
                  cursor-pointer hover:shadow-md transition-shadow"
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 },
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleTeamClick(team.id);
        }
      }}
    >

      <h3 className="text-lg md:text-xl font-semibold dark:text-gray-100">
        {team.name}
      </h3>

      <div className="flex flex-row items-center flex-wrap gap-2" >

        {league ?
          (<PillTag className="flex gap-1 flex-row items-center justify-start" >
            <Trophy className="text-orange-500 w-3 h-3" />
            <p className="dark:text-slate-400 text-xs md:text-sm text-slate-700" >{league.title}</p>
          </PillTag>) : null
        }


        {totalPoints ? (<PillTag className="text-xs md:text-sm flex flex-row items-center gap-1.5 text-gray-400">
          <Zap size={16} />
          <p className="" >Points {totalPoints.toFixed(0)}</p>
        </PillTag>) : null}

        <PillTag className="text-xs md:text-sm flex flex-row items-center gap-1.5 text-gray-400">
          <Trophy size={16} />
          {team.rank ? `Rank #${team.rank}` : "Not ranked yet"}
        </PillTag>

      </div>


      <div className="flex flex-col items-end gap-1">
        <div className="text-lg font-bold text-primary-400">
          {/* {team} */}
        </div>

      </div>  

      {loadingAthletes && <div className="w-14 h-full rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" ></div>}
      {teamAthletes && <MyTeamAthletesRow athletes={teamAthletes} />}
    </motion.div>
  )
}

type AthletesRowProps = {
  athletes: IFantasyTeamAthlete[],
  handleClick?: () => void
}

function MyTeamAthletesRow({ athletes }: AthletesRowProps) {
  return (
    <div className="relative overflow-hidden">
      {/* <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-slate-800/40 to-transparent"></div> */}
      {/* <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-slate-800/0 to-transparent"></div> */}

      <div className="overflow-x-auto whitespace-nowrap scroll-smooth space-x-4 flex">
        {athletes.map((a) => {
          return (
            <div key={a.tracking_id} className="items-center flex flex-col gap-1" >
              <PlayerMugshot 
                playerPr={a.power_rank_rating}
                showPrBackground
                url={a.image_url} 
              />
              {/* <p className="text-xs truncate dark:text-slate-400" >{a.score?.toFixed(1)}</p> */}
            </div>
          )
        })}
      </div>

      {/* <div>
        <ChevronRight className="dark:text-primary-500" />
      </div> */}
    </div>


  )
}