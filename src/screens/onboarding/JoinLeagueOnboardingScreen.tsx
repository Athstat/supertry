

/** Renders the join league onboarding screen where user can
 * join a league and be redirected from there!
 */

import ScrummyLogoHorizontal from "../../components/branding/scrummy_logo_horizontal"
import PageView from "../PageView"

type Props = {

}

export default function JoinLeagueOnboardingScreen({} : Props) {
  return (
    <PageView  className="flex flex-col items-center">

        <div>
            <ScrummyLogoHorizontal />
        </div>

        <div>
            <p className="text-3xl font-bold" >Join a league</p>
        </div>

    </PageView>
  )
}
