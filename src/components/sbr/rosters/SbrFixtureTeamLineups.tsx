import { format } from "date-fns"
import { ISbrFixture, ISbrFixtureRosterItem } from "../../../types/sbr"
import SecondaryText from "../../ui/typography/SecondaryText"
import TabView, { TabViewHeaderItem, TabViewPage } from "../../ui/tabs/TabView"

type Props = {
  homeLineup: ISbrFixtureRosterItem[],
  awayLineup: ISbrFixtureRosterItem[],
  fixture: ISbrFixture
}

export default function SbrFixtureTeamRosters({ homeLineup, awayLineup, fixture }: Props) {

  const tabItems: TabViewHeaderItem[] = [
    {
      label: `${fixture.home_team}`,
      tabKey: 'home_team',
      className: "flex-1 text-xs md:text-sm"
    },

    {
      label: `${fixture.away_team}`,
      tabKey: 'away_team',
      className: "flex-1 text-xs md:text-sm"
    }
  ]

  const kickoff = fixture.kickoff_time
  const kickoffInfo = kickoff ? `(${format(kickoff, "HH:mm")} on ${format(kickoff, "EEEE dd MMMM yyyy")})` : "";

  return (
    <div className="flex flex-col gap gap-1" >
      <div className="flex flex-row items-center gap-1" >
        <h2 className="text-md font-semibold" >Team Lineups</h2>
      </div>

      <SecondaryText className="mb-2" >Don't forget to vote for Top Dawg of the Match 😤! Voting starts at kickoff {kickoffInfo}</SecondaryText>

      <TabView tabHeaderItems={tabItems} >
        <TabViewPage tabKey="home_team" >

          <SbrTeamRosterList
            roster={homeLineup}
          />
        </TabViewPage>

        <TabViewPage tabKey="away_team" >
          <SbrTeamRosterList
            roster={awayLineup}
          />
        </TabViewPage>

      </TabView>
    </div>
  )
}


type ListProps = {
  roster: ISbrFixtureRosterItem[]
}

/** Renders list of possible man of the match voting candidates */
export function SbrTeamRosterList({ roster }: ListProps) {
  return (
    <div>
      {roster
        .sort((a, b) => {
          return (a.jersey_number ?? 0) - (b.jersey_number ?? 0)
        })
        .map((r) => {
          return <TeamRosterItem
            candidate={r}
            key={r.athlete_id}
          />
        })}
    </div>
  )
}


type ItemProps = {
  candidate: ISbrFixtureRosterItem
}

export function TeamRosterItem({ candidate }: ItemProps) {

  return (

    <div className="flex gap-3 p-2 flex-row items-center" >

      <div className="border dark:border-slate-700 bg-slate-100 dark:bg-slate-800 w-10 h-10 items-center justify-center flex flex-col rounded-xl" >
        <SecondaryText>{candidate.jersey_number || "-"}</SecondaryText>
      </div>

      <div className="flex  w-[50%] flex-col items-start" >
        <p>{candidate.athlete_first_name} {candidate.athlete_last_name}</p>
        <SecondaryText className="text-xs md:text-sm flex flex-col gap-1" >
          {candidate.position ?? null}
        </SecondaryText>
      </div>
    </div>

  )
}
