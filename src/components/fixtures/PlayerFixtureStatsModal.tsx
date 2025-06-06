import { IBoxScoreItem } from "../../types/boxScore"
import { IFixture } from "../../types/games"
import DialogModal from "../shared/DialogModal"
import PlayerMugshot from "../shared/PlayerMugshot"
import RoundedCard from "../shared/RoundedCard"
import { StatCard } from "../shared/StatCard"

type AthleteStatsModalProps = {
  open?: boolean,
  onClose?: () => void,
  boxScoreRecord: IBoxScoreItem,
  fixture: IFixture
}

export default function PlayerFixtureStatsModal({ open, onClose, fixture, boxScoreRecord: bs }: AthleteStatsModalProps) {



  const fixPosition = (inStr: string) => {
    const parts = inStr.split("-");
    let outStr = "";

    parts.forEach((part) => {
      const partNormalised = part[0].toUpperCase() + part.slice(1);
      outStr += partNormalised + " ";
    });

    return outStr
  }

  const isHomePlayer = fixture.team_id === bs.athlete_team_id;

  return (
    <DialogModal open={open} className="gap-6 flex dark:text-white text-slate-700 flex-col" onClose={onClose} title={bs.athlete_first_name + " " + bs.athlete_last_name} >

      <div className="flex flex-row items-center justify-start gap-3" >
        <PlayerMugshot className="w-20 h-20" url={bs.athlete_image_url} />

        <div className="flex-col" >
          <p className="text-lg font-bold" >{bs.athlete_first_name} {bs.athlete_last_name}</p>
          <p className="text-slate-400 font-bold" >{bs.athlete_position && fixPosition(bs.athlete_position)}</p>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3" >

        <StatCard
          label="Team"
          valueClassName="text-md"
          value={isHomePlayer ? fixture.team_name : fixture.opposition_team_name}
        />

        <StatCard
          label="Minutes Played"
          value={bs.minutesplayed}
        />

        <StatCard
          label="Power Ranking"
          value={bs.athlete_match_power_ranking?.toFixed(1)}
        />

        {/* <StatCard
          label="Points"
          value={bs.points}
        /> */}

      </div>

      <RoundedCard className="grid bg-slate-100  rounded-xl dark:bg-slate-800/60  p-4 dark:border-slate-600 border-slate-300 grid-cols-1 gap-1" >

        <p className="text-lg font-bold" >Attacking Stats</p>

        {/* <StatsRow
          label="Points"
          value={bs.points}
        /> */}

        <StatsRow
          label="Tries"
          value={bs.tries}
        />

        <StatsRow
          label="Passes"
          value={bs.passes}
        />

        <StatsRow
          label="Carries"
          value={bs.carries}
        />

        <StatsRow
          label="Offloads"
          value={bs.offloads}
        />

        <StatsRow
          label="Defenders Beaten"
          value={bs.defendersbeaten}
        />

        <StatsRow
          label="Line Breaks"
          value={bs.linebreaks}
        />

        <StatsRow
          label="Turn Overs Conceded"
          value={bs.turnoversconceded}
        />

      </RoundedCard>

      <RoundedCard className="grid bg-slate-100 dark:bg-slate-800/60 rounded-xl  p-4 dark:border-slate-600 border-slate-300 grid-cols-1 gap-1" >

        <p className="text-lg font-bold" >Defensive Stats</p>

        <StatsRow
          label="Tackles Success"
          value={Math.floor(bs.tacklesuccess * 100) + "%"}
        />

        <StatsRow
          label="Tackles Made"
          value={bs.tacklesmade}
        />

        <StatsRow
          label="Tackled Missed"
          value={bs.tacklesmissed}
        />

        <StatsRow
          label="Turnovers Won"
          value={bs.turnoverswon}
        />

        <StatsRow
          label="Line Breaks Won Steal"
          value={bs.lineoutswonsteal}
        />

        <StatsRow
          label="Penalties Conceded"
          value={bs.penaltiesconceded}
        />

      </RoundedCard>

      <RoundedCard className="grid bg-slate-100 dark:bg-slate-800/60 rounded-xl  p-4 dark:border-slate-600 border-slate-300 grid-cols-1 gap-1" >

        <p className="text-lg font-bold" >Kicking Stats</p>

        <StatsRow
          label="Kicks From Hand"
          value={bs.kicksfromhand}
        />

        <StatsRow
          label="Metres"
          value={bs.kicksfromhandmetres}
        />

      </RoundedCard>

      <RoundedCard className="grid bg-slate-100 dark:bg-slate-800/60 rounded-xl  p-4 dark:border-slate-600 border-slate-300 grid-cols-1 gap-1" >

        <p className="text-lg font-bold" >Descipline Stats</p>

        <StatsRow
          label="Red Cards"
          value={bs.redcards}
        />

        <StatsRow
          label="Yellow Cards"
          value={bs.yellowcards}
        />

      </RoundedCard>


    </DialogModal >
  )
}

type StatProps = {
  label?: string,
  value?: string | number
}

function StatsRow({ value, label }: StatProps) {
  return (
    <div className="flex  flex-row items-center" >

      <div className="flex flex-[3]" >
        <p className="text-slate-700 dark:text-slate-400" >{label}</p>
      </div>

      <div className="flex flex-1" >
        <p>{value}</p>
      </div>
    </div>
  )
}