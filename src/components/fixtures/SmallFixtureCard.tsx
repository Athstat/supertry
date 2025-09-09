import { format } from "date-fns"
import { IFixture } from "../../types/games"
import SecondaryText from "../shared/SecondaryText"
import TeamLogo from "../team/TeamLogo"
import { fixtureSumary } from "../../utils/fixtureUtils"
import { Fragment, useState } from "react"
import { analytics } from "../../services/analytics/anayticsService"
import { FixtureCardModal } from "./FixtureCard"
import { twMerge } from "tailwind-merge"
import ProFixtureVotingBox from "./voting/ProFixtureVotingBox"

type Props = {
    fixture: IFixture
}

export default function SmallFixtureCard({ fixture }: Props) {

    const { hasNotStarted, matchFinal } = fixtureSumary(fixture);
    const [showModal, setShowModal] = useState(false);

    const toggle = () => setShowModal(prev => !prev);

    const handleClick = () => {
        analytics.trackFixtureCardClicked(fixture);
        toggle();
    }

    return (
        <Fragment>
            <div
                onClick={handleClick}
                className={twMerge(
                    'border dark:border-slate-700 cursor-pointer dark:bg-slate-800/20  rounded-xl p-6 flex flex-col gap-4',
                    'hover:bg-white dark:hover:bg-slate-800/40'
                )}
            >
                <div>
                    <SecondaryText>{fixture.competition_name} - Week {fixture.round}</SecondaryText>
                </div>

                <div className="flex flex-row items-center gap-2 divide-x dark:divide-slate-700" >

                    <div className="flex flex-col gap-2 w-2/3" >
                        <div className="flex flex-row items-center justify-between" >
                            <div className="flex flex-row items-center gap-2" >

                                <TeamLogo
                                    url={fixture.team?.image_url}
                                    teamName={fixture.team?.athstat_name}
                                    className="w-8 h-8"
                                />
                                <p className="text-sm" >{fixture.team?.athstat_name}</p>
                            </div>

                            <div>
                                {!hasNotStarted ? <p>{fixture.team_score}</p> : ''}
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-between" >
                            <div className="flex flex-row items-center gap-2" >

                                <TeamLogo
                                    url={fixture.opposition_team?.image_url}
                                    teamName={fixture?.opposition_team?.athstat_name}
                                    className="w-8 h-8"
                                />
                                <p className="text-sm" >{fixture?.opposition_team?.athstat_name}</p>
                            </div>



                            <div>
                                {!hasNotStarted ? <p>{fixture.opposition_score}</p> : ''}
                            </div>
                        </div>
                    </div>

                    <div className="flex text-xs flex-col w-1/3 p-2 items-center justify-center" >
                        {!matchFinal && fixture.kickoff_time && <SecondaryText className="text-xs" >{format(fixture.kickoff_time, 'HH:mm')}</SecondaryText>}
                        {matchFinal && <SecondaryText className="text-xs" >Final</SecondaryText>}
                        {fixture.kickoff_time && <SecondaryText className="text-xs" >{format(fixture.kickoff_time, 'dd MMM yyy')}</SecondaryText>}
                    </div>

                </div>

                <ProFixtureVotingBox fixture={fixture} />
            </div>

            <FixtureCardModal 
                fixture={fixture}
                onClose={toggle}
                showModal={showModal}
            />
        </Fragment>
    )
}
