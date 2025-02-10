import React, { useState } from "react";
import { Users } from "lucide-react";
import { FriendsModal } from "./FriendsModal";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
}

interface FriendsSectionProps {
  friends: Friend[];
  followingCount: number;
  followersCount: number;
}

export function FriendsSection({
  friends,
  followingCount,
  followersCount,
}: FriendsSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<"following" | "followers">(
    "following"
  );

  const handleFollowingClick = () => {
    setModalTab("following");
    setShowModal(true);
  };

  const handleFollowersClick = () => {
    setModalTab("followers");
    setShowModal(true);
  };

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
    <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-gray-100">
          <Users size={20} className="text-primary-500" />
          Friends
        </h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleFollowingClick}
          className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-bold dark:text-gray-100">
            {followingCount}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Following
          </span>
        </button>

        <div className="flex items-center">
          {friends.slice(0, 5).map((friend, index) => (
            <div
              key={friend.id}
              className="relative"
              style={{
                marginLeft: index === 0 ? "0" : "-8px",
                zIndex: 5 - index,
              }}
            >
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                />
                {index < 3 && friend.rank <= 3 && (
                  <div
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${getRankBadgeColor(
                      friend.rank
                    )}`}
                    style={{ zIndex: 6 }}
                  >
                    {friend.rank}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleFollowersClick}
          className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-bold dark:text-gray-100">
            {followersCount}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Followers
          </span>
        </button>
      </div>

      <FriendsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        friends={friends}
        initialTab={modalTab}
      />
    </div>
  );
}
