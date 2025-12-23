import { Star, Target, BarChart, TriangleAlert, Zap } from "lucide-react";

export default function FantasyPointsBreakdown() {

  return (
    <div className="space-y-4 pb-10">
      {/* High Impact Actions */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-500/20 to-primary-500/20 dark:from-green-600/30 dark:to-primary-600/30 border-2 border-green-500/50 dark:border-green-400/50 p-4 pb-10 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-green-500/20 dark:bg-green-400/20">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-bold text-md text-gray-900 dark:text-gray-100">
            High Impact Actions
          </h3>
        </div>
        <div className="space-y-2">
          <ActionRow action="Try" points="+4" />
          <ActionRow action="Try Assist" points="+2" />
          <ActionRow action="Kick Try Scored" points="+2" />
        </div>
      </div>

      {/* Core Defensive & Attacking Actions */}
      <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-600/30 dark:to-blue-700/30 border-2 border-blue-500/50 dark:border-blue-400/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-blue-500/20 dark:bg-blue-400/20">
            <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-md text-gray-900 dark:text-gray-100">
            Core Actions
          </h3>
        </div>
        <div className="space-y-2">
          <ActionRow action="Clean Break" points="+1" />
          <ActionRow action="Defender Beaten" points="+1" />
          <ActionRow action="Dominant Tackle" points="+1" />
          <ActionRow action="Lineout Won Steal" points="+1" />
          <ActionRow action="Offload" points="+1" />
          <ActionRow action="Tackle Turnover" points="+1" />
          <ActionRow action="Turnover Won" points="+1" />
        </div>
      </div>

      {/* Goal Kicking */}
      <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 dark:from-purple-600/30 dark:to-purple-700/30 border-2 border-purple-500/50 dark:border-purple-400/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-purple-500/20 dark:bg-purple-400/20">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-bold text-md text-gray-900 dark:text-gray-100">
            Goal Kicking
          </h3>
        </div>
        <div className="space-y-2">
          <ActionRow action="Conversion Goal" points="+0.5" />
          <ActionRow action="Penalty Goal" points="+0.5" />
          <ActionRow action="Drop Goal Converted" points="+0.5" />
        </div>
      </div>

      {/* Minor Actions */}
      <div className="rounded-lg bg-gradient-to-br from-gray-400/20 to-gray-500/20 dark:from-gray-600/30 dark:to-gray-700/30 border-2 border-gray-400/50 dark:border-gray-500/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-gray-500/20 dark:bg-gray-400/20">
            <BarChart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="font-bold text-md text-gray-900 dark:text-gray-100">
            Minor Actions
          </h3>
        </div>
        <div className="space-y-2">
          <ActionRow action="Tackle" points="+0.5" />
          <ActionRow action="Carry Crossed Gain Line" points="+0.3" />
          <ActionRow action="Post Contact Metres" points="+0.1" />
          <ActionRow action="Carry Metres Total" points="+0.05" />
          <ActionRow action="Ruck Arrival Attack" points="+0.05" />
        </div>
      </div>

      {/* Penalties */}
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-400/50 dark:border-red-500/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-red-500/20 dark:bg-red-400/20">
            <TriangleAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-bold text-md text-gray-900 dark:text-gray-100">
            Penalties
          </h3>
        </div>
        <div className="space-y-2">
          <ActionRow
            action="Missed Tackles / Conversions / Penalties / Drop Goals"
            points="−0.5"
            negative
          />
          <ActionRow action="Turnovers Conceded" points="−1" negative />
          <ActionRow action="Red Card / Second Yellow" points="−5" negative />
        </div>
      </div>
    </div>
  );
}

type ActionRowProps = {
  action: string;
  points: string;
  negative?: boolean;
};

function ActionRow({ action, points, negative = false }: ActionRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {action}
      </span>
      {points && (
        <span
          className={`text-sm font-bold ${negative
            ? 'text-red-600 dark:text-red-400'
            : 'text-green-600 dark:text-green-400'
            }`}
        >
          {points}
        </span>
      )}
    </div>
  );
}
