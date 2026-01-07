import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons";
import { usePickemOverallRanking } from "../../hooks/pickem/usePickemOverallRankings";
import RankNumberCard from "../ui/cards/RankNumberCard";
import { Table } from "../ui/containers/Table";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { getRankingBorderColor } from "../../utils/fantasy/rankingUtils";
import { PickemOverallRankingItem } from "../../types/pickem";
import { useMemo } from "react";

/** Renders a pro pick'em leaderboard */
export default function ProPickemLeaderboard() {

  const { selectedSeason } = useFantasySeasons();
  const { rankings, isLoading } = usePickemOverallRanking(selectedSeason?.id);

  if (isLoading) {
    return (
      <LoadingIndicator />
    )
  }

  return (
    <div className="flex flex-col gap-3" >

      <Table.Root
        className="px-4 p"
        style={{
          borderSpacing: '1px 5px',
          borderCollapse: 'separate'
        }}

        title="Overall Leaderboard"
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
    </div>
  )
}

type RankingItemProps = {
  item: PickemOverallRankingItem
}

function RankingItem({ item }: RankingItemProps) {
  const stripColour = getRankingBorderColor(item.rank);

  const accuracy = useMemo(() => {
    return item.correct_predictions && item.predictions_made ? `${Math.floor((item.correct_predictions / item.predictions_made) * 100)}%` : '0%';
  }, [item.correct_predictions, item.predictions_made]);

  const userLabel = item.user.username || item.user.first_name || item.user.last_name;

  return (
    <Table.Row
      key={item.user_id}
      className="gap-1 h-[55px] items-center"

    >
      <Table.TableData
        style={ stripColour ? {
          borderLeft: 'solid',
          borderLeftColor: stripColour,
          margin: 1
        } : undefined}
      >
        <RankNumberCard
          value={item.rank}
          className="min-w-10 min-h-10"
        />
      </Table.TableData>

      <Table.TableData >
        <div className="min-w-[60px] max-w-[130px]" >
          <p className="text-sm text-wrap truncate" >{userLabel} </p>
        </div>
      </Table.TableData>

      <Table.TableData>
        <p className="text-center text-sm font-bold" >{item.score || '-'}</p>
      </Table.TableData>

      <Table.TableData>
        <p className="text-center text-sm font-bold" >{accuracy}</p>
      </Table.TableData>
    </Table.Row>
  )
}