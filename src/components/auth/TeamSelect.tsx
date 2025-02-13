import { useState } from "react";
import { Search, Check } from "lucide-react";
import { Team } from "../../types/auth";

interface TeamSelectProps {
  value?: Team;
  onChange: (team: Team) => void;
}

export function TeamSelect({ value, onChange }: TeamSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // This would typically come from an API or config
  const teams: Team[] = [
    {
      id: "1",
      name: "All Blacks",
      logo: "https://i.pinimg.com/474x/f7/7b/6d/f77b6da78dc7323743767ae5906b5038.jpg",
      code: "NZL",
    },
    {
      id: "2",
      name: "South Africa",
      logo: "https://www.sarugby.co.za/media/wcpf3msd/01-sa-rugby_rgb_gold-1.png",
      code: "SA",
    },
    // Add more teams...
  ];

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <button
            key={team.id}
            type="button"
            onClick={() => onChange(team)}
            className={`relative p-4 border-2 rounded-xl transition-all ${
              value?.id === team.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700"
            }`}
          >
            {value?.id === team.id && (
              <div className="absolute top-2 right-2">
                <Check className="h-5 w-5 text-primary-500" />
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              <img
                src={team.logo}
                alt={team.name}
                className="w-16 h-16 object-contain"
              />
              <span className="text-sm font-medium text-center dark:text-gray-100">
                {team.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
