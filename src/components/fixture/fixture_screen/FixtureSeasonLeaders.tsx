import { useMemo } from "react";
import { useTeamSeasonLeaders } from "../../../hooks/teams/useTeamSeasonLeaders"
import { IFixture } from "../../../types/games"
import { TeamSeasonLeader } from "../../../types/team";
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot";
import SecondaryText from "../../ui/typography/SecondaryText";
import TeamLogo from "../../team/TeamLogo";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import { sanitizeStat } from "../../../utils/stringUtils";
import { IProAthlete } from "../../../types/athletes";
import RoundedCard from "../../ui/cards/RoundedCard";
import { useSportActions } from "../../../hooks/useSportActions";

type Props = {
    fixture: IFixture,
    onPlayerClick?: (player: IProAthlete) => void
}

export default function FixtureSeasonLeaders({ fixture, onPlayerClick }: Props) {

    const { team, opposition_team } = fixture;
    const { matchFinal } = fixtureSummary(fixture);
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

    if (matchFinal) {
        return null;
    }

    return (
        <RoundedCard className={"p-4 dark:border-none flex flex-col gap-4"}>
            <div className="flex flex-row px-8 items-center justify-between" >

                <div className="flex flex-row flex-1 items-center justify-start" >
                    <TeamLogo
                        url={fixture.team?.image_url}
                        className="w-6 h-6"
                    />
                </div>

                <div className="flex-2 w-full flex flex-row items-center justify-center" >
                    <p className="text-[12px] text-nowrap font-semibold" >Season Leaders</p>
                </div>

                <div className="flex flex-row flex-1 items-center justify-end" >
                    <TeamLogo
                        url={fixture.opposition_team?.image_url}
                        className="w-6 h-6"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2" >
                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={['tries', "Tries"]}
                    onClick={onPlayerClick}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={['passes', "Passes"]}
                    onClick={onPlayerClick}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={['tackles', "Tackles"]}
                    onClick={onPlayerClick}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={['points', "Points"]}
                    onClick={onPlayerClick}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={["carry_dominant", 'CarryDominant']}
                    onClick={onPlayerClick}
                />

                <StatLeadersItem
                    team1Leaders={homeLeaders}
                    team2Leaders={awayLeaders}
                    actionNames={["conversion_goals", 'ConversionGoals']}
                    onClick={onPlayerClick}
                />
            </div>
        </RoundedCard>
    )
}

type StatLeaderItemProps = {
    team1Leaders: TeamSeasonLeader[],
    team2Leaders: TeamSeasonLeader[],
    actionNames: string[],
    onClick?: (player: IProAthlete) => void
}

function StatLeadersItem({ actionNames, team1Leaders, team2Leaders, onClick }: StatLeaderItemProps) {

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

    const handleClickPlayer = (leader: TeamSeasonLeader) => {
        if (onClick) {

            const playerInfoObj: IProAthlete = {
                tracking_id: leader.athlete_id,
                ...leader
            } 

            onClick(playerInfoObj);
        }
    }

    if (!leader1 || !leader2) {
        return null;
    }



    return (
        <div className="flex flex-row items-center justify-between" >

            <div key={leader1?.athlete_id} onClick={() => handleClickPlayer(leader1)} className="flex flex-row items-center gap-1" >

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
                    <p className="font-semibold text-xs" >{sanitizeStat(leader1?.action_count)}</p>
                </div>
            </div>

            <div>
                <SecondaryText className="text-xs text-wrap max-w-[100px] text-center" >{actionDef?.display_name}</SecondaryText>
            </div>

            <div onClick={() => handleClickPlayer(leader2)} key={leader2?.athlete_id} className="flex flex-row items-center gap-1" >

                <div>
                    <p className="font-semibold text-xs" >{sanitizeStat(leader2?.action_count)}</p>
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