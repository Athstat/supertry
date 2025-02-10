import React from "react";
import { Team } from "../../types/team";
import { TrendingUp, Award, Users } from "lucide-react";

interface TeamStatsProps {
  team: Team;
}

export function TeamStats({ team }: TeamStatsProps) {
  const stats = [
    {
      label: "Average PR",
      value:
        team.players.reduce((acc, player) => acc + player.form, 0) /
        team.players.length,
      icon: TrendingUp,
      format: (value: number) => value.toFixed(1),
      color: "text-green-500",
    },
    {
      label: "Average Points",
      value:
        team.players.reduce((acc, player) => acc + player.points, 0) /
        team.players.length,
      icon: Award,
      format: (value: number) => value.toFixed(0),
      color: "text-indigo-500",
    },
    {
      label: "Squad Value",
      value: team.players.reduce((acc, player) => acc + player.price, 0),
      icon: Users,
      format: (value: number) => `$${value.toFixed(1)}M`,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-dark-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-dark-600"
        >
          <div className="flex items-center justify-between sm:justify-start sm:gap-2 mb-1 sm:mb-2">
            <stat.icon size={16} className={stat.color} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold dark:text-gray-100">
            {stat.format(stat.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
