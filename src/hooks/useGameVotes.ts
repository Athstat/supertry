import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { IFixture, IGameVote } from '../types/games';
import { gamesService } from '../services/gamesService';
import { authService } from '../services/authService';

export function useGameVotes(fixture: IFixture, fetchData: boolean = true) {
  const key = fetchData ? (fixture.game_id ? `game-votes-${fixture.game_id}` : null) : null;
  const { data, isLoading } = useSWR(key, () => gamesService.getGameVotes(fixture.game_id));

  const [homeVotes, setHomeVotes] = useState<IGameVote[]>([]);
  const [awayVotes, setAwayVotes] = useState<IGameVote[]>([]);
  const [drawVotes, setDrawVotes] = useState<IGameVote[]>([]);
  const [userVote, setUserVote] = useState<IGameVote | undefined>(undefined);
  const [percentages, setPercentages] = useState({ home: 0, away: 0, draw: 0 });

  useEffect(() => {
    if (data) {
      const user = authService.getUserInfoSync();
      const userId = user?.kc_id;

      const home = data.filter(vote => vote.vote_for === 'home_team');
      const away = data.filter(vote => vote.vote_for === 'away_team');
      const draw = data.filter(vote => vote.vote_for === 'draw');
      const userV = data.find(vote => vote.user_id === userId);

      const totalVotes = home.length + away.length + draw.length;

      setHomeVotes(home);
      setAwayVotes(away);
      setDrawVotes(draw);
      setUserVote(userV);

      // Calculate percentages
      if (totalVotes > 0) {
        setPercentages({
          home: Math.round((home.length / totalVotes) * 100),
          away: Math.round((away.length / totalVotes) * 100),
          draw: Math.round((draw.length / totalVotes) * 100),
        });
      } else {
        setPercentages({ home: 0, away: 0, draw: 0 });
      }
    }
  }, [data]);

  return {
    homeVotes,
    awayVotes,
    drawVotes,
    userVote,
    percentages,
    isLoading,
  };
}
