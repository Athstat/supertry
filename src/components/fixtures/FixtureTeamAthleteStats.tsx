import { useState } from "react"
import { IFixture } from "../../types/games"
import DialogModal from "../shared/DialogModal"
import TitledCard from "../shared/TitledCard"
import PlayerMugshot from "../shared/PlayerMugshot"
import { GroupedStatsGrid } from "../shared/GroupedStatsGrid"
import { StatCard } from "../shared/StatCard"

type Props = {
  fixture: IFixture,
  teamName?: string,
}

export default function FixtureTeamAthleteStats({ teamName, fixture }: Props) {

  const [showModal, setShowModal] = useState(false);
  const toogle = () => setShowModal(!showModal);

  return (
    <TitledCard title={teamName} >
      <table className="w-full" >
        <thead>
          <tr>
            <th>Name</th>
            <th>Tries</th>
            <th>Assits</th>
            <th>Tackes %</th>
            <th>Carries</th>
          </tr>
        </thead>

        <tbody onClick={toogle} >
          <tr className="hover:bg-slate-700/30" >
            <td>J. Doe</td>
            <td>1</td>
            <td>0</td>
            <td>88%</td>
            <td>3</td>
          </tr>

          <tr className="hover:bg-slate-700/30" >
            <td>S. Kolisi</td>
            <td>0</td>
            <td>1</td>
            <td>90%</td>
            <td>5</td>
          </tr>

          <tr className="hover:bg-slate-700/30" >
            <td>J. Watt</td>
            <td>2</td>
            <td>0</td>
            <td>79%</td>
            <td>15</td>
          </tr>
        </tbody>
      </table>

      <AthleteFixtureStatsModal open={showModal} fixture={fixture} teamName={teamName} />
    </TitledCard>
  )
}

type AthleteStatsModalProps = {
  fixture: IFixture,
  teamName?: string,
  open?: boolean,
  onClose?: () => void
}

function AthleteFixtureStatsModal({ fixture, teamName, open, onClose }: AthleteStatsModalProps) {

  return (
    <DialogModal open={open} className="gap-3 flex flex-col" onClose={onClose} title="John Doe" >
      <div className="flex flex-row items-center justify-start gap-3" >
        <PlayerMugshot />

        <div className="flex-col" >
          <p className="text-lg font-bold" >John Doe</p>
          <p className="text-slate-400 font-medium" >Half Back</p>
        </div>
      </div>

      <GroupedStatsGrid wrapperClassName="p-0 bg-transparent dark:bg-transparent " title="Game Performance" >
        <StatCard 
          label="Minutes Played"
          value={66}
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