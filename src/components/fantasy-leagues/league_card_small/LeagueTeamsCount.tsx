import { Users } from 'lucide-react';
import { IFantasyLeague } from '../../../types/fantasyLeague';

type Props = {
  league: IFantasyLeague & { participants_count?: number };
};

export default function LeagueTeamsCount({ league }: Props) {
  const count = league.participants_count ?? 0;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <Users size={16} />
      <span>{count} teams joined</span>
    </div>
  );
}
