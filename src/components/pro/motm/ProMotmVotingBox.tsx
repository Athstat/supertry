import { IFixture } from "../../../types/games";
import TabView, { TabViewHeaderItem, TabViewPage } from "../../shared/tabs/TabView";
import SecondaryText from "../../shared/SecondaryText";
import { ProMotmVotingCandidateList } from "./ProMotmVotingCandidateList";
import { useAtomValue } from "jotai";
import { 
    hasUserSubmittedProMotmAtom, 
    proGameMotmCandidatesAtom, 
    proGameMotmVotesAtom 
} from "../../../state/proMotm.atoms";
import { ScopeProvider } from "jotai-scope";
import ProMotmVotingDataProvider from "./ProMotmVotingDataProvider";
import NoContentCard from "../../shared/NoContentMessage";
import { hasProMotmVotingEnded, proFixtureSummary } from "../../../utils/proMotmUtils";
import ProMotmWinnerCard from "./ProMotmWinnerCard";
import FixtureRosters from "../../fixtures/FixtureRosters";
import { Trophy } from "lucide-react";

type Props = {
    fixture: IFixture;
}

export default function ProMotmVotingBox({ fixture }: Props) {
    const atoms = [
        proGameMotmCandidatesAtom, 
        hasUserSubmittedProMotmAtom, 
        proGameMotmVotesAtom
    ];

    return (
        <ScopeProvider atoms={atoms}>
            <ProMotmVotingDataProvider fixture={fixture}>
                <ProMotmVotingBoxContent fixture={fixture} />
            </ProMotmVotingDataProvider>
        </ScopeProvider>
    );
}

type ContentProps = {
    fixture: IFixture;
}

export function ProMotmVotingBoxContent({ fixture }: ContentProps) {
    const kickoff = fixture.kickoff_time;
    const { hasKickedOff } = proFixtureSummary(fixture);
    const candidates = useAtomValue(proGameMotmCandidatesAtom);
    const hasVotingEnded = hasProMotmVotingEnded(fixture.kickoff_time);

    if (!kickoff) return undefined;

    const tabItems: TabViewHeaderItem[] = [
        {
            label: `${fixture.team.athstat_name}`,
            tabKey: 'home_team',
            className: "flex-1 text-xs md:text-sm"
        },
        {
            label: `${fixture.opposition_team.athstat_name}`,
            tabKey: 'away_team',
            className: "flex-1 text-xs md:text-sm"
        }
    ];

    const homeCandidates = candidates.filter((r) => {
        return r.team_id === fixture.team.athstat_id;
    });

    const awayCandidates = candidates.filter((r) => {
        return r.team_id === fixture.opposition_team.athstat_id;
    });

    if (candidates.length === 0) {
        return (
            <>
                <NoContentCard message={
                    `Team Rosters ${hasVotingEnded ? "were not" : "are not yet"} available for this game`
                } />
            </>
        );
    }

    if (candidates.length > 0 && !hasKickedOff) {
        return (
            <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-xl p-6">
                    <div className="flex flex-row items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-full">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-primary-800 dark:text-primary-200">
                                Top Dawg Voting Coming Soon! 😤
                            </h3>
                            <SecondaryText className="text-primary-700 dark:text-primary-300">
                                Get ready to vote for your Top Dawg of the Match
                            </SecondaryText>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold mb-2">How it works:</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                <span>Voting opens immediately after kickoff</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                <span>Vote for a player of your chosing from either team who you thought was the top dawg of match</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                <span>You can change your vote during the match</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                <span>Voting closes 1 hour after the game</span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <SecondaryText className="text-sm">
                            Check out the team rosters below to see who might be your Top Dawg! 🏆
                        </SecondaryText>
                    </div>
                </div>
                
                <FixtureRosters rosters={candidates} fixture={fixture} />
            </div>
        );
    }

    if (hasVotingEnded) {
        return (
            <ProMotmWinnerCard fixture={fixture} />
        );
    }

    return (
        <div className="flex flex-col gap gap-1">
            <div className="flex flex-row items-center gap-1">
                <h2 className="text-md font-semibold">Top Dawg Of The Match</h2>
            </div>

            <SecondaryText className="mb-2">
                Vote for the player who was your Top Dawg of the Match 😤
            </SecondaryText>

            <TabView tabHeaderItems={tabItems}>
                <TabViewPage tabKey="home_team">
                    <ProMotmVotingCandidateList roster={homeCandidates} />
                </TabViewPage>

                <TabViewPage tabKey="away_team">
                    <ProMotmVotingCandidateList roster={awayCandidates} />
                </TabViewPage>
            </TabView>
        </div>
    );
}
