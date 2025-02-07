import {
  ChevronRight,
  Users,
  Trophy,
  Award,
  Newspaper,
  PlusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TeamCard } from "../components/TeamCard";
import { LeagueCard } from "../components/LeagueCard";
import { NewsCard } from "../components/NewsCard";

export function DashboardScreen() {
  const navigate = useNavigate();

  const handleJoinLeague = (league: any) => {
    // Store league data in state management solution (e.g., React Context)
    // For now, we'll use URL state
    navigate("/create-team", { state: { league } });
  };

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Weekly Rugby Fantasy Leagues
        </h1>
        <p className="text-lg mb-6 opacity-90">
          Create your dream team and compete in weekly leagues
        </p>
        <button
          onClick={() => navigate("/join-league")}
          className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          Join Weekly League <ChevronRight size={20} />
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Teams Section - Modernized */}
        <div className="col-span-1 lg:col-span-2">
          <div className="dark:bg-gray-800/40 backdrop-blur-sm dark:bg-dark-850/60 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
                <Users size={24} className="text-primary-500" />
                My Teams
              </h2>
              <button
                onClick={() => navigate("/join-league")}
                className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle size={20} />
                New Team
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TeamCard
                name="Thunder Warriors"
                points={2456}
                rank={1}
                players={15}
                isFavorite={true}
              />
              <TeamCard
                name="Rugby Legends"
                points={2198}
                rank={3}
                players={15}
                isFavorite={false}
              />
            </div>
          </div>

          {/* Active Leagues - Modernized */}
          <div className="dark:bg-gray-800/40 backdrop-blur-sm dark:bg-dark-850/60 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
              <Trophy size={24} className="text-primary-500 shrink-0" />
              Active Leagues
            </h2>
            <div className="space-y-4">
              {[
                {
                  id: "1",
                  name: "Premier Weekly",
                  entryFee: "$10",
                  prizePool: "$1,000",
                  players: 128,
                  maxPlayers: 256,
                  status: "live",
                  isPrivate: false,
                },
                {
                  id: "2",
                  name: "Rookie League",
                  entryFee: "Free",
                  prizePool: "$100",
                  players: 64,
                  maxPlayers: 100,
                  status: "joining",
                  isPrivate: false,
                },
              ].map((league) => (
                <div
                  key={league.id}
                  className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl 
                    dark:bg-gray-700/20 dark:bg-dark-800/40 hover:bg-gray-700/30 dark:hover:bg-dark-800/60
                    transition-all duration-200 backdrop-blur-sm"
                >
                  {/* Status Badge - Updated */}
                  <div
                    className={`absolute top-4 right-4 sm:static px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap
                      backdrop-blur-sm transition-colors
                      ${
                        league.status === "live"
                          ? "bg-green-500/20 text-green-400 dark:bg-green-400/10"
                          : "bg-blue-500/20 text-blue-400 dark:bg-blue-400/10"
                      }`}
                  >
                    {league.status === "live" ? "Live" : "Joining"}
                  </div>

                  {/* League Info - Updated */}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <h3 className="text-lg font-semibold mb-2 sm:mb-0 pr-16 sm:pr-0 dark:text-gray-100 truncate">
                      {league.name}
                    </h3>

                    {/* Mobile: Stacked, Desktop: Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-1 sm:mt-1">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-400 whitespace-nowrap">
                        <Users size={16} className="shrink-0" />
                        <span>
                          {league.players}/{league.maxPlayers}
                        </span>
                      </div>
                      <div className="hidden sm:block text-gray-600 dark:text-gray-500">
                        •
                      </div>
                      <div className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                        <Trophy
                          size={16}
                          className="shrink-0 text-gray-400 dark:text-gray-400"
                        />
                        <span className="font-medium text-primary-300">
                          {league.prizePool}
                        </span>
                      </div>
                      {league.entryFee !== "Free" && (
                        <>
                          <div className="hidden sm:block text-gray-600 dark:text-gray-500">
                            •
                          </div>
                          <div className="text-sm text-gray-400 dark:text-gray-400 whitespace-nowrap">
                            Entry: {league.entryFee}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Join Button - Updated */}
                  <button
                    onClick={() => handleJoinLeague(league)}
                    className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2 sm:py-3 
                      bg-gradient-to-r from-primary-500/80 to-primary-600/80 hover:from-primary-500/90 hover:to-primary-600/90
                      text-white font-medium rounded-xl transition-all duration-200 
                      flex items-center justify-center gap-2 shrink-0 mt-3 sm:mt-0
                      backdrop-blur-sm shadow-sm shadow-primary-950/10"
                  >
                    <span className="whitespace-nowrap">Join Now</span>
                    <ChevronRight size={20} className="shrink-0" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          {/* Leaderboard */}
          <div className="bg-white dark:bg-dark-850 rounded-xl shadow-sm dark:shadow-dark-sm p-6 mb-6 border border-gray-200 dark:border-dark">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 dark:text-gray-100">
              <Award size={24} className="text-primary-500" />
              Top Players
            </h2>
            <div className="space-y-4">
              {[
                { name: "John Smith", points: 2856, rank: 1 },
                { name: "Sarah Jones", points: 2754, rank: 2 },
                { name: "Mike Wilson", points: 2698, rank: 3 },
              ].map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        player.rank === 1
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : player.rank === 2
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      }`}
                    >
                      {player.rank}
                    </span>
                    <span className="font-medium dark:text-gray-100">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {player.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* News Feed */}
          <div className="bg-white dark:bg-dark-850 rounded-xl shadow-sm dark:shadow-dark-sm p-6 border border-gray-200 dark:border-dark">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 dark:text-gray-100">
              <Newspaper size={24} className="text-primary-500" />
              Rugby News
            </h2>
            <div className="space-y-4">
              <NewsCard
                title="Top 5 Players to Watch This Week"
                time="2h ago"
                image="https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&q=80&w=300"
              />
              <NewsCard
                title="Weekly League Updates"
                time="4h ago"
                image="https://images.unsplash.com/photo-1512299286776-c18be8ed6a1a?auto=format&fit=crop&q=80&w=300"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
