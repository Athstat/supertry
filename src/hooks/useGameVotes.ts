import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { IFixture, IGameVote } from '../types/games';
import { gamesService } from '../services/gamesService';
import { authService } from '../services/authService';

export function useGameVotes(fixture: IFixture) {
  const { data, isLoading } = useSWR(fixture.game_id ? `game-votes-${fixture.game_id}` : null, () =>
    gamesService.getGameVotes(fixture.game_id)
  );

  const [homeVotes, setHomeVotes] = useState<IGameVote[]>([]);
  const [awayVotes, setAwayVotes] = useState<IGameVote[]>([]);
  const [userVote, setUserVote] = useState<IGameVote | undefined>(undefined);

  useEffect(() => {
    if (data) {
      const user = authService.getUserInfoSync();
      const userId = user?.kc_id;

      const home = data.filter(vote => vote.vote_for === 'home_team');
      const away = data.filter(vote => vote.vote_for === 'away_team');
      const userV = data.find(vote => vote.user_id === userId);

      setHomeVotes(home);
      setAwayVotes(away);
      setUserVote(userV);
    }
  }, [data]);

  return {
    homeVotes,
    awayVotes,
    userVote,
    isLoading,
  };
}
