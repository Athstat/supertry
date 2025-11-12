import { ReactNode, useEffect, useState } from "react"
import { IFantasyLeagueRound, IFantasyLeagueTeam } from "../../types/fantasyLeague"
import { useAuth } from "../../contexts/AuthContext";
import FantasyLeagueTeamProvider from "../../components/fantasy-leagues/my-team/FantasyLeagueTeamProvider";


type Props = {
    leagueRound: IFantasyLeagueRound,
    children?: ReactNode
}

/** Providers a sudo Fantasy Team Provider in order to create a fantasy team */
export default function CreateFantasyTeamProvider({leagueRound, children}: Props) {

    const [fakeTeam, setTeamFakeTeam] = useState<IFantasyLeagueTeam>();
    const {authUser} = useAuth();

    useEffect(() => {
        const faker = () => {

            if (!authUser) {
                return;
            }

            const fakeId = new Date().valueOf();
            const fakeClubId = fakeId + 1000;

            const fakeObj: IFantasyLeagueTeam = {
                id: fakeId,
                rank: 0,
                overall_score: 0,
                team_id: fakeClubId.toString(),
                league_id: leagueRound.id,
                position: 0,
                position_change: 0,
                score: 0,
                is_admin: false,
                join_date: new Date(),
                team_name: authUser.username,
                user_id: authUser.kc_id,
                first_name: authUser.first_name,
                last_name: authUser.last_name,
                athletes: []
            } 

            setTeamFakeTeam(fakeObj);
        }

        faker();

    }, [authUser, fakeTeam, leagueRound.id]);

    if (!fakeTeam) {
        return;
    }

    return (
        <FantasyLeagueTeamProvider
            team={fakeTeam}
            leagueRound={leagueRound}
        >
            {children}
        </FantasyLeagueTeamProvider>
    )
}
