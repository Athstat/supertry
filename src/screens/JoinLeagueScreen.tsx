import React, { useState } from "react";
import { Users, Lock, Unlock, Plus, Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const availableLeagues: League[] = [
    {
      id: "1",
      name: "Premier Weekly",
      entryFee: "$10",
      prizePool: "$1,000",
      players: 128,
      maxPlayers: 256,
      isPrivate: false,
    },
    {
      id: "2",
      name: "Rookie League",
      entryFee: "Free",
      prizePool: "$100",
      players: 64,
      maxPlayers: 100,
      isPrivate: false,
    },
    {
      id: "3",
      name: "Pro Circuit",
      entryFee: "$25",
      prizePool: "$2,500",
      players: 32,
      maxPlayers: 64,
      isPrivate: false,
    },
  ];

  const handleJoinLeague = (league: League) => {
    navigate("/create-team", { state: { league } });
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-100">
          Join a League
        </h1>

        {/* League Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowPrivateLeagueForm(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors"
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
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Available Leagues */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
            Available Leagues
          </h2>
          {availableLeagues.map((league) => (
            <div
              key={league.id}
              className="bg-white dark:bg-dark-850 rounded-xl border border-gray-200 dark:border-dark-600 p-6 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all shadow-sm dark:shadow-dark-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold dark:text-gray-100">
                      {league.name}
                    </h3>
                    {league.isPrivate ? (
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
                      {league.players}/{league.maxPlayers} players
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Entry Fee
                  </div>
                  <div className="font-semibold dark:text-gray-200">
                    {league.entryFee}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Prize Pool
                  </div>
                  <div className="font-semibold text-green-600 dark:text-green-500">
                    {league.prizePool}
                  </div>
                </div>
                <button
                  onClick={() => handleJoinLeague(league)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                >
                  Join Now
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
