import { ArrowUpDown, CirclePlus, TriangleAlert } from "lucide-react";
import { IFantasyLeagueRound } from "../../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { formatPosition } from "../../../utils/athleteUtils";
import PlayerMugshot from "../../shared/PlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";
import { useFantasyLeagueTeam } from "./FantasyLeagueTeamProvider";
import { twMerge } from "tailwind-merge";
import TeamJersey from "../../player/TeamJersey";
import { usePlayerRoundAvailability } from "../../../hooks/fantasy/usePlayerRoundAvailability";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils";
import { Activity, useMemo } from "react";
import { AppColours } from "../../../types/constants";
import { useAthleteRoundScore } from "../../../hooks/useAthletePointsBreakdown";
import { sanitizeStat } from "../../../utils/stringUtils";


type Props = {
  onPlayerClick?: (player: IFantasyTeamAthlete) => void
}

/** Renders a bottom drawer for team subs */
export default function TeamBenchDrawer({ onPlayerClick }: Props) {

  const { leagueRound, slots, initateSwapOnEmptySlot } = useFantasyLeagueTeam();

  const superSubSlot = useMemo(() => {
    return slots.find((s) => s.slotNumber === 6);
  }, [slots]);

  if (!superSubSlot || !leagueRound) {
    return;
  }

  const { athlete } = superSubSlot;
  const isSlotEmpty = athlete === undefined || athlete === null;

  const handlePlayerClick = () => {

    if (superSubSlot && onPlayerClick && superSubSlot.athlete) {
      onPlayerClick(superSubSlot.athlete);
      return;
    }

    initateSwapOnEmptySlot(superSubSlot);
  }

  return (
    <div

      className={twMerge(
        "max-h-[130px] fixed bottom-0 left-0 w-full min-h-[130px] flex flex-col items-center justify-center",
        isSlotEmpty && "max-h-[150px]"
      )}

      onClick={handlePlayerClick}

    >
      <div className={twMerge(
        "lg:max-w-[40%] md:max-w-[50%]  w-full bg-white  rounded-t-2xl drop-shadow-2xl shadow-[0_-8px_20px_rgba(0,0,0,0.3)]",
        AppColours.BACKGROUND
      )}>

        <div className="w-full flex flex-col gap-1 p-4" >

          <div className="flex flex-row items-center gap-2" >
            <ArrowUpDown className="text-yellow-500" />
            <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Super Subsitute
            </p>
          </div>

          {athlete && (
            <SubPlayerCard
              player={athlete}
              round={leagueRound}
              onClick={() => { }}
            />
          )}

          {isSlotEmpty && (
            <EmptySuperSubSlot
            />
          )}

        </div>
      </div>
    </div>
  )
}


type SubPlayerProps = {
  player: IFantasyTeamAthlete,
  round: IFantasyLeagueRound
  onClick: () => void
}

function SubPlayerCard({ player, onClick, round }: SubPlayerProps) {

  const { position_class } = player;
  const { league } = useFantasyLeagueGroup();
  const isLocked = isLeagueRoundLocked(round);

  const { isNotAvailable, isTeamNotPlaying } = usePlayerRoundAvailability(
    player.tracking_id,
    league?.season_id ?? "",
    round?.start_round ?? 0,
  );

  const showAvailabilityWarning = (isNotAvailable || isTeamNotPlaying);


  return (
    <div
      className={twMerge(
        "w-full cursor-pointer h-full min-h-[80px] rounded-2xl p-2 flex flex-row items-center justify-between",
        showAvailabilityWarning && "bg-yellow-200/10 dark:bg-yellow-700/10 border border-yellow-500/30 dark:border-yellow-700/30"
      )}
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-2">

        <div className="flex fle-row items-center gap-2" >

          {showAvailabilityWarning && (
            <div className="" >
              <div className={twMerge(
                " dark:bg-yellow-400 bg-yellow-400 hover:bg-yellow-400  border-yellow-500 dark:border-yellow-500 w-6 h-6 rounded-md flex flex-col items-center justify-center",
              )} >
                <TriangleAlert className={twMerge(
                  "w-3.5  text-yellow-700 dark:text-yellow-700 h-4",
                )} />
              </div>
            </div>
          )}

          {player.image_url && <PlayerMugshot
            url={player.image_url}
            teamId={player.athlete_team_id}
          />}

          {!player.image_url && (
            <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-blue-600/40" >
              <TeamJersey
                teamId={player.athlete_team_id}
                className="w-10 h-10"
                useBaseClasses={false}
              />
            </div>
          )}


        </div>

        <div className="flex flex-col items-start justify-center" >
          <p className="text font-semibold" >{player.player_name}</p>

          <div className="flex flex-row items-center gap-1" >
            <SecondaryText className="text-xs" >{position_class ? formatPosition(position_class) : 'Substitute'}</SecondaryText>
            {showAvailabilityWarning && !isLocked && (
              <p className="text-[10px] text-yellow-500" >- Not Playing ⚠️</p>
            )}
          </div>

        </div>
      </div>

      <div className="flex flex-row items-center gap-4 mr-2" >
        {/* <div className="flex flex-row items-center gap-1" >
          <Coins className="w-4 h-4 text-yellow-500" />
          <p className="text-sm" >{purchase_price}</p>
        </div> */}

        <div className="flex flex-row items-center gap-1" >
          <SubPlayerScoreIndicator 
            player={player}
            round={round}
          />
        </div>
      </div>

    </div>
  )
}

