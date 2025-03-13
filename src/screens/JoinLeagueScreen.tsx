import React, { useState, useEffect } from "react";
import { Users, Lock, Unlock, Plus, Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { leagueService } from "../services/leagueService";
import { IFantasyLeague } from "../types/fantasyLeague";

interface League {
  id: string;
  name: string;
  entryFee: string;
  prizePool: string;
  players: number;
  maxPlayers: number;
  isPrivate: boolean;
}

export function JoinLeagueScreen() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [showPrivateLeagueForm, setShowPrivateLeagueForm] = useState(false);
  const [availableLeagues, setAvailableLeagues] = useState<IFantasyLeague[]>(
    []
  );
  const [currentLeagues, setCurrentLeagues] = useState<IFantasyLeague[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setIsLoading(true);
        const leagues = await leagueService.getAllLeagues();

        // Filter leagues based on is_open status
        const available = leagues.filter(
          (league) => league.is_open && !league.has_ended
        );
        const current = leagues.filter(
          (league) => !league.is_open || league.has_ended
        );

        setAvailableLeagues(available);
        setCurrentLeagues(current);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch leagues:", err);
        setError("Failed to load leagues. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const handleJoinLeague = (league: IFantasyLeague) => {
    navigate(`/${league.official_league_id}/create-team`, {
      state: { league },
    });
  };

  const handleViewLeague = (league: IFantasyLeague) => {
    navigate(`/league/${league.id}`, { state: { league } });
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper function to format entry fee
  const formatEntryFee = (fee: number | null): string => {
    if (fee === null || fee === 0) return "Free";
    return `$${fee}`;
  };

  // Helper function to format prize pool
  const formatPrizePool = (league: IFantasyLeague): string => {
    if (league.reward_description) return league.reward_description;
    return league.reward_type === "cash"
      ? `$${league.entry_fee || 0 * 10}`
      : "N/A";
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-100">Leagues</h1>

        {/* League Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowPrivateLeagueForm(true)}
            className="flex font-bold items-center justify-center gap-2 bg-primary-600 text-white px-6 py-4 rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            Create Private League
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter league code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border border-gray-200 dark:border-dark-600 dark:bg-dark-850 dark:text-gray-100 dark:placeholder-gray-400 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading leagues...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Current Leagues */}
        {/* {!isLoading && currentLeagues.length > 0 && (
          <div className="space-y-4 mb-10">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
              Current Leagues
            </h2>
            {currentLeagues.map((league) => (
              <div
                key={league.id}
                className="bg-white dark:bg-dark-800/40 rounded-xl p-6 hover:border-primary-600 dark:hover:border-primary-500 transition-all shadow-sm dark:shadow-dark-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold dark:text-gray-100">
                        {league.title}
                      </h3>
                      {league.is_private ? (
                        <Lock
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      ) : (
                        <Unlock
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users size={16} />
                      <span>
                        {/* We don't have player count in the API response */
        /*}
                        {league.duration_type} league
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {league.reward_type === "cash" ? "Prize Pool" : "Reward"}
                    </div>
                    <div className="font-semibold text-green-600 dark:text-green-500">
                      {formatPrizePool(league)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewLeague(league)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-1"
                  >
                    View League
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )} */}

        {/* Available Leagues */}
        {!isLoading && availableLeagues.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
              Available Leagues
            </h2>
            {availableLeagues.map((league) => (
              <div
                key={league.id}
                className="bg-white dark:bg-dark-800/40 rounded-xl p-6 hover:border-primary-600 dark:hover:border-primary-500 transition-all shadow-sm dark:shadow-dark-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold dark:text-gray-100">
                        {league.title}
                      </h3>
                      {league.is_private ? (
                        <Lock
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      ) : (
                        <Unlock
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users size={16} />
                      <span>{league.duration_type} league</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {league.reward_type === "cash" ? "Prize Pool" : "Reward"}
                    </div>
                    <div className="font-semibold text-green-600 dark:text-green-500">
                      {formatPrizePool(league)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinLeague(league)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-1"
                  >
                    Join Now
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Leagues Available */}
        {!isLoading &&
          availableLeagues.length === 0 &&
          currentLeagues.length === 0 &&
          !error && (
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">
                No leagues available at the moment.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}
