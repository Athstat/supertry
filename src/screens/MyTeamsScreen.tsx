import React, { useEffect, useState } from "react";
import { PlusCircle, Users, Loader, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { fantasyTeamService } from "../services/fantasyTeamService";
import useSWR from "swr";
import { MyTeamsListCard } from "../components/my-team/list/MyTeamListCard";

export function MyTeamsListScreen() {
  
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
        <NoTeamsMessage />
      ) : (
        <div className="space-y-4">
          {userTeams.map((team) => {
            return <MyTeamsListCard team={team} />
          })}
        </div>
      )}
    </main>
  );
}

function NoTeamsMessage() {

  const navigate = useNavigate();

  return (
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
  )
}