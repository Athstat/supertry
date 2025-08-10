import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FantasyTeamStats } from '../components/team/FantasyTeamStats';
import { FantasyTeamHeader } from '../components/my-team/TeamHeader';
import { TeamDataProvider } from '../components/my-team/TeamDataProvider';
import AthletesAvailabilityWarning from '../components/team/AthletesAvailabilityWarning';
import {
  MyTeamScreenTabType,
  MyTeamScreenTabView,
} from '../components/my-team/MyTeamScreenTabView';
import { ErrorState } from '../components/ui/ErrorState';
import { ScopeProvider } from 'jotai-scope';
import {
  fantasyTeamAtom,
  fantasyTeamAthletesAtom,
  fantasyTeamValueAtom,
  fantasyTeamPointsAtom,
} from '../state/myTeam.atoms';
import { playerToSwapInAtom, positionToSwapAtom } from '../state/playerSwap.atoms';
import { fantasyLeagueAtom, fantasyLeagueLockedAtom } from '../state/fantasy/fantasyLeague.atoms';

export function MyTeamScreen() {
  const { teamId } = useParams<{ teamId: string }>();
  if (!teamId)
    return <ErrorState error="Error Fetching Team" message="We could not find this team" />;

  const atoms = [
    fantasyLeagueAtom,
    fantasyTeamAtom,
    fantasyTeamAthletesAtom,
    fantasyTeamValueAtom,
    fantasyTeamPointsAtom,
    fantasyLeagueLockedAtom,
    playerToSwapInAtom,
    playerToSwapInAtom,
    positionToSwapAtom,
  ];

  return (
    <ScopeProvider atoms={atoms}>
      <TeamDataProvider teamId={teamId}>
        <MyTeamScreenContent />
      </TeamDataProvider>
    </ScopeProvider>
  );
}

/** Actual consumer content on my screen that consumes data from team data provider */
function MyTeamScreenContent() {
  const [activeTab, setActiveTab] = useState<MyTeamScreenTabType>('edit-team');

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <FantasyTeamHeader />
        <FantasyTeamStats />
        <AthletesAvailabilityWarning />

        <MyTeamScreenTabView activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* <TeamActions/> */}
      </div>
    </main>
  );
}
