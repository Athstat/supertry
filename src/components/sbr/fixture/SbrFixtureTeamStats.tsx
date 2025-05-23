import { ISbrBoxscoreItem, ISbrFixture } from "../../../types/sbr"

type Props = {
    fixture: ISbrFixture,
    boxscore: ISbrBoxscoreItem[]
}

export default function SbrFixtureTeamStats({fixture, boxscore} : Props) {
  return (
    <div>{fixture.home_team}</div>
  )
}