function EmptySuperSubSlot() {

  return (
    <div
      className="w-full cursor-pointer border-4 rounded-xl dark:text-slate-600 border-dotted border-slate-100 dark:border-slate-700/80 p-2.5 flex flex-col items-center justify-center"
    >
      <div>
        <CirclePlus />
      </div>

      <p className="text-sm font-semibold" >Super Sub</p>
    </div>
  )
}

type PlayerPointsScoreProps = {
    round: IFantasyLeagueRound,
    player: IFantasyTeamAthlete,
}

function SubPlayerScoreIndicator({ round, player }: PlayerPointsScoreProps) {

    const isLocked = isLeagueRoundLocked(round);
    const { isLoading: loadingScore, score } = useAthleteRoundScore(player.tracking_id, round.season_id, round?.start_round ?? 0);
    const { league } = useFantasyLeagueGroup();

    const isLoading = loadingScore;

    const { isNotAvailable, isTeamNotPlaying, nextMatch } = usePlayerRoundAvailability(
        player.tracking_id,
        league?.season_id ?? "",
        round?.start_round ?? 0,
    );

    const [homeOrAway, opponent] = useMemo(() => {
        if (!nextMatch) {
            return [undefined, undefined];
        }

        const playerTeamId = player.athlete_team_id;

        if (playerTeamId === nextMatch.team?.athstat_id) {
            return ["(H)", nextMatch.opposition_team];
        }

        if (playerTeamId === nextMatch.opposition_team?.athstat_id) {
            return ["(A)", nextMatch.team];
        }

        return [undefined, undefined];

    }, [nextMatch, player.athlete_team_id]);

    const showScore = !isLoading && isLocked;

    const showAvailabilityWarning = !isLoading && (isNotAvailable || isTeamNotPlaying) && !showScore;
    const showNextMatchInfo = !isLoading && !showAvailabilityWarning && homeOrAway && opponent && !showScore;

    

    return (
        <>
            <div className={twMerge(
                "w-full overflow-clip items-center justify-center flex flex-row",
                isLoading && "animate-pulse"
            )} >

                
                <Activity mode={isLoading ? "visible" : "hidden"} >
                    <div className="w-[60%] h-[10px] bg-white/40 animate-pulse" >

                    </div>
                </Activity>

                <Activity mode={showNextMatchInfo ? "visible" : "hidden"} >
                    <p className=" text-sm md:text-[10px] max-w-[100px] font-medium truncate" >{opponent?.athstat_name} {homeOrAway}</p>
                </Activity>

                {/* <Activity mode={showPrice ? "visible" : "hidden"} >
                    <div className=" max-w-[100px] font-medium truncate flex flex-row items-center gap-1" >
                        <p className="text-[10px] md:text-[10px]" >{player.price}</p>
                        <Coins className="text-yellow-500 w-2.5 h-2.5" />
                    </div>
                </Activity> */}

                <Activity mode={showAvailabilityWarning ? "visible" : "hidden"} >
                    <div className="w-full flex flex-row gap-1 text-center items-center justify-center" >
                        <p className="text-sm md:text-[10px] font-medium" >Not Playing</p>
                        <TriangleAlert className="w-3 h-3" />
                    </div>
                </Activity>

                <Activity mode={showScore ? 'visible' : 'hidden'}  >
                    <div>
                        <p className='text-base md:text-[10px] font-bold' >{sanitizeStat(score)}</p>
                    </div>
                </Activity>

            </div>
        </>
    )
}