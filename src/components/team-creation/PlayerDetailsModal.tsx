import React, { useState } from "react";
import { X, Target, Zap, Shield, Trophy, User } from "lucide-react";
import { Player } from "../../types/player";

type StatTab = "overview" | "attack" | "defense" | "kicking" | "discipline";

interface PlayerDetailsModalProps {
  player: Player;
  onClose: () => void;
  onAdd: (player: Player) => void;
}

export function PlayerDetailsModal({
  player,
  onClose,
  onAdd,
}: PlayerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<StatTab>("overview");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-950 rounded-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Player Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {player.image_url ? (
                <img
                  src={player.image_url}
                  alt={player.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src =
                      "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                  }}
                />
              ) : (
                <User size={36} className="text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{player.name}</h3>
              <div className="flex items-center gap-2 text-white/80">
                <span>{player.position}</span>
                <span>•</span>
                <span>{player.team}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-white">
                  {player.points} points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Tabs */}
        <div className="flex overflow-x-auto">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </TabButton>
          <TabButton
            active={activeTab === "attack"}
            onClick={() => setActiveTab("attack")}
          >
            Attack
          </TabButton>
          <TabButton
            active={activeTab === "defense"}
            onClick={() => setActiveTab("defense")}
          >
            Defense
          </TabButton>
          <TabButton
            active={activeTab === "kicking"}
            onClick={() => setActiveTab("kicking")}
          >
            Kicking
          </TabButton>
          <TabButton
            active={activeTab === "discipline"}
            onClick={() => setActiveTab("discipline")}
          >
            Discipline
          </TabButton>
        </div>

        {/* Stats Content - Add fixed height */}
        <div className="p-6">
          <div className="h-[280px] mb-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Tries"
                  value={12}
                  icon={<Target className="text-green-500" size={20} />}
                />
                <StatCard
                  label="Assists"
                  value={8}
                  icon={<Zap className="text-yellow-500" size={20} />}
                />
                <StatCard
                  label="Tackles"
                  value={145}
                  icon={<Shield className="text-blue-500" size={20} />}
                />
                <StatCard
                  label="PR"
                  value={player.points || 95}
                  icon={<Trophy className="text-purple-500" size={20} />}
                />
              </div>
            )}

            {activeTab === "attack" && (
              <div className="space-y-4">
                <StatBar label="Tries" value={10} maxValue={15} />
                <StatBar label="Line Breaks" value={14} maxValue={30} />
                <StatBar label="Carry Meters" value={556} maxValue={1000} />
                <StatBar label="Offloads" value={18} maxValue={25} />
              </div>
            )}

            {activeTab === "defense" && (
              <div className="space-y-4">
                <StatBar label="Tackles Made" value={145} maxValue={200} />
                <StatBar
                  label="Missed Tackles"
                  value={12}
                  maxValue={20}
                  inverse
                />
                <StatBar label="Turnovers Won" value={15} maxValue={20} />
              </div>
            )}

            {activeTab === "kicking" && (
              <div className="space-y-4">
                <StatBar label="Kicks from Hand" value={42} maxValue={50} />
                <StatBar
                  label="Goal Kicking Accuracy"
                  value={85}
                  maxValue={100}
                  suffix="%"
                />
              </div>
            )}

            {activeTab === "discipline" && (
              <div className="space-y-4">
                <StatBar
                  label="Penalties Conceded"
                  value={8}
                  maxValue={15}
                  inverse
                />
                <StatBar label="Yellow Cards" value={1} maxValue={3} inverse />
                <StatBar label="Red Cards" value={0} maxValue={1} inverse />
              </div>
            )}
          </div>

          <button
            onClick={() => onAdd(player)}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            Add to Team
          </button>
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
      active
        ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
    }`}
  >
    {children}
  </button>
);

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </div>
    <div className="text-2xl font-bold dark:text-gray-100">{value}</div>
  </div>
);

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  inverse?: boolean;
  suffix?: string;
}

const StatBar = ({ label, value, maxValue, inverse, suffix }: StatBarProps) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium dark:text-gray-300">{label}</span>
        <span className="text-sm font-medium dark:text-gray-300">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            inverse ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
