import { PlusCircle, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MyTeamsScreen() {
  const navigate = useNavigate();

  const handleTeamClick = (teamId: string) => {
    navigate(`/my-team/${teamId}`);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-100">My Teams</h1>
      </div>

      <div className="grid gap-4">
        {[
          {
            id: "1",
            name: "Thunder Warriors",
            points: 2456,
            rank: 1,
            players: 7,
            isFavorite: true,
          },
          {
            id: "2",
            name: "Rugby Legends",
            points: 2198,
            rank: 3,
            players: 7,
            isFavorite: false,
          },
        ].map((team) => (
          <div
            key={team.name}
            onClick={() => handleTeamClick(team.id)}
            className="relative flex items-center justify-between p-4 rounded-xl 
              bg-gray-700/20 dark:bg-dark-800/40 hover:bg-gray-700/30 dark:hover:bg-dark-800/60
              transition-all duration-200 backdrop-blur-sm cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleTeamClick(team.id);
              }
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold dark:text-gray-100">
                    {team.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add favorite toggle logic here
                    }}
                    className={`text-gray-400 hover:text-yellow-400 transition-colors ${
                      team.isFavorite ? "text-yellow-400" : ""
                    }`}
                    aria-label={
                      team.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Star
                      size={18}
                      fill={team.isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-400">
                    <Users size={16} className="shrink-0" />
                    <span>{team.players} Players</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-lg font-bold text-primary-400">
                {team.points.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Rank #{team.rank}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
