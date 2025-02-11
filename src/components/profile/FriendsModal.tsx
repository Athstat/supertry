import React, { useState } from "react";
import { X, Search, Trophy, ChevronRight } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
}

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  initialTab?: "following" | "followers";
}

export function FriendsModal({
  isOpen,
  onClose,
  friends,
  initialTab = "following",
}: FriendsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"following" | "followers">(
    initialTab
  );

  if (!isOpen) return null;

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400 text-yellow-900"; // Gold
      case 2:
        return "bg-gray-300 text-gray-700"; // Silver
      case 3:
        return "bg-amber-600 text-amber-50"; // Bronze
      default:
        return "bg-yellow-400 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-scale-up">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-gray-100">Friends</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-600 dark:text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "following"
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              FOLLOWING
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "followers"
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              FOLLOWERS
            </button>
          </div>

          <div className="relative mt-5">
            <input
              type="text"
              placeholder={`Search friends...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-dark-800/40 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {friend.rank <= 3 && (
                    <div
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${getRankBadgeColor(
                        friend.rank
                      )}`}
                    >
                      {friend.rank}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium dark:text-gray-100">
                    {friend.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Trophy size={14} />
                    <span>{friend.points.toLocaleString()} Pts</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-primary-600 dark:text-primary-400 font-bold">
                    Division #{friend.division}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Rank #{friend.rank}
                  </span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
