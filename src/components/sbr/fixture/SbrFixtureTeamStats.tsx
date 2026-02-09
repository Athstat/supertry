import { Shield } from "lucide-react"
import { ISbrBoxscoreItem } from "../../../types/sbr"
import TitledCard from "../../ui/cards/TitledCard"
import SbrTeamLogo from "../fixtures/SbrTeamLogo"
import { twMerge } from "tailwind-merge"
import { useAtomValue } from "jotai"
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom } from "../../../state/sbrFixtureScreen.atoms"
import { sumMultipleSbrBoxscoreActions } from "../../../utils/sbrUtils"

export default function SbrFixtureTeamStats() {

  const fixture = useAtomValue(sbrFixtureAtom);
  const boxscore = useAtomValue(sbrFixtureBoxscoreAtom);
  const record: Record<string, SbrAggregateStat> = {};
  const aggregated = aggregateSbrBoxscoreStats(boxscore);

  if (!fixture) return;

  aggregated.forEach((b) => {
    record[b.action] = b;
  });

  const homePenaltyCount = sumMultipleSbrBoxscoreActions(
    boxscore, penaltyActions, 2
  )

  const awayPenaltyCount = sumMultipleSbrBoxscoreActions(
    boxscore, penaltyActions, 1
  )

  console.log("Away Penalty Count: ", awayPenaltyCount);
  console.log("Home Penalty Count: ", homePenaltyCount);

  const statsArr: HeadToHeadStat[] = [
    {
      label: "Points",
      homeValue: fixture.home_score,
      awayValue: fixture.away_score,
      homeRealVal: fixture.home_score,
      awayRealVal: fixture.away_score
    },

    {
      label: "Tries",
      homeValue: record["Try"]?.homeCount,
      awayValue: record["Try"]?.awayCount,
      homeRealVal: record["Try"]?.homeCount,
      awayRealVal: record["Try"]?.awayCount,
    },

    {
      label: "Conversions Made",
      homeValue: record["Conversion"]?.homeCount,
      awayValue: record["Conversion"]?.awayCount,
      homeRealVal: record["Conversion"]?.homeCount,
      awayRealVal: record["Conversion"]?.awayCount,
    },

    {
      label: "Drop Goals Scored",
      homeValue: record["Drop Goal"]?.homeCount,
      awayValue: record["Drop Goal"]?.awayCount,
      homeRealVal: record["Drop Goal"]?.homeCount,
      awayRealVal: record["Drop Goal"]?.awayCount,
    },

    {
      label: "Penalty Kick Scored",
      homeValue: `${record["Penalty Kick Scored"]?.homeCount}/${record["Option: Kick At Goal"]?.homeCount}`,
      awayValue: `${record["Penalty Kick Scored"]?.awayCount}/${record["Option: Kick At Goal"]?.awayCount}`,
      homeRealVal: record["Penalty Kick Scored"]?.homeCount,
      awayRealVal: record["Penalty Kick Scored"]?.awayCount,
    },


    {
      label: "Interceptions",
      homeValue: record["Interception"]?.homeCount,
      awayValue: record["Interception"]?.awayCount,
      homeRealVal: record["Interception"]?.homeCount,
      awayRealVal: record["Interception"]?.awayCount,
    },

    {
      label: "Lineouts",
      homeValue: record["Lineout"]?.homeCount,
      awayValue: record["Lineout"]?.awayCount,
      homeRealVal: record["Lineout"]?.homeCount,
      awayRealVal: record["Lineout"]?.awayCount,
    },

    {
      label: "Lineouts Won",
      homeValue: record["Lineout Won"]?.homeCount,
      awayValue: record["Lineout Won"]?.awayCount,
      homeRealVal: record["Lineout Won"]?.homeCount,
      awayRealVal: record["Lineout Won"]?.awayCount,
    },

    {
      label: "Scrums Won",
      homeValue: record["Scrum Won"]?.homeCount,
      awayValue: record["Scrum Won"]?.awayCount,
      homeRealVal: record["Scrum Won"]?.homeCount,
      awayRealVal: record["Scrum Won"]?.awayCount,
    },
    {
      label: "Turn Overs",
      homeValue: record["Turn Over"]?.homeCount,
      awayValue: record["Turn Over"]?.awayCount,
      homeRealVal: record["Turn Over"]?.homeCount,
      awayRealVal: record["Turn Over"]?.awayCount,
    },

    {
      label: "Yellow Cards",
      homeValue: record["Yellow Card"]?.homeCount,
      awayValue: record["Yellow Card"]?.awayCount,
      homeRealVal: record["Yellow Card"]?.homeCount,
      awayRealVal: record["Yellow Card"]?.awayCount,
    },

    {
      label: "Red Cards",
      homeValue: record["Red Card"]?.homeCount,
      awayValue: record["Red Card"]?.awayCount,
      homeRealVal: record["Red Card"]?.homeCount,
      awayRealVal: record["Red Card"]?.awayCount,
    },

    {
      label: "Turn Overs",
      homeValue: record["Turn Over"]?.homeCount,
      awayValue: record["Turn Over"]?.awayCount,
      homeRealVal: record["Turn Over"]?.homeCount,
      awayRealVal: record["Turn Over"]?.awayCount
    },

    {
      label: "Penalties Conceded",
      homeValue: homePenaltyCount,
      awayValue: awayPenaltyCount,
      homeRealVal: homePenaltyCount,
      awayRealVal: awayPenaltyCount
    },

    // {
    //   label: "Drop Goals",
    //   homeValue: homeStats.dropGoalsScored,
    //   awayValue: awayStats.dropGoalsScored,
    //   homeRealVal: homeStats.dropGoalsScored,
    //   awayRealVal: awayStats.dropGoalsScored
    // },

    // {
    //     label: "Total Kicks at Goal",
    //     homeValue: homeStats.kicksAtGoal,
    //     awayValue: awayStats.kicksAtGoal
    // },

    // {
    //     label: "Rucks Won",
    //     homeValue: homeStats.,
    //     awayValue: 15
    // },

    // {
    //   label: "Lineouts Won",
    //   homeValue: homeStats.lineOutsWon,
    //   awayValue: awayStats.lineOutsWon,
    //   homeRealVal: homeStats.lineOutsWon,
    //   awayRealVal: awayStats.lineOutsWon
    // },

    // {
    //     label: "Scrums won",
    //     homeValue: 8,
    //     awayValue: 7
    // },

    // {
    //   label: "Turnovers Won",
    //   homeValue: homeStats.turnoversWon,
    //   awayValue: awayStats.turnoversWon,
    //   homeRealVal: homeStats.turnoversWon,
    //   awayRealVal: awayStats.turnoversWon
    // },

    // {
    //   label: "Turnovers Conceded",
    //   homeValue: homeStats.turnoversConceded,
    //   awayValue: awayStats.turnoversConceded,
    //   homeRealVal: homeStats.turnoversConceded,
    //   awayRealVal: awayStats.turnoversConceded
    // },

    // {
    //   label: "Yellow Cards",
    //   homeValue: homeStats.yellowCards,
    //   awayValue: awayStats.yellowCards,
    //   homeRealVal: homeStats.yellowCards,
    //   awayRealVal: awayStats.yellowCards,
    // },

    // {
    //   label: "Red Card",
    //   homeValue: homeStats.redCards,
    //   awayValue: awayStats.redCards,
    //   homeRealVal: homeStats.redCards,
    //   awayRealVal: awayStats.redCards
    // }

  ]

  return (
    <TitledCard title="Team Stats" icon={Shield} >

      <div className="flex flex-col gap-2" >

        <div className="flex flex-row gap-1" >
          <div className="flex flex-1 items-center justify-start" >
            <SbrTeamLogo className="w-6 h-6" teamName={fixture.home_team.team_name} />
          </div>
          <div className="flex flex-[3] items-center justify-center text-center " >
            <p>Team Stats</p>
          </div>
          <div className="flex flex-1 items-center justify-end" >
            <SbrTeamLogo className="w-6 h-6" teamName={fixture.away_team.team_name} />
          </div>
        </div>

        {statsArr.map((stat, index) => {
          return <HeadToHeadItem stat={stat} key={index} />
        })}
      </div>

      {/* <div className="mt-5" >
                    {statsArr.length > 5 && !showMore && <button onClick={toogleShowMore} className="text-blue-400 hover:text-blue-500" >Show more</button>}
                    {statsArr.length > 5 && showMore && <button onClick={toogleShowMore} className="text-blue-400 hover:text-blue-500" >Show less</button>}
                </div> */}
    </TitledCard>
  )
}


