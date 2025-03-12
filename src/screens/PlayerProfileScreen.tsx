import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Trophy, Shield, Zap, Target } from "lucide-react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { athleteService } from "../services/athleteService";

type StatTab = "overview" | "attack" | "defense" | "kicking" | "discipline";

export const PlayerProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get the ID from URL params
  const [activeTab, setActiveTab] = useState<StatTab>("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<RugbyPlayer | null>(
    location.state?.player || null
  );

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch player data if not available in navigation state
  useEffect(() => {
    const fetchPlayer = async () => {
      if (!player && id) {
        try {
          setIsLoading(true);
          setError(null);
          const data = await athleteService.getAthleteById(id);
          setPlayer(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load player"
          );
          console.error("Error fetching player:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPlayer();
  }, [id, player]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900/40 p-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading player...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900/40 p-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg">
          {error || "Player not found"}
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm font-medium underline block"
          >
            Go back to players
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-900/40">
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
                src={player.image_url}
                alt={player.player_name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{player.player_name}</h1>
              <div className="flex items-center gap-2 text-white/80">
                <span>{player.position_class}</span>
                <span>•</span>
                <span>{player.team_name}</span>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Trophy size={16} />
                  <span className="font-medium">
                    {player.power_rank_rating} pts
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src={player.team_logo}
                    alt={`${player.team_name} logo`}
                    className="h-4 w-4 object-contain"
                  />
                  <span>{player.team_name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm overflow-hidden">
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
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Tries"
                  value={12}
                  icon={<Target className="text-green-500" size={20} />}
                />
                <StatCard
                  label="Assists"
                  value={15}
                  icon={<Zap className="text-yellow-500" size={20} />}
                />
                <StatCard
                  label="Tackles"
                  value={145}
                  icon={<Shield className="text-blue-500" size={20} />}
                />
                <StatCard
                  label="Power Ranking"
                  value={85}
                  icon={<Trophy className="text-purple-500" size={20} />}
                />
              </div>
            )}

            {activeTab === "attack" && (
              <div className="space-y-4">
                <StatBar label="Tries" value={12} maxValue={20} />
                <StatBar label="Line Breaks" value={25} maxValue={40} />
                <StatBar label="Carry Meters" value={850} maxValue={1000} />
                <StatBar label="Offloads" value={18} maxValue={30} />
              </div>
            )}

            {activeTab === "defense" && (
              <div className="space-y-4">
                <StatBar label="Tackles Made" value={145} maxValue={200} />
                <StatBar
                  label="Missed Tackles"
                  value={12}
                  maxValue={50}
                  inverse
                />
                <StatBar label="Turnovers Won" value={8} maxValue={15} />
              </div>
            )}

            {activeTab === "kicking" && (
              <div className="space-y-4">
                <StatBar label="Kicks" value={45} maxValue={80} />
                <StatBar label="Conversions" value={28} maxValue={40} />
                <StatBar label="Penalties" value={15} maxValue={25} />
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
