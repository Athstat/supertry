import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons";
import { usePickemOverallRanking } from "../../hooks/pickem/usePickemOverallRankings";
import RankNumberCard from "../ui/cards/RankNumberCard";
import { Table } from "../ui/containers/Table";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { getRankingBorderColor } from "../../utils/fantasy/rankingUtils";
import { PickemOverallRankingItem } from "../../types/pickem";
import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { twMerge } from "tailwind-merge";
import NoContentCard from "../ui/typography/NoContentMessage";

/** Renders a pro pick'em leaderboard */
export default function ProPickemLeaderboard() {

  const { selectedSeason } = useFantasySeasons();
  const { rankings, isLoading } = usePickemOverallRanking(selectedSeason?.id);

  if (isLoading) {
    return (
      <LoadingIndicator />
    )
  }

  const emptyRankings = rankings.length === 0;

  return (
    <div className="flex flex-col gap-3" >

      <Table.Root
        className="px-4 p"
        style={{
          borderSpacing: '0px 5px',
          borderCollapse: 'separate'
        }}

        title={`${selectedSeason?.name} Leaderboard`}
      >

        <Table.Header>
          <Table.HeaderColumn>Rank</Table.HeaderColumn>
          <Table.HeaderColumn>User</Table.HeaderColumn>
          <Table.HeaderColumn>Score</Table.HeaderColumn>
          <Table.HeaderColumn>Accuracy</Table.HeaderColumn>
        </Table.Header>

        <div className="h-[10px] w-full" ></div>

        <Table.Body>
          {rankings.map((item) => {
            return (
              <RankingItem
                item={item}
                key={item.user_id}
              />
            )
          })}
        </Table.Body>



      </Table.Root>

      {emptyRankings && (
        <NoContentCard
          message="Opps! Pick'em Leaderboard Rankings are currently unavailable"
        />
      )}
    </div>
  )
}

type RankingItemProps = {
  item: PickemOverallRankingItem
}

function RankingItem({ item }: RankingItemProps) {

  const { authUser } = useAuth();
  const stripColour = getRankingBorderColor(item.rank);

  const isUserRanking = authUser?.kc_id === item.user_id;

  const accuracy = useMemo(() => {
    return item.correct_predictions && item.predictions_made ? `${Math.floor((item.correct_predictions / item.predictions_made) * 100)}%` : '0%';
  }, [item.correct_predictions, item.predictions_made]);

  const userLabel = item.user.username || item.user.first_name || item.user.last_name;

  return (
    <Table.Row
      key={item.user_id}
      className={twMerge(
        "gap-1 h-[55px] items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800",
        isUserRanking && 'bg-blue-500 dark:bg-blue-600 text-white'
      )}

    >
      <Table.TableData
        style={stripColour ? {
          borderLeft: 'solid',
          borderLeftColor: stripColour,
          margin: 1
        } : undefined}
      >
        <RankNumberCard
          value={item.rank}
          className={twMerge(
            "min-w-10 min-h-10",
            isUserRanking && "bg-transparent dark:bg-transparent"
          )}
        />
      </Table.TableData>

      <Table.TableData >
        <div className="min-w-[60px] max-w-[130px]" >
          <p className="text-sm text-wrap truncate" >{userLabel} </p>
        </div>
      </Table.TableData>

      <Table.TableData>
        <p className="text-center text-xs font-semibold" >{item.score || '-'}</p>
      </Table.TableData>

      <Table.TableData>
        <p className="text-center text-xs font-semibold" >{accuracy}</p>
      </Table.TableData>
    </Table.Row>
  )
}