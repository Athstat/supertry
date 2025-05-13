import { Team } from "../../types/team";
import { Trophy, Award, Calendar } from "lucide-react";

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
      icon: Trophy,
      format: (value: number) => value.toFixed(1),
      color: "text-primary-700 dark:text-primary-500",
    },

    {
      label: "Average Price",
      value:
        team.players.reduce((acc, player) => acc + player.price, 0) /
        team.players.length,
      icon: Award,
      format: (value: number) => value.toFixed(0),
      color: "text-primary-700 dark:text-primary-500",
    },
    
    {
      label: "Matches Played",
      value: team.matchesPlayed || 0, // Assuming this property exists in team object
      icon: Calendar,
      format: (value: number) => value.toString(),
      color: "text-primary-700 dark:text-primary-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-100 dark:bg-dark-800/40 rounded-xl p-4 flex items-center"
        >
          <stat.icon size={30} className={stat.color} />
          <div className="flex ml-3 mb-1 flex-col">
            <span className="text-sm text-gray-600 dark:text-white">
              {stat.label}
            </span>
            <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
              {stat.format(stat.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
