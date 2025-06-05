import React, { useEffect, useState } from "react";
import { PlusCircle, Users, Loader, Trophy, Zap, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { fantasyTeamService } from "../services/fantasyTeamService";
import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../types/fantasyTeamAthlete";
import { leagueService } from "../services/leagueService";
import { useFetch } from "../hooks/useFetch";
import useSWR from "swr";
import PillTag from "../components/shared/PillTap";
import PlayerMugshot from "../components/shared/PlayerMugshot";
import PlayerMugshotPlayerHolder from "../components/player/PlayerMugshotPlayerHolder";

export function MyTeamsListScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamCreated, teamName } = location.state || {};

  const { data: userTeamsData, isLoading, error } = useSWR("user-fantasy-teams", () => fantasyTeamService.fetchUserTeams());

  const userTeams = (userTeamsData ?? [])
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

  const [showSuccessToast, setShowSuccessToast] = useState(
    Boolean(teamCreated)
  );

  useEffect(() => {


    // const sortedTeams = [...(userTeams)].sort((a, b) => {
    //   const dateA = new Date(a.created_at || 0).getTime();
    //   const dateB = new Date(b.created_at || 0).getTime();
    //   return dateB - dateA; // Descending order (newest first)
    // });

    // setTeams(sortedTeams);


    // Auto-hide success toast after 5 seconds
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="container mx-auto px-4 flex flex-col gap-8 sm:px-6 py-6 max-w-3xl">
      <div className="flex flex-row items-center gap-2 dark:text-gray-100">
        <Shield />
        <h1 className="text-2xl lg:text-3xl font-bold">My Teams</h1>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-3 rounded-lg shadow-md flex items-center gap-2 animate-fade-in">
          <div className="w-6 h-6 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span>Team "{teamName}" successfully created!</span>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="ml-2 text-green-800 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : userTeams.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Users className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
            No Teams Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't created any fantasy teams yet.
          </p>
          <button
            onClick={() => navigate("/leagues")}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all"
          >
            <PlusCircle size={20} />
            Join a League
          </button>
        </div>
      ) : (
        <div className="">
          <div className="space-y-4">
            {userTeams.map((team) => {
              return <MyTeamCard
                team={team}
              />
            })}
          </div>
        </div>
      )}
    </main>
  );
}


type MyTeamCardProps = {
  team: IFantasyClubTeam
}

function MyTeamCard({ team }: MyTeamCardProps) {

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

      <h3 className="text-xl font-semibold dark:text-gray-100">
        {team.name}
      </h3>

      <div className="flex flex-row items-center flex-wrap gap-2" >

        {league ?
          (<PillTag className="flex gap-1 flex-row items-center justify-start" >
            <Trophy className="text-orange-500 w-3 h-3" />
            <p className="dark:text-slate-400 text-sm text-slate-700" >{league.title}</p>
          </PillTag>) : null
        }


        {totalPoints ? (<PillTag className="text-sm flex flex-row items-center gap-1.5 text-gray-400">
          <Zap size={16} />
          Points {totalPoints.toFixed(0)}
        </PillTag>) : null}

        <PillTag className="text-sm flex flex-row items-center gap-1.5 text-gray-400">
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