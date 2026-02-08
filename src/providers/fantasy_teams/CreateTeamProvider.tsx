import { ReactNode, useEffect, useState } from "react"
import { IFantasyLeagueTeam } from "../../types/fantasyLeague"
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { useAuth } from "../../contexts/auth/AuthContext";
import MyTeamProvider from "../../contexts/fantasy/my_team/MyTeamContext";
import { IFixture } from "../../types/games";
import { KeyedMutator } from "swr";


type Props = {
    leagueRound: ISeasonRound,
    children?: ReactNode,
    roundGames: IFixture[],
    onUpdateTeam: KeyedMutator<IFantasyLeagueTeam | undefined>
}

/** Providers a sudo Fantasy Team Provider in order to create a fantasy team */
export default function CreateTeamProvider({leagueRound, children, roundGames, onUpdateTeam}: Props) {

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

    }, [authUser, leagueRound.id]);

    if (!fakeTeam) {
        return;
    }

    return (
        <MyTeamProvider
            team={fakeTeam}
            round={leagueRound}
            manager={authUser}
            roundGames={roundGames}
            isReadOnly={false}
            onUpdateTeam={onUpdateTeam}
        >
            {children}
        </MyTeamProvider>
    )
}