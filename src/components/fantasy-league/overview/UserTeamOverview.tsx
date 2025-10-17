import { useMemo, useState } from 'react';
import {
  FantasyLeagueTeamWithAthletes,
  IDetailedFantasyAthlete,
  IFantasyLeagueRound,
} from '../../../types/fantasyLeague';
import PlayerPointsBreakdownView from '../team-modal/points_breakdown/PlayerPointsBreakdownView';
import { IProAthlete } from '../../../types/athletes';
import DialogModal from '../../shared/DialogModal';
import { useGeneralPlayerAvailability } from '../../../hooks/fantasy/usePlayerSquadReport';
import { twMerge } from 'tailwind-merge';
import SecondaryText from '../../shared/SecondaryText';
import { ArrowRight } from 'lucide-react';
import { useTabView } from '../../shared/tabs/TabView';
import { useNavigate } from 'react-router-dom';
import { getTeamJerseyImage } from '../../../utils/athleteUtils';


type Props = {
  userTeam: FantasyLeagueTeamWithAthletes;
  leagueRound: IFantasyLeagueRound;
  onManageTeam?: () => void;
};

export default function UserTeamOverview({
  userTeam,
  leagueRound: currentRound,
  onManageTeam,
}: Props) {
  const { navigate } = useTabView();
  const routerNavigate = useNavigate();
  const [selectPlayer, setSelectPlayer] = useState<IProAthlete>();

  const onClosePointsBreakdown = () => {
    setSelectPlayer(undefined);
  };

  const onSelectPlayer = (a: IDetailedFantasyAthlete) => {
    setSelectPlayer(a.athlete);
  };

  const handleManageTeam = () => {
    if (onManageTeam) {
      onManageTeam();
    } else {
      const groupId = userTeam?.fantasyLeague?.fantasy_league_group_id;
      const roundId = userTeam?.fantasyLeague?.id;
      const teamId = (userTeam?.team_id ?? userTeam?.team?.id) as string | number | undefined;
      if (groupId && roundId && teamId != null) {
        routerNavigate(`/league/${groupId}?journey=my-team&roundId=${roundId}&teamId=${teamId}`);
      }
      // Also switch the TabView immediately when already inside the league screen
      navigate('my-team');
    }
  };

  console.log('User Team ', userTeam);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="font-bold">Squad</p>
        </div>

        <div>
          <button
            onClick={handleManageTeam}
            className="flex text-primary-500 text-sm flex-row items-center gap-2"
          >
            <p>Manage</p>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {currentRound && userTeam && (
        <div className="w-full relative max-h-[200px]rounded-xl">
          <div className="flex flex-row items-center gap-2 overflow-y-auto no-scrollbar">
            {userTeam.athletes.map(a => {
              return (
                <PlayerItem
                  key={a.athlete.tracking_id}
                  onClick={() => onSelectPlayer(a)}
                  athlete={a}
                  team={userTeam}
                />
              );
            })}
          </div>
        </div>
      )}

      {selectPlayer && userTeam && (
        <DialogModal open={true} onClose={onClosePointsBreakdown}>
          <PlayerPointsBreakdownView
            athlete={selectPlayer}
            team={userTeam}
            round={currentRound}
            onClose={onClosePointsBreakdown}
          />
        </DialogModal>
      )}
    </div>
  );
}

type PlayerItemProps = {
  athlete: IDetailedFantasyAthlete;
  onClick?: () => void;
  team: FantasyLeagueTeamWithAthletes;
};

function PlayerItem({ athlete, onClick }: PlayerItemProps) {

  const {
    nextMatch, isLoading,
    isNotAvailable, isTeamNotPlaying,
    report
  } = useGeneralPlayerAvailability(athlete.athlete.tracking_id);

  const { nextOpponent, fieldStatus } = useMemo(() => {

    if (nextMatch) {
      if (athlete.athlete.team_id === nextMatch.team?.athstat_id) {
        return { nextOpponent: nextMatch.opposition_team, fieldStatus: "H" };
      }

      return { nextOpponent: nextMatch.team, fieldStatus: "A" };
    }

    return { nextOpponent: undefined, fieldStatus: undefined };
  }, [nextMatch, athlete]);

  const showWarning = isTeamNotPlaying || isNotAvailable;

  const reportText = useMemo<string | undefined>(() => {
    if (report) {
      const { status } = report;

      if (status === "PENDING" || status === "AVAILABLE") {
        if (nextOpponent && fieldStatus) {
          return `${nextOpponent.athstat_name} (${fieldStatus}) `;
        }
      }

      if (status === "TEAM_NOT_PLAYING") {
        return "Team Not Playing";
      }

      if (status === "NOT_AVAILABLE") {
        return "⚠️ Not On Roster";
      }
    }

    return "";
  }, [fieldStatus, nextOpponent, report])

  if (isLoading) {
    return (
      <div
        onClick={onClick}
        className={twMerge(
          'flex border dark:border-slate-700 min-w-[120px] max-w-[120px] h-[120px] rounded-xl overflow-clip p-0 flex-col'
        )}
      ></div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={twMerge(
        'flex border cursor-pointer dark:border-slate-700 min-w-[120px] max-w-[120px] h-[120px] rounded-xl overflow-clip p-0 flex-col',
        showWarning &&
        'border-yellow-600 dark:border-yellow-900 bg-yellow-100 dark:bg-yellow-600/20 opacity-80'
      )}
    >
      <div className="h-[60%] w-full flex flex-col items-center justify-center">
        {/* <TeamJersey
          teamId={athlete.athlete.team_id}
          className="max-h-10 min-h-10 object-contain"
          hideFade
        /> */}
        <img
          src={getTeamJerseyImage(athlete.athlete.team_id)}
          className="max-h-10 min-h-10 object-contain scale-150 object-top pt-2"
          alt=""
        />
      </div>

      <div
        className={twMerge(
          'text-center bg-white p-2 dark:bg-slate-800/60 truncate border-t dark:border-slate-700 h-[40%] pt-1 w-full flex  flex-col items-center justify-center ',
          showWarning && 'bg-yellow-200 dark:bg-yellow-900/30'
        )}
      >
        <p className="text-[10px] max-w-20 text-center truncate">{athlete.athlete.athstat_firstname}</p>
        <SecondaryText
          className={twMerge('text-[10px] truncate', showWarning && 'text-yellow-600 dark:text-yellow-200')}
        >
          {athlete.score ? Math.floor(athlete.score) : reportText}
        </SecondaryText>
      </div>
    </div>
  );
}
