import { Star, Target, BarChart, TriangleAlert, Trophy } from "lucide-react";

export default function FantasyPointsBreakdown() {
  return (
    <div className="space-y-4 pb-10">
      {/* Eligibility Note */}
      <div className="rounded-lg border-2 border-amber-300/60 bg-amber-50/60 dark:border-amber-400/40 dark:bg-amber-900/20 p-3 text-sm text-amber-900 dark:text-amber-100">
        <strong>Eligibility note:</strong> Some actions only score for specific positions.
        <div className="mt-1">
          Props only: Scrums Won Outright, Scrums Won Penalty. <br />
          Hooker/Lock only: Lineouts Won, Lineout Won Own Throw, Lineout Won Steal, Lineouts Lost, Lineout Non Straight.
        </div>
      </div>

      {/* High Impact Actions */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-500/20 to-primary-500/20 dark:from-green-600/30 dark:to-primary-600/30 border-2 border-green-500/50 dark:border-green-400/50 p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-green-500/20 dark:bg-green-400/20">
            <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-bold text-md text-gray-900 dark:text-gray-100">
            High Impact Actions
          </h3>
        </div>
        <div className="space-y-2">
          <ActionRow action="Tries" points="+4" />
          <ActionRow action="Try Assist" points="+2.5" />
          <ActionRow action="Kick Try Scored" points="+2" />
          <ActionRow action="Turnover Won" points="+1.5" />
          <ActionRow action="Scrums Won Penalty" points="+1.5" />
          <ActionRow action="Clean Breaks" points="+1" />
          <ActionRow action="Defenders Beaten" points="+1" />
          <ActionRow action="Dominant Tackles" points="+1" />
          <ActionRow action="Line Break Assists" points="+1" />
          <ActionRow action="Lineout Won Steal" points="+1" />
          <ActionRow action="Kick Possession Retained" points="+1" />
          <ActionRow action="True Retained Kicks" points="+1" />
          <ActionRow action="Scrums Won Free Kick" points="+1" />
          <ActionRow action="Scrums Won Outright" points="+0.8" />
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
          <ActionRow action="Offload" points="+0.5" />
          <ActionRow action="Carries Crossed Gain Line" points="+0.5" />
          <ActionRow action="Carry Dominant" points="+0.5" />
          <ActionRow action="Tackles" points="+0.4" />
          <ActionRow action="Lineout Won Own Throw" points="+0.4" />
          <ActionRow action="Playmaker Kick" points="+0.4" />
          <ActionRow action="Conversion Goals" points="+0.5" />
          <ActionRow action="Penalty Goals" points="+0.5" />
          <ActionRow action="Drop Goals Converted" points="+0.5" />
        </div>
      </div>

      {/* Scoring & Set Piece */}
      <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 dark:from-purple-600/30 dark:to-purple-700/30 border-2 border-purple-500/50 dark:border-purple-400/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-purple-500/20 dark:bg-purple-400/20">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-bold text-md text-gray-900 dark:text-gray-100">
            Scoring & Set Piece
          </h3>
        </div>
        <div className="space-y-2">
          <ActionRow action="Lineouts Won" points="+0.2" />
          <ActionRow action="Collection Loose Ball" points="+0.2" />
          <ActionRow action="Post Contact Metres" points="+0.1" />
          <ActionRow action="Playmaker Pass" points="+0.05" />
          <ActionRow action="Ruck Arrival Attack" points="+0.05" />
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
          <ActionRow action="Carry Metres Total" points="+0.02" />
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
          <ActionRow action="Penalties Conceded" points="-1" negative />
          <ActionRow action="Scrums Lost Outright" points="-0.8" negative />
          <ActionRow action="Turnovers Conceded" points="-0.6" negative />
          <ActionRow action="Missed Tackles" points="-0.5" negative />
          <ActionRow action="Lineout Non Straight" points="-0.5" negative />
          <ActionRow action="Lineouts Lost" points="-0.4" negative />
          <ActionRow action="Bad Passes" points="-0.3" negative />
          <ActionRow action="Handling Error" points="-0.3" negative />
          <ActionRow action="Missed Goals" points="-0.3" negative />
          <ActionRow action="Kick Possession Lost" points="-0.2" negative />
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
