import { Coins } from "lucide-react";
import { useAtomValue } from "jotai";
import { fantasyTeamValueAtom } from "../my-team/my_team.atoms";

interface TeamStatsProps {
}

export function TeamStats({}: TeamStatsProps) {
  
  // const team = useAtomValue(fantasyTeamAtom);
  // const athletes = useAtomValue(fantasyTeamAthletesAtom);
  const teamValue = useAtomValue(fantasyTeamValueAtom);

  const stats = [
    {
      label: "Team Value",
      value: teamValue,
      icon: Coins,
      format: (value: number) => value.toFixed(0),
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
