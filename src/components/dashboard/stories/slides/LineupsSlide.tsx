import { useEffect } from "react";
import { useGameStory } from "../../../../hooks/dashboard/useGameStory";
import { useGameRosters } from "../../../../hooks/fixtures/useGameRosters";
import { IFixture, IRosterItem } from "../../../../types/games";
import { Users } from "lucide-react";
import PlayerMugshot from "../../../shared/PlayerMugshot";
import SecondaryText from "../../../shared/SecondaryText";
import { CaptainsArmBand } from "../../../fixture/FixtureRosterList";
import { LoadingState } from "../../../ui/LoadingState";

interface LineupsSlideProps {
  game: IFixture;
}

export default function LineupsSlide({ game }: LineupsSlideProps) {

  const { pauseStory, resumeStory } = useGameStory();
  const { isLoading, awayRoster, homeRoster } = useGameRosters(game);

  useEffect(() => {
    if (isLoading) {
      pauseStory();
    } else {
      resumeStory();
    }
  }, [isLoading, pauseStory, resumeStory]);

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="h-full flex flex-col px-4 bg-gradient-to-b from-gray-900 to-gray-900 overflow-y-auto">

      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users size={20} className="text-blue-400" />
          <h2 className="text-lg font-bold">Team Lineups</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">

        {/* Home Team */}
        <TeamLogoAndName
          teamName={game.opposition_team?.athstat_name}
          logoUrl={game.opposition_team?.image_url}
        />


        <TeamLogoAndName
          teamName={game.team?.athstat_name}
          logoUrl={game.team?.image_url}
        />

        <div className="space-y-1">
          {homeRoster.map((r) => {
            return (
              <LineupItem item={r} key={r.athlete.tracking_id} />
            )
          })}
        </div>

        <div className="space-y-1">
          {awayRoster.map((r) => {
            return (
              <LineupItem item={r} key={r.athlete.tracking_id} />
            )
          })}
        </div>
      </div>
    </div>
  );
}

type Props = {
  item: IRosterItem
}

/** Renders a lineup item */
function LineupItem({ item }: Props) {

  const { athlete, player_number, is_captain } = item;
  const playerName = athlete.player_name;
  const position = athlete.position;

  return (
    <div key={player_number} className="bg-gray-800 bg-opacity-50 rounded-lg p-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
          <PlayerMugshot
            playerPr={athlete.power_rank_rating}
            url={athlete.image_url}
            isCaptain={is_captain} 
            className="w-10 h-10"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] truncate flex flex-row items-center gap-1">
            {playerName}
            {is_captain && <CaptainsArmBand className=" w-4 h-2 text-[8px]" />}
          </div>
          <SecondaryText className="text-xs text-gray-400">{position}</SecondaryText>
        </div>
      </div>
    </div>
  )
}

type TeamLogoAndNameProps = {
  teamName?: string,
  logoUrl?: string
}

function TeamLogoAndName({ teamName, logoUrl }: TeamLogoAndNameProps) {
  return (
    <div className="text-center">
      <div className="w-8 h-8 mx-auto mb-2 bg-gray-700 rounded-full flex items-center justify-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={teamName}
            className="w-6 h-6 object-contain"
          />
        ) : (
          <span className="text-xs font-bold text-gray-400">
            {teamName}
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-center">
        {teamName}
      </h3>
    </div>
  )
}