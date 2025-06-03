import { Coins, Trophy } from "lucide-react";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { calculateAveragePr } from "../../utils/athleteUtils";
import { fantasyTeamValueAtom, remainingTeamBudgetAtom, fantasyTeamAthletesAtom } from "../../state/myTeam.atoms";

type Props = {

}

export function FantasyTeamStats({ }: Props) {


  const teamValue = useAtomValue(fantasyTeamValueAtom);
  const remainingBudget = useAtomValue(remainingTeamBudgetAtom);
  const athletes = useAtomValue(fantasyTeamAthletesAtom);

  const avaragePr = useMemo(() => {
    return calculateAveragePr(athletes);
  }, [athletes]);

  const stats = [
    {
      label: "Avarage PR",
      value: avaragePr,
      icon: Trophy,
      format: (value: number) => value.toFixed(1),
      color: "text-primary-700 dark:text-primary-500",
    },

    {
      label: "Team Value",
      value: teamValue,
      icon: Coins,
      format: (value: number) => value.toFixed(0),
      color: "text-primary-700 dark:text-primary-500",
    },

    {
      label: "Remaining Budget",
      value: remainingBudget,
      icon: Coins,
      format: (value: number) => value.toFixed(0),
      color: "text-primary-700 dark:text-primary-500",
    }

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
