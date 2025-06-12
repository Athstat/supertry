import { useAtomValue } from "jotai"
import { sbrFixtureMotmCandidatesAtom, sbrFixtureMotmVotesAtom } from "../../../state/sbrMotm.atoms";
import { getSbrAthleteMotmVoteTally } from "../../../utils/sbrUtils";
import { Trophy } from "lucide-react";
import SecondaryText from "../../shared/SecondaryText";
import BlueGradientCard from "../../shared/BlueGradientCard";

/** Renders the winner of the SBR Motm Voting for a given fixture  */
export default function SbrTopDawgOfTheMatchCard() {

  const votes = useAtomValue(sbrFixtureMotmVotesAtom);
  const candidates = useAtomValue(sbrFixtureMotmCandidatesAtom);

  const getVoteTally = (athleteId: string) => {
    const res = getSbrAthleteMotmVoteTally(votes, athleteId);
    return res;
  };

  const votesDesc = votes.sort((a, b) => {
    const aTally = getVoteTally(a.athlete_id);
    const bTally = getVoteTally(b.athlete_id);

    const aName = (a.athlete_first_name ?? "") + " " + (a.athlete_first_name ?? "");
    const bName = (b.athlete_first_name ?? "") + " " + (b.athlete_first_name ?? "");

    const voteTallyEqual = aTally === bTally;

    return voteTallyEqual ?
      aName.localeCompare(bName ?? "") : bTally - aTally;

  });

  if (votesDesc.length === 0) return;

  const winner = candidates.find((c) => {
    return votesDesc[0].athlete_id === c.athlete_id;
  });

  if (!winner) return undefined;

  return (
    <BlueGradientCard className="relative mt-4 w-full from-primary-500 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-900 max-w-md mx-auto p-6 bg-gradient-to-br rounded-xl border border-primary-500 shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
      {/* Trophy Badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
        The Fan's Match MVP
      </div>

      {/* Main Content */}
      <div className="mt-2 flex flex-col items-center space-y-2">
        {/* Trophy Icon */}
        <div className="relative">
          <div className="absolute -inset-1 bg-primary-500/30 rounded-full blur"></div>
          <Trophy className="w-12 h-12 text-primary-200" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text font-bold text-primary-200">Top Dawg Of the Match</h2>
          {/* <div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div> */}
        </div>

        {/* Winner Info */}
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-semibold text-white">
            {winner.athlete_first_name} {winner.athlete_last_name}
          </h3>
          <SecondaryText className="text-sm text-primary-200 dark:text-primary-200">{winner.team_name} · {winner.position}</SecondaryText>
        </div>

      </div>
    </BlueGradientCard>
  )
}
