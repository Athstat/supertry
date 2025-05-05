import { IFixture } from "../../types/games"
import DialogModal from "../shared/DialogModal"
import { GroupedStatsGrid } from "../shared/GroupedStatsGrid"
import PlayerMugshot from "../shared/PlayerMugshot"
import { StatCard } from "../shared/StatCard"

type AthleteStatsModalProps = {
    fixture: IFixture,
    open?: boolean,
    onClose?: () => void
  }
  
export default function AthleteFixtureStatsModal({ open, onClose }: AthleteStatsModalProps) {
  
    return (
      <DialogModal open={open} className="gap-6 flex flex-col" onClose={onClose} title="John Doe" >
  
        <div className="flex flex-row items-center justify-start gap-3" >
          <PlayerMugshot />
  
          <div className="flex-col" >
            <p className="text-lg font-bold" >John Doe</p>
            <p className="text-slate-400 font-medium" >Half Back</p>
          </div>
  
        </div>
  
        <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent" className="grid-cols-3" title="Game Performance" >
          <StatCard
            label="Minutes Played"
            value={66}
          />
  
          <StatCard
            label="Rating"
            value={9.5}
          />
  
          <StatCard
            label="Points"
            value={10}
          />
  
        </GroupedStatsGrid>
  
        <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " className="grid grid-cols-3 p-0" title="Attack" >
          <StatCard
            label="Tries"
            value={0}
          />
  
          <StatCard
            label="Assits"
            value={2}
          />
  
          <StatCard
            label="Carries"
            value={0}
          />
  
          <StatCard
            label="Meters Gained"
            value={100}
          />
  
          <StatCard
            label="Line Breaks"
            value={0}
          />
        </GroupedStatsGrid>
  
        <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " className="grid grid-cols-3 p-0" title="Defense" >
          <StatCard
            label="Tackles"
            value={10}
          />
  
          <StatCard
            label="Tackle %"
            value={"90%"}
          />
  
          <StatCard
            label="Turnovers Won"
            value={2}
          />
  
        </GroupedStatsGrid>
  
        <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " className="grid grid-cols-3 p-0" title="Kicking" >
          <StatCard
            label="Kicks From Hand"
            value={3}
          />
  
          <StatCard
            label="Metres"
            value={58}
          />
  
          <StatCard
            label="Try Kicks"
            value={1}
          />
  
        </GroupedStatsGrid>
  
        <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " className="grid grid-cols-3 p-0" title="Displine" >
          <StatCard
            label="Penalties Conceded"
            value={1}
          />
  
          <StatCard
            label="Yellow Cards"
            value={0}
          />
  
          <StatCard
            label="Red Cards"
            value={0}
          />
  
        </GroupedStatsGrid>
  
      </DialogModal>
    )
  }