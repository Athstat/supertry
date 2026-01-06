/** Card that provides more information about the stats currently being shown for a player */

import { useLocation, useParams } from "react-router-dom"
import { IFantasyLeagueRound } from "../../../types/fantasyLeague";
import { useFetch } from "../../../hooks/useFetch";
import { gamesService } from "../../../services/gamesService";
import { Info } from "lucide-react";

type Props = {
  competitionId?: string
}

export default function PlayerStatsContextInfo({ competitionId }: Props) {

  const { state } = useLocation();
  const {officialLeagueId} = useParams();

  const fetchKey = competitionId
    ?? (state?.league as IFantasyLeagueRound)?.official_league_id
    ?? officialLeagueId
    ?? "fallback-key";

  const { data: games, isLoading } = useFetch("games", fetchKey, gamesService.getUpcomingGamesByCompetitionId);

  if (isLoading) return;

  if (games && games.length > 0) {

    const firstGame = games[0];

    return (
      <div className="flex text-sm flex-row gap-2 p-2 items-center justify-center rounded-xl bg-slate-100/50 text-slate-700 border dark:text-slate-300 border-slate-200 dark:bg-slate-700 dark:border-slate-500" >
        <Info className="w-5 h-5" />
        <div className="" >Currently showing athlete stats for {firstGame.competition_name}</div>
      </div>
    )
  }
}