type HeadToHeadStat = {
  label?: string,
  homeValue?: number | string,
  awayValue?: number | string,
  homeRealVal?: number,
  awayRealVal?: number,
  badStat?: boolean
}

type HeadToHeadProps = {
  stat: HeadToHeadStat
}

function HeadToHeadItem({ stat }: HeadToHeadProps) {
  const { homeRealVal, awayRealVal } = stat;

  if (homeRealVal === undefined || awayRealVal == undefined) {
    return;
  }

  const statsNotNull = homeRealVal !== undefined && awayRealVal !== undefined;
  const homeTeamWonCategory = statsNotNull && (homeRealVal > awayRealVal);
  const awayTeamWonCategory = statsNotNull && (homeRealVal < awayRealVal);

  return (
    <div className="flex flex-row " >

      <div className="flex flex-1 items-center justify-start" >
        <p className={twMerge("h-full rounded-xl w-10 flex flex-col items-center justify-center",
          homeTeamWonCategory && "bg-blue-700 text-white"
        )} >{stat.homeValue}</p>
      </div>

      <div className="flex flex-[3] items-center justify-center text-center " >
        <p className="text-slate-700 font-medium dark:text-slate-400" >{stat.label}</p>
      </div>

      <div className="flex flex-1  items-center justify-end" >
        <p className={twMerge("h-full rounded-xl w-10 flex flex-col items-center justify-center",
          awayTeamWonCategory && "bg-blue-700 text-white"
        )} >{stat.awayValue}</p>
      </div>
    </div>
  )
}

export type SbrAggregateStat = {
  action: string,
  homeCount: number,
  awayCount: number
}

export function aggregateSbrBoxscoreStats(data: ISbrBoxscoreItem[]) {
  const events = new Set<string>();
  const record: SbrAggregateStat[] = [];

  data.forEach((e) => {
    if (!events.has(e.action)) {
      events.add(e.action as string);
    }
  });

  console.log("Events ", events);

  events.forEach((e) => {
    const homeCount = data
      .filter((x) => x.team_id === 1)
      .reduce((prev, x) => {
        return x.action === e ? prev + x.count : prev;
      }, 0);

    const awayCount = data
      .filter((x) => { return x.team_id === 2 })
      .reduce((prev, x) => {
        return x.action === e ? prev + x.count : prev
      }, 0);

    record.push({ action: e, homeCount, awayCount });
  });

  return record;
}

const penaltyActions = [
  "Penalty For Dangerous Tackle", "Penalty For Offside",
  "Penalty For Not Releasing Ball", "Penalty For Not Releasign Player",
  "Penalty For Violent/Foul Play", "Penalty",
  "Penalty For Offside At Kick", "Penalty For Ruck Offence",
  "Penalty For Lineout"
];
