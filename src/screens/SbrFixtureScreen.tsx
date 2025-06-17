import { useNavigate, useParams } from "react-router-dom";
import PageView from "./PageView";
import { ErrorState } from "../components/ui/ErrorState";
import { ArrowLeft, Minus } from "lucide-react";
import BlueGradientCard from "../components/shared/BlueGradientCard";
import SbrTeamLogo from "../components/sbr/fixtures/SbrTeamLogo";
import TabView, { TabViewHeaderItem, TabViewPage } from "../components/shared/tabs/TabView";
import { sbrFixtureSummary } from "../utils/sbrUtils";
import { ISbrFixture } from "../types/sbr";
import { format } from "date-fns";
import SbrFixtureKickOffInfo from "../components/sbr/fixture/SbrFixtureKickOffInfo";
import SbrFixtureTeamStats from "../components/sbr/fixture/SbrFixtureTeamStats";
import SbrMotmVotingBox from "../components/sbr/motm/SbrMotmVotingBox";
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureEventsAtom } from "../state/sbrFixtureScreen.atoms";
import { ScopeProvider } from "jotai-scope";
import SbrFixtureDataProvider from "../components/sbr/fixture/SbrFixtureDataProvider";
import { useAtomValue } from "jotai";
import SbrFixtureTimeline from "../components/sbr/fixture/SbrFixtureTimeline";

export default function SbrFixtureScreen() {

    const { fixtureId } = useParams();

    if (!fixtureId) return <ErrorState message="Fixture was not found" />

    const atoms = [
        sbrFixtureAtom, sbrFixtureEventsAtom, sbrFixtureBoxscoreAtom
    ]

    return (
        <ScopeProvider atoms={atoms}>
            <SbrFixtureDataProvider fixtureId={fixtureId}>
                <SbrFixtureScreenContent />
            </SbrFixtureDataProvider>
        </ScopeProvider>
    )
}


function SbrFixtureScreenContent() {

    const fixture = useAtomValue(sbrFixtureAtom);
    const boxscore = useAtomValue(sbrFixtureBoxscoreAtom);
    const events = useAtomValue(sbrFixtureEventsAtom);

    const navigate = useNavigate();

    if (!fixture) return;

    const hasBoxscore = boxscore && boxscore.length > 0;
    const hasTimeline = events.length > 0;

    const tabHeaderItems: TabViewHeaderItem[] = [

        {
            label: "Timeline",
            tabKey: "timeline",
            disabled: !hasTimeline,
        },
        {
            label: "Team Stats",
            tabKey: "team-stats",
            disabled: !hasBoxscore,
        },

        {
            label: "Kick Off",
            tabKey: "kick-off"
        },

        {
            label: "Top Dawg",
            tabKey: "motm"
        }
    ];

    const { hasScores } = sbrFixtureSummary(fixture);

    return (
        <div>
            <BlueGradientCard className="p-4 w-full rounded-none h-56 bg-gradient-to-br lg:px-[15%] " >

                <div onClick={() => navigate(-1)} className="flex mb-5 lg:px-4 cursor-pointer w-full hover:text-blue-500 flex-row items-center justify-start" >
                    <ArrowLeft />
                    <p>Go Back</p>
                </div>


                <div className="flex flex-row h-max items-center justify-center w-full " >

                    <div className="flex flex-1 flex-col items-center justify-start gap-3" >
                        <SbrTeamLogo className="lg:hidden w-12 h-12 dark:text-slate-200 " teamName={fixture.home_team} />
                        <SbrTeamLogo className="lg:block hidden w-16 h-16 dark:text-slate-200 " teamName={fixture.home_team} />
                        <p className="text text-wrap text-center" >{fixture.home_team}</p>
                    </div>

                    <div className="flex flex-col flex-1" >
                        {hasScores && <MatchResultsInformation fixture={fixture} />}
                        {!hasScores && <KickOffInformation fixture={fixture} />}
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-3 justify-end" >
                        <SbrTeamLogo className="lg:hidden w-12 h-12 dark:text-slate-200 " teamName={fixture.away_team} />
                        <SbrTeamLogo className="lg:block hidden w-16 h-16 dark:text-slate-200 " teamName={fixture.away_team} />
                        <p className="text text-wrap text-center" >{fixture.away_team}</p>
                    </div>

                </div>

            </BlueGradientCard>

            <PageView className="p-4" >
                <TabView tabHeaderItems={tabHeaderItems}>
                    
                    <TabViewPage className="" tabKey="kick-off">
                        <SbrFixtureKickOffInfo fixture={fixture} />
                    </TabViewPage>

                    <TabViewPage tabKey="team-stats">
                        <SbrFixtureTeamStats/>
                    </TabViewPage>

                    <TabViewPage tabKey="timeline">
                        <SbrFixtureTimeline />
                    </TabViewPage>

                    <TabViewPage tabKey="motm" >
                        <SbrMotmVotingBox fixture={fixture} />
                    </TabViewPage>
                </TabView>
            </PageView>
        </div>
    )
}

type Props = {
    fixture: ISbrFixture
}

function KickOffInformation({ fixture }: Props) {

    const { kickoff_time } = fixture;

    if (!kickoff_time) {
        return (
            <div className='flex flex-1 text-nowrap flex-col dark:text-white text-center items-center justify-center' >
                <p className='font-bold' >VS</p>
            </div>
        )
    }

    return (
        <div className='flex flex-1 text-nowrap flex-col dark:text-white text-center items-center justify-center' >
            {<p className='font-bold' >VS</p>}
            {kickoff_time && <p className='dark:text-slate-300 text-slate-200' >{format(kickoff_time, "dd MMM yyyy")}</p>}
        </div>
    )
}

function MatchResultsInformation({ fixture }: Props) {

    const { kickoff_time } = fixture;

    return (
        <div className='flex justify-center  flex-1 w-full flex-col items-center' >

            <div>
                {/* {game_status && <span className='text text-slate-white font-semibold dark:text-slate-100' >{summerizeGameStatus(fixture)}</span>} */}
            </div>

            <div className='flex flex-1 flex-row gap-2 items-center justify-between' >
                {/* Home Team Score */}

                <div className='dark:text-white flex-1 text-3xl lg:text-4xl font-bold flex items-center justify-end' >
                    <p>{fixture.home_score}</p>
                </div>

                <div className='flex flex-1 flex-col dark:text-white text-center items-center justify-center' >
                    <Minus />
                </div>

                {/* Away Team Score */}
                <div className='dark:text-white  text-wrap flex-1 text-3xl lg:text-4xl font-bold flex items-center justify-start' >
                    <p>{fixture.away_score}</p>
                </div>
            </div>

            <div>
                {kickoff_time && <p className='dark:text-slate-300 text-slate-200' >{format(kickoff_time, "dd MMM yyyy")}</p>}
            </div>
        </div>
    )
}