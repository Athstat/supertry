import { useState, useEffect } from "react";
import {
  Trophy,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  History,
} from "lucide-react";
import { rankingsData } from "../data/rankings";

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

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Top Section */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-2xl shadow-sm p-6 mb-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white blur-2xl" />
          <div className="absolute -left-4 -bottom-8 w-32 h-32 rounded-full bg-white blur-2xl" />
        </div>

        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                DIVISION
                <span className="text-xl px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                  #{currentDivision.id}
                </span>
              </h2>
              <p className="text-primary-100 font-medium">{timeUntilReset}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">#2</div>
            <div className="text-primary-100">Your Rank</div>
          </div>
        </div>
      </div>

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
