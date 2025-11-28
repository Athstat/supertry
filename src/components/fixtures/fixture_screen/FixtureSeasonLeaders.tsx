import { useMemo } from "react";
import { useTeamSeasonLeaders } from "../../../hooks/teams/useTeamSeasonLeaders"
import { IFixture } from "../../../types/games"
import { TeamSeasonLeader } from "../../../types/team";
import RoundedCard from "../../shared/RoundedCard";
import { useSportActions } from "../../stats/SportActionsDefinitionsProvider";
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";

type Props = {
    fixture: IFixture
}

export default function FixtureSeasonLeaders({ fixture }: Props) {

    const { team, opposition_team } = fixture;
    const { leaders: leaders1, isLoading: loadingHome } = useTeamSeasonLeaders(team?.athstat_id, fixture.league_id);
    const { leaders: leaders2, isLoading: loadingAway } = useTeamSeasonLeaders(opposition_team?.athstat_id, fixture.league_id);

    const isLoading = loadingAway || loadingHome;
    const homeLeaders = useMemo(() => leaders1 ?? [], [leaders1]);
    const awayLeaders = useMemo(() => leaders2 ?? [], [leaders2]);

    if (isLoading) {
        return (
            <RoundedCard className={"p-4 dark:border-none h-[100px] animate-pulse border-none"}>
            </RoundedCard>
        )
    }


    return (
        <RoundedCard className={"p-4 dark:border-none"}>
            <div className="flex flex-row items-center justify-center" >
                <p className="text-sm font-semibold" >Season Leaders</p>
            </div>

            <div className="flex flex-col gap-2" >
                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={['tries', "Tries"]}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={['passes', "Passes"]}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={['tackles', "Tackles"]}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={['points', "Points"]}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={["carry_dominant", 'CarryDominant']}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={["conversion_goals", 'ConversionGoals']}
                />
            </div>

        </RoundedCard>
    )
}

type StatLeaderItemProps = {
    team1Leaders: TeamSeasonLeader[],
    team2Leaders: TeamSeasonLeader[],
    actionNames: string[],
}

function StatLeadersItem({ actionNames, team1Leaders, team2Leaders }: StatLeaderItemProps) {

    const { defintions } = useSportActions();

    const actionDef = useMemo(() => {
        return defintions.find((d) => {
            return actionNames.includes(d.action_name);
        })
    }, [actionNames, defintions]);

    const leader1 = useMemo(() => {
        return team1Leaders.find((l) => {
            return actionNames.includes(l.action);
        })
    }, [actionNames, team1Leaders])

    const leader2 = useMemo(() => {
        return team2Leaders.find((l) => {
            return actionNames.includes(l.action);
        })
    }, [actionNames, team2Leaders])

    const abbreviatePlayerName = (firstName?: string, lastName?: string) => {
        const hasFirstName = firstName && firstName.length > 0;
        const hasLastName = lastName && lastName.length > 0;

        if (hasFirstName && hasLastName) {
            return `${firstName[0]}. ${lastName}`;
        }

        return `${firstName} ${lastName}`
    }

    if (!leader1 || !leader2) {
        return null;
    }

    return (
        <div className="flex flex-row items-center justify-between" >

            <div className="flex flex-row items-center gap-1" >
                
                <div className="flex flex-col items-center gap-1" >
                    <SmartPlayerMugshot
                        url={leader1?.image_url}
                        teamId={leader1?.team_id}
                    />

                    <p className="text-[10px] text-center w-[80px] truncate" >
                        {abbreviatePlayerName(leader1?.athstat_firstname, leader1?.athstat_lastname)}
                    </p>
                </div>

                <div>
                    <p className="font-semibold text-sm" >{leader1?.action_count ? leader1.action_count.toFixed(1) : leader1?.action_count}</p>
                </div>
            </div>

            <div>
                <SecondaryText className="text-xs" >{actionDef?.display_name}</SecondaryText>
            </div>

            <div key={leader2?.athlete_id} className="flex flex-row items-center gap-1" >

                <div>
                    <p className="font-semibold text-sm" >{leader2?.action_count ? leader2.action_count.toFixed(1) : leader2?.action_count}</p>
                </div>

                <div className="flex flex-col items-center gap-1" >
                    <SmartPlayerMugshot
                        url={leader2?.image_url}
                        teamId={leader2?.team_id}
                    />

                    <p className="text-[10px] text-center w-[80px] truncate" >
                        {abbreviatePlayerName(leader2?.athstat_firstname, leader2?.athstat_lastname)}
                    </p>
                </div>

            </div>
        </div>
    )
}