import { useState} from "react";
import {
  Trophy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { rankingsData } from "../data/rankings";
import React from "react";
import useSWR from "swr";
import { userRankingsService } from "../services/userRankingsService";
import { LoadingState } from "../components/ui/LoadingState";
import { authService } from "../services/authService";
import { useAuthUser } from "../hooks/useAuthUser";
import UserRankingCard from "../components/rankings/UserRankingCard";

interface Player {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  avatar: string;
  points: number;
  isCurrentUser?: boolean;
}

interface Division {
  id: number;
  name: string;
  players: Player[];
}

export function RankingsScreen() {
  const [timeUntilReset, setTimeUntilReset] = useState("6d 23h 59m");
  const [currentDivision, setCurrentDivision] = useState(rankingsData[0]);

  const authUser = useAuthUser();

  // const {data: rankings, isLoading: rankingsLoading} = useSWR([1, 15], userRankingsService.getUserRankings);
  const {data: authUserRank, isLoading: userRankingLoading} = useSWR(authUser.id, userRankingsService.getUserRankingByUserId);

  const getRankChangeIcon = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    }
    if (current > previous) {
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const isInPromotionZone = (rank: number) => rank <= 5;
  const isInDemotionZone = (rank: number) => rank >= 11;

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (userRankingLoading) return <LoadingState  />

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Top Section */}
      
      <UserRankingCard />

      {/* Leaderboard */}
      <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="">
          {currentDivision.players.map((player, index) => (
            <>
              {index === 5 && (
                <div className="px-4 py-2">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2">
                    <ArrowUp className="w-4 h-4 stroke-[3]" />
                    Promotion Zone
                    <ArrowUp className="w-4 h-4 stroke-[3]" />
                  </p>
                </div>
              )}
              {index === 10 && (
                <div className="px-4 py-2">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center justify-center gap-2">
                    <ArrowDown className="w-4 h-4 stroke-[3]" />
                    Demotion Zone
                    <ArrowDown className="w-4 h-4 stroke-[3]" />
                  </p>
                </div>
              )}
              <div
                key={player.id}
                className={`flex items-center p-4 ${
                  player.isCurrentUser
                    ? "bg-primary-50 dark:bg-primary-600/10"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/10"
                } ${
                  isInPromotionZone(player.rank)
                    ? "border-l-4 !border-l-green-500"
                    : isInDemotionZone(player.rank)
                    ? "border-l-4 !border-l-red-500"
                    : ""
                }`}
              >
                <div className="w-12 text-center">
                  <span
                    className={`font-semibold ${
                      player.rank === 1
                        ? "text-yellow-500"
                        : player.rank === 2
                        ? "text-gray-400"
                        : player.rank === 3
                        ? "text-amber-600"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {player.rank}
                  </span>
                </div>
                <div className="w-8">
                  {getRankChangeIcon(player.rank, player.previousRank)}
                </div>
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 ml-3">
                  <div className="font-medium dark:text-gray-100">
                    {player.name}
                  </div>
                </div>
                <div className="text-right font-semibold text-primary-600 dark:text-primary-400">
                  {player.points.toLocaleString()}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      {/* Bottom Section */}
      <div className="mt-6 space-y-4 mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Top 5 players will be promoted to Division {currentDivision.id - 1}.
          Bottom 5 players will be demoted to Division {currentDivision.id + 1}.
        </p>
      </div>
    </main>
  );
}
