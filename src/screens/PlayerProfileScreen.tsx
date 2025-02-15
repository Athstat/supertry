import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Shield, Zap, Target } from "lucide-react";
import { rugbyPlayersWithPoints } from "../data/rugbyPlayers";

type StatTab = "overview" | "attack" | "defense" | "kicking" | "discipline";

export const PlayerProfileScreen = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatTab>("overview");

  const player = rugbyPlayersWithPoints.find((p) => p.id === playerId);

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ChevronLeft size={20} />
            Back to Players
          </button>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{player.name}</h1>
              <div className="flex items-center gap-2 text-white/80">
                <span>{player.position}</span>
                <span>•</span>
                <span>{player.club}</span>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Trophy size={16} />
                  <span className="font-medium">
                    {player.fantasyPoints} pts
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={16} />
                  <span>{player.nationality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden">
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

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Tries"
                  value={player.stats.tries}
                  icon={<Target className="text-green-500" size={20} />}
                />
                <StatCard
                  label="Assists"
                  value={player.stats.assists}
                  icon={<Zap className="text-yellow-500" size={20} />}
                />
                <StatCard
                  label="Tackles"
                  value={player.stats.tackles}
                  icon={<Shield className="text-blue-500" size={20} />}
                />
                <StatCard
                  label="Fantasy Points"
                  value={player.fantasyPoints}
                  icon={<Trophy className="text-purple-500" size={20} />}
                />
              </div>
            )}

            {activeTab === "attack" && (
              <div className="space-y-4">
                <StatBar
                  label="Tries"
                  value={player.stats.tries}
                  maxValue={5}
                />
                <StatBar
                  label="Line Breaks"
                  value={player.stats.lineBreaks}
                  maxValue={8}
                />
                <StatBar
                  label="Carry Meters"
                  value={player.stats.carryMeters}
                  maxValue={180}
                />
                <StatBar
                  label="Offloads"
                  value={player.stats.offloads}
                  maxValue={12}
                />
              </div>
            )}

            {activeTab === "defense" && (
              <div className="space-y-4">
                <StatBar
                  label="Tackles Made"
                  value={player.stats.tackles}
                  maxValue={40}
                />
                <StatBar
                  label="Missed Tackles"
                  value={player.stats.missedTackles}
                  maxValue={5}
                  inverse
                />
                <StatBar
                  label="Turnovers Won"
                  value={player.stats.turnoversWon}
                  maxValue={6}
                />
                <StatBar
                  label="Rucks Won"
                  value={player.stats.rucksWon}
                  maxValue={25}
                />
              </div>
            )}

            {activeTab === "kicking" && (
              <div className="space-y-4">
                <StatBar
                  label="Kicks from Hand"
                  value={player.stats.kicksFromHand}
                  maxValue={35}
                />
                <StatBar
                  label="Goal Kicking Accuracy"
                  value={player.stats.goalKickingAccuracy}
                  maxValue={100}
                  suffix="%"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

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
