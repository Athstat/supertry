import { IBoxScore } from "../../types/boxScore"
import { IFantasyAthlete } from "../../types/rugbyPlayer"
import DialogModal from "../shared/DialogModal"
import { GroupedStatsGrid } from "../shared/GroupedStatsGrid"
import PlayerMugshot from "../shared/PlayerMugshot"
import { StatCard } from "../shared/StatCard"

type AthleteStatsModalProps = {
  open?: boolean,
  onClose?: () => void,
  athlete: IFantasyAthlete,
  boxScoreRecord: IBoxScore
}

export default function AthleteFixtureStatsModal({ open, onClose, boxScoreRecord: bs, athlete }: AthleteStatsModalProps) {

  JSON.stringify(athlete);

  return (
    <DialogModal open={open} className="gap-6 flex dark:text-white flex-col" onClose={onClose} title={athlete.player_name} >

      <div className="flex flex-row items-center justify-start gap-3" >
        <PlayerMugshot athlete={athlete} />

        <div className="flex-col" >
          <p className="text-lg font-bold" >{athlete.athstat_firstname}</p>
          <p className="text-slate-400 font-medium" >{athlete.position}</p>
        </div>

      </div>

      <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent" className="grid-cols-3" title="Game Performance" >
        {<StatCard
          label="Minutes Played"
          value={bs.minutesplayed}
        />}

        {<StatCard
          label="Points"
          value={bs.points}
        />}

      </GroupedStatsGrid>

      <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " className="grid grid-cols-3 p-0" title="Attack" >
        
        {<StatCard
          label="Tries"
          value={bs.tries}
        />}

        {<StatCard
          label="Passes"
          value={bs.passes}
        />}

        {<StatCard
          label="Carries"
          value={bs.carries}
        />}

        {<StatCard
          label="Offloads"
          value={bs.offloads}
        />}

        {<StatCard
          label="Line Breaks"
          value={bs.linebreaks}
        />}


        {<StatCard
          label="Penalty Goals Scored"
          value={bs.penaltygoalsscored}
        />}
      </GroupedStatsGrid>

      <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " className="grid grid-cols-3 p-0" title="Defense" >
        {<StatCard
          label="Tackles"
          value={bs.tacklesmade}
        />}

        {<StatCard
          label="Tackle %"
          value={`${Math.floor(bs.tacklesuccess * 100)}%`}
        />}

        {<StatCard
          label="Turnovers Won"
          value={bs.turnoverswon}
        />}

        {<StatCard
          label="Retained Kicks"
          value={bs.retainedkicks}
        />}

      </GroupedStatsGrid>

      <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " className="grid grid-cols-3 p-0" title="Kicking" >

        {<StatCard
          label="Kicks From Hand"
          value={bs.kicksfromhand}
        />}


        {<StatCard
          label="Kicks From Hand Metres"
          value={bs.kicksfromhandmetres}
        />}

        {<StatCard
          label="Covertions"
          value={`${bs.conversionsscored}/${bs.conversionsscored + bs.conversionsmissed}`}
        />}

        {<StatCard
          label="Try Kicks"
          value={bs.trykicks}
        />}

      </GroupedStatsGrid>

      <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " className="grid grid-cols-3 p-0" title="Displine" >
        {<StatCard
          label="Penalties Conceded"
          value={bs.penaltiesconceded}
        />}

        {<StatCard
          label="Yellow Cards"
          value={bs.yellowcards}
        />}

        {<StatCard
          label="Red Cards"
          value={0}
        />
        }
      </GroupedStatsGrid>

    </DialogModal>
  )
}