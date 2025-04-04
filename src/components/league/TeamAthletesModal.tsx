import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { TeamStats } from "../../types/league";

interface Athlete {
  id: string;
  name: string;
  position: string;
  team_name?: string;
  power_rank_rating?: number;
  price?: number;
  image_url?: string;
  score?: number;
}

interface TeamAthletesModalProps {
  team: TeamStats;
  athletes: Athlete[];
  onClose: () => void;
  isLoading?: boolean;
}

export function TeamAthletesModal({
  team,
  athletes,
  onClose,
  isLoading = false,
}: TeamAthletesModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold dark:text-white">
              {team.teamName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Managed by {team.managerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32 p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {athletes.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No athletes found
              </div>
            ) : (
              <ul className="divide-y dark:divide-gray-700">
                {athletes.map((athlete) => (
                  <li key={athlete.id}>
                    <div className="p-4 flex items-center gap-3">
                      {/* Athlete Image */}
                      <div className="flex-shrink-0">
                        {athlete.image_url ? (
                          <img
                            src={athlete.image_url}
                            alt={athlete.name || "Athlete"}
                            className="w-12 h-12 rounded-full object-cover object-top bg-gray-100 dark:bg-gray-700"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.currentTarget.src =
                                "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Athlete Info */}
                      <div className="flex-1">
                        <div className="font-medium dark:text-white">
                          {athlete.name || "Unknown Athlete"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {athlete.position
                            ? athlete.position
                                .split("-")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")
                            : "Unknown Position"}
                        </div>
                      </div>

                      {/* Athlete Stats */}
                      <div className="flex flex-col items-end">
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          {athlete.score || 0} pts
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          PR: {athlete.power_rank_rating || 0}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
