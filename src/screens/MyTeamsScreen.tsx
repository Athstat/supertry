import { PlusCircle, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MyTeamsScreen() {
  const navigate = useNavigate();

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
          <Users size={24} className="text-primary-500" />
          My Teams
        </h2>
        <button
          onClick={() => navigate("/join-league")}
          className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          <PlusCircle size={20} />
          <span>New Team</span>
        </button>
      </div>

      <div className="grid gap-4">
        {[
          {
            name: "Thunder Warriors",
            points: 2456,
            rank: 1,
            players: 15,
            isFavorite: true,
          },
          {
            name: "Rugby Legends",
            points: 2198,
            rank: 3,
            players: 15,
            isFavorite: false,
          },
        ].map((team) => (
          <div
            key={team.name}
            className="relative flex items-center justify-between p-4 rounded-xl 
              bg-gray-700/20 dark:bg-dark-800/40 hover:bg-gray-700/30 dark:hover:bg-dark-800/60
              transition-all duration-200 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold dark:text-gray-100">
                    {team.name}
                  </h3>
                  <button
                    className={`text-gray-400 hover:text-yellow-400 transition-colors ${
                      team.isFavorite ? "text-yellow-400" : ""
                    }`}
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
