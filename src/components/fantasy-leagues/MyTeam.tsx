import { useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import CreateMyTeam from './CreateMyTeam';

export default function MyTeam() {
  const [teamState, setTeamState] = useState<'no-team' | 'creating-team' | 'team-created'>(
    'no-team'
  );

  if (teamState === 'no-team') {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center shadow-sm flex flex-col justify-center items-center">
          <div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              You haven't created a team yet for this week
            </p>
            <div className="mt-6 flex justify-center">
              <PrimaryButton className="w-auto px-6" onClick={() => setTeamState('creating-team')}>
                Create Team
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (teamState === 'creating-team') {
    return <CreateMyTeam />;
  }

  // Placeholder for future 'team-created' state
  return <div className="p-4" />;
}
