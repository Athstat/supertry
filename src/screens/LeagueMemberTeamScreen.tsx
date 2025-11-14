import { useParams } from "react-router-dom";
import PageView from "./PageView";
import TeamHistoryProvider from "../providers/fantasy-teams/TeamHistoryProvider";
import FantasyLeagueGroupDataProvider from "../components/fantasy-league/providers/FantasyLeagueGroupDataProvider";


export default function LeagueMemberTeamScreen() {

    const {leagueId } = useParams<{leagueId?: string, userId?: string}>();

    return (
        <PageView>
            <FantasyLeagueGroupDataProvider
                leagueId={leagueId}
            >
                <TeamHistoryProvider>

                </TeamHistoryProvider>
            </FantasyLeagueGroupDataProvider>
        </PageView>
    )
}
